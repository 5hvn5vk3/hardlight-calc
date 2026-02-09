import { clampChannel, type Rgb } from "./hardLight.js";

const HEX_COLOR_PATTERN = /^#([0-9a-f]{6})$/;

export function hexToRgb(hex: string): Rgb {
  const normalized = hex.toLowerCase();
  const match = normalized.match(HEX_COLOR_PATTERN);
  if (!match) {
    throw new Error("hex must be #rrggbb");
  }

  const body = match[1];
  return [
    clampChannel(parseInt(body.slice(0, 2), 16)),
    clampChannel(parseInt(body.slice(2, 4), 16)),
    clampChannel(parseInt(body.slice(4, 6), 16)),
  ];
}
