import { describe, expect, it } from "vitest";
import { formatClipboardText, rgbToHex } from "./format";

describe("rgbToHex", () => {
  it("RGBを小文字の16進カラー文字列に変換する", () => {
    expect(rgbToHex([0, 15, 255])).toBe("#000fff");
  });

  it("1桁の値はゼロ埋めする", () => {
    expect(rgbToHex([1, 2, 3])).toBe("#010203");
  });
});

describe("formatClipboardText", () => {
  it("仕様どおりのコピー文言を返す", () => {
    const base = [1, 2, 3] as const;
    const blend = [254, 16, 0] as const;

    expect(formatClipboardText(base, blend)).toBe(
      "基本色: #010203, 合成色: #fe1000",
    );
  });
});
