import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import { createToastController } from "./toast";

describe("createToastController", () => {
  beforeEach(() => {
    vi.useFakeTimers();
  });

  afterEach(() => {
    vi.clearAllTimers();
    vi.useRealTimers();
  });

  it("showOnce で表示され、指定時間後に消える", () => {
    const element = { textContent: "" } as HTMLElement;
    const toast = createToastController(element);

    toast.showOnce("saved", 1000);
    expect(element.textContent).toBe("saved");

    vi.advanceTimersByTime(999);
    expect(element.textContent).toBe("saved");

    vi.advanceTimersByTime(1);
    expect(element.textContent).toBe("");
  });

  it("連続 showOnce で前のタイマーを破棄し、最後のメッセージを維持する", () => {
    const element = { textContent: "" } as HTMLElement;
    const toast = createToastController(element);

    toast.showOnce("first", 1000);
    vi.advanceTimersByTime(500);
    toast.showOnce("second", 1000);

    vi.advanceTimersByTime(500);
    expect(element.textContent).toBe("second");

    vi.advanceTimersByTime(500);
    expect(element.textContent).toBe("");
  });

  it("clear で即座に非表示になる", () => {
    const element = { textContent: "" } as HTMLElement;
    const toast = createToastController(element);

    toast.showOnce("saved", 1000);
    toast.clear();

    expect(element.textContent).toBe("");

    vi.advanceTimersByTime(1000);
    expect(element.textContent).toBe("");
  });
});
