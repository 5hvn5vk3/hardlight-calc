import { describe, expect, it } from "vitest";
import { initialState, transition } from "./state";

describe("state transition", () => {
  it("idle -> basePicked (基本色取得成功)", () => {
    const next = transition(initialState, {
      type: "BASE_PICKED",
      base: [10, 20, 30],
    });

    expect(next).toEqual({
      status: "basePicked",
      base: [10, 20, 30],
    });
  });

  it("基本色取得失敗時は idle を維持しメッセージを保持する", () => {
    const next = transition(initialState, {
      type: "BASE_PICK_FAILED",
      message: "色の取得に失敗しました。もう一度お試しください",
    });

    expect(next).toEqual({
      status: "idle",
      message: "色の取得に失敗しました。もう一度お試しください",
    });
  });

  it("basePicked -> success (結果取得・逆算・コピー成功)", () => {
    const current = {
      status: "basePicked" as const,
      base: [10, 20, 30] as const,
    };

    const next = transition(current, {
      type: "RESULT_RESOLVED",
      result: [100, 110, 120],
      blend: [90, 95, 100],
      errors: [0, 0, 0],
      totalError: 0,
      exactMatch: true,
      copiedText: "基本色: #0a141e, 合成色: #5a5f64",
    });

    expect(next).toEqual({
      status: "success",
      base: [10, 20, 30],
      result: [100, 110, 120],
      blend: [90, 95, 100],
      errors: [0, 0, 0],
      totalError: 0,
      exactMatch: true,
      copiedText: "基本色: #0a141e, 合成色: #5a5f64",
    });
  });

  it("basePicked -> error (コピー失敗)", () => {
    const current = {
      status: "basePicked" as const,
      base: [10, 20, 30] as const,
    };

    const next = transition(current, {
      type: "COPY_FAILED",
      message: "クリップボードへの保存に失敗しました",
    });

    expect(next).toEqual({
      status: "error",
      base: [10, 20, 30],
      message: "クリップボードへの保存に失敗しました",
    });
  });

  it("EyeDropperキャンセル時は状態を維持する", () => {
    const current = {
      status: "basePicked" as const,
      base: [10, 20, 30] as const,
    };

    expect(transition(current, { type: "BASE_PICK_CANCELED" })).toEqual(current);
    expect(transition(current, { type: "RESULT_PICK_CANCELED" })).toEqual(current);
  });

  it("結果色取得失敗時は basePicked を維持しメッセージを保持する", () => {
    const current = {
      status: "basePicked" as const,
      base: [10, 20, 30] as const,
    };

    const next = transition(current, {
      type: "RESULT_PICK_FAILED",
      message: "色の取得に失敗しました。もう一度お試しください",
    });

    expect(next).toEqual({
      status: "basePicked",
      base: [10, 20, 30],
      message: "色の取得に失敗しました。もう一度お試しください",
    });
  });

  it("任意状態 -> idle (リセット)", () => {
    const errorState = {
      status: "error" as const,
      base: [10, 20, 30] as const,
      message: "copy failed",
    };

    expect(transition(errorState, { type: "RESET" })).toEqual(initialState);
  });

  it("idle からでも ERROR イベントで error に遷移できる", () => {
    expect(
      transition(initialState, {
        type: "ERROR",
        message: "この環境ではスポイト機能を使用できません",
      }),
    ).toEqual({
      status: "error",
      message: "この環境ではスポイト機能を使用できません",
    });
  });
});
