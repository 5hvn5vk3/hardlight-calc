import { hexToRgb } from "../core/color";
import type { Rgb } from "../core/hardLight";

type EyeDropperLike = {
  open: () => Promise<{ sRGBHex: string }>;
};

declare global {
  interface Window {
    EyeDropper?: new () => EyeDropperLike;
  }
}

export function isEyeDropperSupported(): boolean {
  return typeof window !== "undefined" && typeof window.EyeDropper === "function";
}

export async function pickColorWithEyeDropper(): Promise<Rgb> {
  if (!isEyeDropperSupported()) {
    throw new Error("EyeDropper is not supported");
  }

  const eyeDropper = new window.EyeDropper!();
  const result = await eyeDropper.open();
  return hexToRgb(result.sRGBHex);
}
