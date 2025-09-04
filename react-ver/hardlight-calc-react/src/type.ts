export type RGB = {
    r: number;
    g: number;
    b: number;
};

export type ColorFieldProps = {
    whichLayer: RGB;
    partOfColor: keyof RGB;
    label: string;
    setColor: (color: RGB) => void;
};

export type ColorRowProps = {
    LayerName: string;
    whichLayer: RGB;
    setColor: (color: RGB) => void;
};

