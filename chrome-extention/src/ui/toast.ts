export type ToastController = {
  clear: () => void;
  showOnce: (message: string, durationMs?: number) => void;
};

export function createToastController(toastElement: HTMLElement): ToastController {
  let timerId: ReturnType<typeof setTimeout> | null = null;

  const clear = (): void => {
    if (timerId !== null) {
      globalThis.clearTimeout(timerId);
      timerId = null;
    }
    toastElement.textContent = "";
  };

  const showOnce = (message: string, durationMs = 2000): void => {
    clear();
    toastElement.textContent = message;
    timerId = globalThis.setTimeout(() => {
      toastElement.textContent = "";
      timerId = null;
    }, durationMs);
  };

  return { clear, showOnce };
}
