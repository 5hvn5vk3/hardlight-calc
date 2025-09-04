import { OutputField } from "./OutputField";
import type { ColorRowProps } from "../../type";

export const OutputRow = (props: ColorRowProps) => {
    const { LayerName, whichLayer, setColor } = props;
    return (
        <div className="flex items-center gap-2 mt-1 pt-4 border-t border-gray-300">
        <span className="text-black w-15 text-sm font-bold flex-shrink-0">{LayerName} :</span>
        <div className="flex gap-2">
          <OutputField whichLayer={whichLayer} partOfColor="r" label="R" setColor={setColor} />
          <OutputField whichLayer={whichLayer} partOfColor="g" label="G" setColor={setColor} />
          <OutputField whichLayer={whichLayer} partOfColor="b" label="B" setColor={setColor} />
        </div>
        <div
          className="w-10 h-10 border border-gray-600 rounded-md ml-auto flex-shrink-0"
          style={{ backgroundColor: `rgb(${whichLayer.r}, ${whichLayer.g}, ${whichLayer.b})` }}
        ></div>
      </div>
    );
};