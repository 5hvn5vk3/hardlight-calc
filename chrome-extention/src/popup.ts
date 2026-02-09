import { createPopupController, messages } from "./app/controller.js";
import { formatClipboardText } from "./core/format.js";
import { solveBlendColor, type Rgb } from "./core/hardLight.js";
import type { AppState } from "./core/state.js";
import { copyText } from "./platform/clipboard.js";
import { isEyeDropperSupported, pickColorWithEyeDropper } from "./platform/eyedropper.js";
import { createToastController } from "./ui/toast.js";

type UiRefs = {
  startBaseButton: HTMLButtonElement;
  pickResultButton: HTMLButtonElement;
  resetButton: HTMLButtonElement;
  statusText: HTMLElement;
  toastText: HTMLElement;
};


function getUiRefs(): UiRefs {
  const startBaseButton = document.getElementById("start-base") as HTMLButtonElement | null;
  const pickResultButton = document.getElementById("pick-result") as HTMLButtonElement | null;
  const resetButton = document.getElementById("reset") as HTMLButtonElement | null;
  const statusText = document.getElementById("status") as HTMLElement | null;
  const toastText = document.getElementById("toast") as HTMLElement | null;

  if (!startBaseButton || !pickResultButton || !resetButton || !statusText || !toastText) {
    throw new Error("popup UI elements are missing");
  }

  return { startBaseButton, pickResultButton, resetButton, statusText, toastText };
}

function rgbToLabel(rgb: Rgb): string {
  return `(${rgb[0]}, ${rgb[1]}, ${rgb[2]})`;
}

function renderFactory(ui: UiRefs) {
  const toast = createToastController(ui.toastText);
  let previousStatus: AppState["status"] | null = null;

  return (state: AppState): void => {
    if (state.status === "success" && previousStatus !== "success") {
      toast.showOnce(messages.successToast);
    }

    if (state.status !== "success" && previousStatus === "success") {
      toast.clear();
    }

    if (state.status === "idle") {
      ui.startBaseButton.hidden = false;
      ui.pickResultButton.hidden = true;
      ui.statusText.textContent = "基本色を取得してください";
      previousStatus = state.status;
      return;
    }

    if (state.status === "basePicked") {
      ui.startBaseButton.hidden = true;
      ui.pickResultButton.hidden = false;
      ui.statusText.textContent = `基本色を取得済み: ${rgbToLabel(state.base)}`;
      previousStatus = state.status;
      return;
    }

    if (state.status === "success") {
      ui.startBaseButton.hidden = true;
      ui.pickResultButton.hidden = false;
      ui.statusText.textContent = `成功: ${state.copiedText}`;
      previousStatus = state.status;
      return;
    }

    ui.startBaseButton.hidden = state.base !== undefined;
    ui.pickResultButton.hidden = state.base === undefined;
    ui.statusText.textContent = state.message;
    previousStatus = state.status;
  };
}

const ui = getUiRefs();
const controller = createPopupController({
  isEyeDropperSupported,
  pickColor: pickColorWithEyeDropper,
  solveBlendColor,
  formatClipboardText,
  copyText,
  render: renderFactory(ui),
});

ui.startBaseButton.addEventListener("click", () => {
  void controller.startBasePick();
});

ui.pickResultButton.addEventListener("click", () => {
  void controller.pickResult();
});

ui.resetButton.addEventListener("click", () => {
  controller.reset();
});
