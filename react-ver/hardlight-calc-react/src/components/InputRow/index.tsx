import type { ColorRowProps } from "../../type";

export const InputRow = (props: ColorRowProps) => {
    const { LayerName, whichLayer, children } = props;
    return (
        <div className="flex items-center gap-2">
            <span className="text-black w-15 text-sm font-bold flex-shrink-0">{LayerName} :</span>
            <div className="flex gap-2">
                {children}
            </div>
            <div 
            className="w-10 h-10 border border-gray-600 rounded-md ml-auto flex-shrink-0"
            style={{ backgroundColor: `rgb(${whichLayer.r}, ${whichLayer.g}, ${whichLayer.b})` }}
            ></div>
        </div>
    );
};