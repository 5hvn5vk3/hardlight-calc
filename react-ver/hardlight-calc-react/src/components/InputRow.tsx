import { InputField } from "./InputField";
import type { RGB } from "../type";

type InputRowProps = {
    whichLayer: RGB;
    setColor: (color: RGB) => void;
};

export const InputRow = (props: InputRowProps) => {
    const { whichLayer, setColor } = props;
    return (
        <div className="flex items-center gap-2">
            <span className="text-black w-15 text-sm font-bold flex-shrink-0">基本色 :</span>
            <div className="flex gap-2">
                <InputField whichLayer={whichLayer} partOfColor="r" label="R" setColor={setColor} />
                <InputField whichLayer={whichLayer} partOfColor="g" label="G" setColor={setColor} />
                <InputField whichLayer={whichLayer} partOfColor="b" label="B" setColor={setColor} />
            </div>
            <div 
            className="w-10 h-10 border border-gray-600 rounded-md ml-auto flex-shrink-0"
            style={{ backgroundColor: `rgb(${whichLayer.r}, ${whichLayer.g}, ${whichLayer.b})` }}
            ></div>
        </div>
    );
};