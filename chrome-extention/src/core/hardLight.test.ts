import { describe, expect, it } from "vitest";
import { hardLight, pickBestCandidate, solveBlendChannel } from "./hardLight";

describe("hardLight", () => {
  it("blend が 128 未満の式で計算する", () => {
    expect(hardLight(100, 50)).toBe(39);
  });

  it("blend が 128 以上の式で計算する", () => {
    expect(hardLight(100, 200)).toBe(188);
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
  it("解がない場合は null を返す", () => {
    expect(solveBlendChannel(0, 2)).toBeNull();
  });

  it("候補が複数ある場合は 128 に最も近い候補を返す", () => {
    expect(solveBlendChannel(0, 0)).toBe(127);
  });

  it("返した候補は順方向に適用すると result と一致する", () => {
    const base = 193;
    const result = 142;
    const blend = solveBlendChannel(base, result);

    expect(blend).not.toBeNull();
    expect(hardLight(base, blend as number)).toBe(result);
  });
});
