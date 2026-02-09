import { describe, expect, it, vi } from "vitest";
import { createPopupController, messages } from "./controller";
import type { Rgb } from "../core/hardLight";

function createDeps(overrides?: Partial<Parameters<typeof createPopupController>[0]>) {
  const render = vi.fn();
  const pickColor = vi.fn<() => Promise<Rgb>>();
  const copyText = vi.fn<(value: string) => Promise<void>>().mockResolvedValue();

  const deps = {
    isEyeDropperSupported: () => true,
    pickColor,
    solveBlendColor: () => ({
      blend: [7, 8, 9] as const,
      errors: [0, 0, 0] as const,
      totalError: 0,
      exactMatch: true,
    }),
    formatClipboardText: () => "基本色: #010203, 合成色: #070809",
    copyText,
    render,
    ...overrides,
  };

  return { deps, render, pickColor, copyText };
}

describe("createPopupController", () => {
  it("初期化時に idle を描画する", () => {
    const { deps, render } = createDeps();

    createPopupController(deps);

    expect(render).toHaveBeenCalledWith({ status: "idle" });
  });

  it("2回のスポイト成功で success に遷移しコピーする", async () => {
    const { deps, pickColor, copyText } = createDeps();
    pickColor.mockResolvedValueOnce([1, 2, 3]).mockResolvedValueOnce([4, 5, 6]);

    const controller = createPopupController(deps);
    await controller.startBasePick();
    await controller.pickResult();

    expect(controller.getState().status).toBe("success");
    expect(copyText).toHaveBeenCalledWith("基本色: #010203, 合成色: #070809");
  });

  it("誤差あり逆算でも success に遷移しコピーする", async () => {
    const { deps, pickColor, copyText } = createDeps({
      solveBlendColor: () => ({
        blend: [7, 8, 9] as const,
        errors: [1, 0, 2] as const,
        totalError: 3,
        exactMatch: false,
      }),
    });
    pickColor.mockResolvedValueOnce([1, 2, 3]).mockResolvedValueOnce([9, 9, 9]);

    const controller = createPopupController(deps);
    await controller.startBasePick();
    await controller.pickResult();

    expect(controller.getState()).toEqual({
      status: "success",
      base: [1, 2, 3],
      result: [9, 9, 9],
      blend: [7, 8, 9],
      errors: [1, 0, 2],
      totalError: 3,
      exactMatch: false,
      copiedText: "基本色: #010203, 合成色: #070809",
    });
    expect(copyText).toHaveBeenCalledWith("基本色: #010203, 合成色: #070809");
  });

  it("コピー失敗なら error に遷移する", async () => {
    const { deps, pickColor } = createDeps({
      copyText: vi.fn<(value: string) => Promise<void>>().mockRejectedValue(new Error("x")),
    });
    pickColor.mockResolvedValueOnce([1, 2, 3]).mockResolvedValueOnce([4, 5, 6]);

    const controller = createPopupController(deps);
    await controller.startBasePick();
    await controller.pickResult();

    expect(controller.getState()).toEqual({
      status: "error",
      base: [1, 2, 3],
      message: messages.copyFailed,
    });
  });

  it("スポイト非対応なら error に遷移する", async () => {
    const { deps } = createDeps({ isEyeDropperSupported: () => false });

    const controller = createPopupController(deps);
    await controller.startBasePick();

    expect(controller.getState()).toEqual({
      status: "error",
      message: messages.eyedropperUnsupported,
    });
  });

  it("基本色の取得失敗時は idle を維持してエラーメッセージを持つ", async () => {
    const { deps, pickColor } = createDeps();
    pickColor.mockRejectedValueOnce(new Error("pick failed"));

    const controller = createPopupController(deps);
    await controller.startBasePick();

    expect(controller.getState()).toEqual({
      status: "idle",
      message: messages.pickFailed,
    });
  });

  it("結果色の取得失敗時は basePicked を維持してエラーメッセージを持つ", async () => {
    const { deps, pickColor, copyText } = createDeps();
    pickColor.mockResolvedValueOnce([1, 2, 3]).mockRejectedValueOnce(new Error("pick failed"));

    const controller = createPopupController(deps);
    await controller.startBasePick();
    await controller.pickResult();

    expect(controller.getState()).toEqual({
      status: "basePicked",
      base: [1, 2, 3],
      message: messages.pickFailed,
    });
    expect(copyText).not.toHaveBeenCalled();
  });

  it("キャンセルは状態維持", async () => {
    const abortError = new DOMException("cancel", "AbortError");
    const { deps, pickColor } = createDeps();
    pickColor.mockRejectedValueOnce(abortError);

    const controller = createPopupController(deps);
    await controller.startBasePick();

    expect(controller.getState()).toEqual({ status: "idle" });
  });
});
