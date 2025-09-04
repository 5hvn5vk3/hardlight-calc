import type {ColorFieldProps } from "../../type";

export const InputField = (props: ColorFieldProps) => {
    const {whichLayer, partOfColor, label ,setColor} = props;
    return (
    <div className="flex items-center gap-1">
        <label className="text-black font-bold">{label}</label>
        <input
        type="number"
        value={whichLayer[partOfColor]}
        onChange={(e) => setColor({ ...whichLayer, [partOfColor]: parseInt(e.target.value) })}
        min="0"
        max="255"
        className="text-black bg-white w-11 text-right p-1 border border-gray-300 rounded [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none"
        />
    </div>
  );
};