import { describe, expect, it } from "vitest";
import {
  hardLight,
  pickBestCandidate,
  solveBlendChannel,
  solveBlendColor,
} from "./hardLight";

describe("hardLight", () => {
  it("blend が 128 未満の式で計算する", () => {
    expect(hardLight(100, 50)).toBe(39);
  });

  it("blend が 128 以上の式で計算する", () => {
    expect(hardLight(100, 200)).toBe(188);
  });

  it("境界値: blend=0 で最小側の挙動を満たす", () => {
    expect(hardLight(0, 0)).toBe(0);
    expect(hardLight(255, 0)).toBe(0);
  });

  it("境界値: blend=127 は 128 未満の式で計算する", () => {
    expect(hardLight(100, 127)).toBe(Math.round((2 * 100 * 127) / 255));
  });

  it("境界値: blend=128 は 128 以上の式で計算する", () => {
    expect(hardLight(100, 128)).toBe(
      Math.round(255 - (2 * (255 - 100) * (255 - 128)) / 255),
    );
  });

  it("境界値: blend=255 で最大側の挙動を満たす", () => {
    expect(hardLight(0, 255)).toBe(255);
    expect(hardLight(255, 255)).toBe(255);
  });

  it("特例: base=0 は blend に関係なく上側の式で計算する", () => {
    const expected127 = Math.max(
      0,
      Math.min(255, Math.round(255 - (2 * (255 - 0) * (255 - 127)) / 255)),
    );
    const expected128 = Math.max(
      0,
      Math.min(255, Math.round(255 - (2 * (255 - 0) * (255 - 128)) / 255)),
    );

    expect(hardLight(0, 127)).toBe(expected127);
    expect(hardLight(0, 128)).toBe(expected128);
  });

  it("特例: base=255 は blend に関係なく下側の式で計算する", () => {
    const expected127 = Math.max(0, Math.min(255, Math.round((2 * 255 * 127) / 255)));
    const expected128 = Math.max(0, Math.min(255, Math.round((2 * 255 * 128) / 255)));

    expect(hardLight(255, 127)).toBe(expected127);
    expect(hardLight(255, 128)).toBe(expected128);
  });
});

describe("pickBestCandidate", () => {
  it("空配列なら null を返す", () => {
    expect(pickBestCandidate([])).toBeNull();
  });

  it("128 に最も近い値を採用する", () => {
    expect(pickBestCandidate([0, 64, 127, 255])).toBe(127);
  });

  it("同点なら大きい値を採用する", () => {
    expect(pickBestCandidate([127, 129])).toBe(129);
  });
});

describe("solveBlendChannel", () => {
  it("最小誤差の候補を返す（常に1解）", () => {
    expect(solveBlendChannel(0, 2)).toEqual({ blend: 128, error: 1 });
  });

  it("最小誤差候補が複数なら 128 近傍優先で返す", () => {
    expect(solveBlendChannel(255, 215)).toEqual({ blend: 108, error: 1 });
  });

  it("誤差0のとき返した候補は順方向で result と一致する", () => {
    const base = 193;
    const result = 142;
    const blend = solveBlendChannel(base, result);

    expect(blend.error).toBe(0);
    expect(hardLight(base, blend.blend)).toBe(result);
  });
});

describe("solveBlendColor", () => {
  it("誤差0なら exactMatch=true で返す", () => {
    const base = [100, 150, 200] as const;
    const expectedBlend = [80, 140, 220] as const;
    const result = [
      hardLight(base[0], expectedBlend[0]),
      hardLight(base[1], expectedBlend[1]),
      hardLight(base[2], expectedBlend[2]),
    ] as const;

    expect(solveBlendColor(base, result)).toEqual({
      blend: expectedBlend,
      errors: [0, 0, 0],
      totalError: 0,
      exactMatch: true,
    });
  });

  it("誤差があっても常に1解を返す", () => {
    const base = [0, 255, 128] as const;
    const result = [2, 215, 100] as const;

    expect(solveBlendColor(base, result)).toEqual({
      blend: [128, 108, 100],
      errors: [1, 1, 0],
      totalError: 2,
      exactMatch: false,
    });
  });
});
