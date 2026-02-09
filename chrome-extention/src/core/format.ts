import type { Rgb } from "./hardLight";

function toHexChannel(value: number): string {
  if (!Number.isInteger(value) || value < 0 || value > 255) {
    throw new Error("channel must be an integer between 0 and 255");
  }

  return value.toString(16).padStart(2, "0");
}

export function rgbToHex(rgb: Rgb): string {
  return `#${toHexChannel(rgb[0])}${toHexChannel(rgb[1])}${toHexChannel(rgb[2])}`;
}

export function formatClipboardText(baseRgb: Rgb, blendRgb: Rgb): string {
  return `基本色: ${rgbToHex(baseRgb)}, 合成色: ${rgbToHex(blendRgb)}`;
}
