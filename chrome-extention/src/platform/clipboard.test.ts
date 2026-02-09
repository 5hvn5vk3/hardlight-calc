import { describe, expect, it, vi } from "vitest";
import { copyText } from "./clipboard";

describe("copyText", () => {
  it("指定した writer でテキストをコピーする", async () => {
    const writer = vi.fn<(value: string) => Promise<void>>().mockResolvedValue();

    await copyText("hello", writer);

    expect(writer).toHaveBeenCalledWith("hello");
  });

  it("writer が例外を投げたらそのまま reject する", async () => {
    const writer = vi.fn<(value: string) => Promise<void>>().mockRejectedValue(
      new Error("failed"),
    );

    await expect(copyText("hello", writer)).rejects.toThrow("failed");
  });
});
