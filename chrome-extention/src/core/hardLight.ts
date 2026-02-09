export type Channel = number;
export type Rgb = readonly [Channel, Channel, Channel];
export type ChannelSolveResult = {
  blend: Channel;
  error: number;
};
export type ColorSolveResult = {
  blend: Rgb;
  errors: readonly [number, number, number];
  totalError: number;
  exactMatch: boolean;
};

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
  if (base === 0) {
    return clampChannel(255 - (2 * (255 - base) * (255 - blend)) / 255);
  }

  if (base === 255) {
    return clampChannel((2 * base * blend) / 255);
  }

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
): ChannelSolveResult {
  const candidates: Channel[] = [];
  let minError = Number.POSITIVE_INFINITY;

  for (let s = 0; s <= 255; s += 1) {
    const predicted = hardLight(base, s);
    const error = Math.abs(predicted - result);

    if (error > minError) {
      continue;
    }

    if (error < minError) {
      minError = error;
      candidates.length = 0;
    }

    candidates.push(s);
  }

  const blend = pickBestCandidate(candidates);
  if (blend === null) {
    throw new Error("unreachable: no candidate found");
  }

  return { blend, error: minError };
}

export function solveBlendColor(base: Rgb, result: Rgb): ColorSolveResult {
  const r = solveBlendChannel(base[0], result[0]);
  const g = solveBlendChannel(base[1], result[1]);
  const b = solveBlendChannel(base[2], result[2]);

  const blend: Rgb = [r.blend, g.blend, b.blend];
  const errors: readonly [number, number, number] = [r.error, g.error, b.error];
  const totalError = r.error + g.error + b.error;

  return {
    blend,
    errors,
    totalError,
    exactMatch: totalError === 0,
  };
}
