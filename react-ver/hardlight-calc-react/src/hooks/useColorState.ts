import { useState } from "react";
import type { RGB } from "../type";

type Colors = {
    baseColor: RGB;
    setBaseColor: React.Dispatch<React.SetStateAction<RGB>>;
    blendColor: RGB;
    setBlendColor: React.Dispatch<React.SetStateAction<RGB>>;
    compositeColor: RGB;
    setCompositeColor: React.Dispatch<React.SetStateAction<RGB>>;
};

export const useColorState = (): Colors => {
    const [baseColor, setBaseColor] = useState<RGB>({ r: 0, g: 0, b: 0 });
    const [blendColor, setBlendColor] = useState<RGB>({ r: 0, g: 0, b: 0 });
    const [compositeColor, setCompositeColor] = useState<RGB>({ r: 0, g: 0, b: 0 });
    return {
        baseColor,
        setBaseColor,
        blendColor,
        setBlendColor,
        compositeColor,
        setCompositeColor,
    };
};