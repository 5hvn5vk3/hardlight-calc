import type { RGB } from "../type";

export const ClickInvertHLButton = (baseColor:RGB, blendColor:RGB, setCompositeColor: React.Dispatch<React.SetStateAction<RGB>>) => {
    const newCompositeColor = {
      r: invertHardLight(baseColor.r, blendColor.r),
      g: invertHardLight(baseColor.g, blendColor.g),
      b: invertHardLight(baseColor.b, blendColor.b),
    };
    setCompositeColor(newCompositeColor);
  };

const invertHardLight = (base: number, result: number): number => {
    let S = 0.0;
    let M = 0.0;
    if (base === 255) {
      S = result === 255 ? 255 : -Infinity;
    } else {
      S = (255 * (-2 * base + result + 255)) / (2 * (255 - base));
    }
    if (base !== 0) {
      M = (255 * result) / (2 * base);
    }
    const finalValue = base === 0 && result === 0 ? 127 : (S >= 128 ? S : M);
    return Math.max(0, Math.min(255, Math.round(finalValue)));
};