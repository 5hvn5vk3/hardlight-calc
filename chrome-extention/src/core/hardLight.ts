export type Channel = number;

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

export function solveBlendChannel(
  base: Channel,
  result: Channel,
): Channel | null {
  let bestCandidate: Channel | null = null;
  let bestDistance = Number.POSITIVE_INFINITY;

  for (let s = 0; s <= 255; s += 1) {
    if (hardLight(base, s) !== result) {
      continue;
    }

    const distance = Math.abs(s - 128);
    if (distance < bestDistance) {
      bestDistance = distance;
      bestCandidate = s;
      continue;
    }

    if (distance === bestDistance && bestCandidate !== null && s > bestCandidate) {
      bestCandidate = s;
    }
  }

  return bestCandidate;
}
