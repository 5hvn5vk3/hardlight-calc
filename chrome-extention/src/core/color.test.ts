import { describe, expect, it } from "vitest";
import { hexToRgb } from "./color";

describe("hexToRgb", () => {
  it("#rrggbb を RGB に変換する", () => {
    expect(hexToRgb("#0a10ff")).toEqual([10, 16, 255]);
  });

  it("大文字HEXも受け付ける", () => {
    expect(hexToRgb("#A0B1C2")).toEqual([160, 177, 194]);
  });

  it("不正な形式は例外", () => {
    expect(() => hexToRgb("#fff")).toThrow("hex must be #rrggbb");
  });
});
