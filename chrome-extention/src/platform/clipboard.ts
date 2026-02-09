export type ClipboardWriter = (value: string) => Promise<void>;

function getDefaultClipboardWriter(): ClipboardWriter {
  const clipboard = globalThis.navigator?.clipboard;
  if (!clipboard || typeof clipboard.writeText !== "function") {
    throw new Error("Clipboard API is not available");
  }

  return (value: string) => clipboard.writeText(value);
}

export async function copyText(
  value: string,
  writer: ClipboardWriter = getDefaultClipboardWriter(),
): Promise<void> {
  await writer(value);
}
