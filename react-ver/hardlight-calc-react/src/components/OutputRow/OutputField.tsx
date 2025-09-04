import type {ColorFieldProps } from "../../type";

export const OutputField = (props: ColorFieldProps) => {
    const {whichLayer, partOfColor, label ,setColor} = props;
    return (
        <div className="flex items-center gap-1">
        <label className="text-black font-bold">{label}</label>
        <input
          type="number"
          value={whichLayer[partOfColor]}
          onChange={(e) => setColor({ ...whichLayer, [partOfColor]: parseInt(e.target.value) })}
          readOnly
          className="text-black bg-gray-200 w-11 text-right p-1 border border-gray-300 rounded font-bold [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none"
        />
      </div>
    );
};