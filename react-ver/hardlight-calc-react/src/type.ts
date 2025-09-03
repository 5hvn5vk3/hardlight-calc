export type RGB = {
    r: number;
    g: number;
    b: number;
};

export type InputFieldProps = {
    whichLayer: RGB;
    partOfColor: keyof RGB;
    label: string;
    setColor: (color: RGB) => void;
};