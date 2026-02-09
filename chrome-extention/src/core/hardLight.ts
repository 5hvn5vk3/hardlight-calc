export type Channel = number;
export type Rgb = readonly [Channel, Channel, Channel];

export function clampChannel(value: number): Channel {
  if (!Number.isFinite(value)) {
    throw new Error("value must be a finite number");
  }

  if (value < 0) {
    return 0;
  }

  if (value > 255) {
    return 255;
  }

  return Math.round(value);
}

export function hardLight(base: Channel, blend: Channel): Channel {
  if (blend < 128) {
    return clampChannel((2 * base * blend) / 255);
  }

  return clampChannel(255 - (2 * (255 - base) * (255 - blend)) / 255);
}

export function pickBestCandidate(candidates: Channel[]): Channel | null {
  let bestCandidate: Channel | null = null;
  let bestDistance = Number.POSITIVE_INFINITY;

  for (const candidate of candidates) {
    const distance = Math.abs(candidate - 128);
    if (distance < bestDistance) {
      bestDistance = distance;
      bestCandidate = candidate;
      continue;
    }

    if (
      distance === bestDistance &&
      bestCandidate !== null &&
      candidate > bestCandidate
    ) {
      bestCandidate = candidate;
    }
  }

  return bestCandidate;
}

export function solveBlendChannel(
  base: Channel,
  result: Channel,
): Channel | null {
  const candidates: Channel[] = [];

  for (let s = 0; s <= 255; s += 1) {
    if (hardLight(base, s) !== result) {
      continue;
    }

    candidates.push(s);
  }

  return pickBestCandidate(candidates);
}

export function solveBlendColor(base: Rgb, result: Rgb): Rgb | null {
  const r = solveBlendChannel(base[0], result[0]);
  if (r === null) {
    return null;
  }

  const g = solveBlendChannel(base[1], result[1]);
  if (g === null) {
    return null;
  }

  const b = solveBlendChannel(base[2], result[2]);
  if (b === null) {
    return null;
  }

  return [r, g, b];
}
