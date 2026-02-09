import type { Rgb } from "../core/hardLight.js";
import type { AppState } from "../core/state.js";
import { initialState, transition } from "../core/state.js";

export const messages = {
  successToast: "基本色と合成色がクリップボードに保存されました",
  reverseFailed: "合成色を逆算できませんでした",
  eyedropperUnsupported: "この環境ではスポイト機能を使用できません",
  copyFailed: "クリップボードへの保存に失敗しました",
} as const;

export type ControllerDeps = {
  isEyeDropperSupported: () => boolean;
  pickColor: () => Promise<Rgb>;
  solveBlendColor: (base: Rgb, result: Rgb) => Rgb | null;
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

        dispatch({ type: "ERROR", message: messages.eyedropperUnsupported });
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

        dispatch({ type: "RESULT_FAILED", message: messages.reverseFailed });
        return;
      }

      const blend = deps.solveBlendColor(state.base, result);
      if (blend === null) {
        dispatch({ type: "RESULT_FAILED", message: messages.reverseFailed });
        return;
      }

      const copiedText = deps.formatClipboardText(state.base, blend);

      try {
        await deps.copyText(copiedText);
      } catch {
        dispatch({ type: "RESULT_FAILED", message: messages.copyFailed });
        return;
      }

      dispatch({ type: "RESULT_RESOLVED", result, blend, copiedText });
    },
  };
}
