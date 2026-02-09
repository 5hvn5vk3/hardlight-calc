import type { Rgb } from "../core/hardLight.js";
import type { AppState } from "../core/state.js";
import { initialState, transition } from "../core/state.js";

export const messages = {
  successToast: "基本色と合成色がクリップボードに保存されました",
  pickFailed: "色の取得に失敗しました。もう一度お試しください",
  approximateNotice: (errors: readonly [number, number, number]) =>
    `基本色と合成色がクリップボードに保存されました。近似解を使用しました（誤差: R±${errors[0]}, G±${errors[1]}, B±${errors[2]}）`,
  eyedropperUnsupported: "この環境ではスポイト機能を使用できません",
  copyFailed: "クリップボードへの保存に失敗しました",
} as const;

export type ControllerDeps = {
  isEyeDropperSupported: () => boolean;
  pickColor: () => Promise<Rgb>;
  solveBlendColor: (
    base: Rgb,
    result: Rgb,
  ) => {
    blend: Rgb;
    errors: readonly [number, number, number];
    totalError: number;
    exactMatch: boolean;
  };
  formatClipboardText: (base: Rgb, blend: Rgb) => string;
  copyText: (value: string) => Promise<void>;
  render: (state: AppState) => void;
};

function isAbortError(error: unknown): boolean {
  return error instanceof DOMException && error.name === "AbortError";
}

export function createPopupController(deps: ControllerDeps) {
  let state: AppState = initialState;

  const setState = (next: AppState): void => {
    state = next;
    deps.render(state);
  };

  const dispatch = (event: Parameters<typeof transition>[1]): void => {
    setState(transition(state, event));
  };

  deps.render(state);

  return {
    getState(): AppState {
      return state;
    },

    reset(): void {
      dispatch({ type: "RESET" });
    },

    async startBasePick(): Promise<void> {
      if (!deps.isEyeDropperSupported()) {
        dispatch({ type: "ERROR", message: messages.eyedropperUnsupported });
        return;
      }

      try {
        const base = await deps.pickColor();
        dispatch({ type: "BASE_PICKED", base });
      } catch (error) {
        if (isAbortError(error)) {
          dispatch({ type: "BASE_PICK_CANCELED" });
          return;
        }

        dispatch({ type: "BASE_PICK_FAILED", message: messages.pickFailed });
      }
    },

    async pickResult(): Promise<void> {
      if (state.status !== "basePicked") {
        return;
      }

      let result: Rgb;
      try {
        result = await deps.pickColor();
      } catch (error) {
        if (isAbortError(error)) {
          dispatch({ type: "RESULT_PICK_CANCELED" });
          return;
        }

        dispatch({ type: "RESULT_PICK_FAILED", message: messages.pickFailed });
        return;
      }

      const solved = deps.solveBlendColor(state.base, result);
      const copiedText = deps.formatClipboardText(state.base, solved.blend);

      try {
        await deps.copyText(copiedText);
      } catch {
        dispatch({ type: "COPY_FAILED", message: messages.copyFailed });
        return;
      }

      dispatch({
        type: "RESULT_RESOLVED",
        result,
        blend: solved.blend,
        errors: solved.errors,
        totalError: solved.totalError,
        exactMatch: solved.exactMatch,
        copiedText,
      });
    },
  };
}
