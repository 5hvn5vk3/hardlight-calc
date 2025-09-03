import { useState } from 'react';
import { InputRow } from './components/InputRow';
import type { RGB } from './type';

export const App = () => {
  const [baseColor, setBaseColor] = useState<RGB>({ r: 0, g: 0, b: 0 });
  const [blendColor, setBlendColor] = useState<RGB>({ r: 0, g: 0, b: 0 });
  const [compositeColor, setCompositeColor] = useState<RGB>({ r: 0, g: 0, b: 0 });

  const ClickInvertButton = () => {
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

  return (
    <div className="flex flex-col gap-4 w-[380px] p-5 border border-gray-300 rounded-lg font-sans bg-gray-50">

      {/*　説明文　*/}
      <div className="mb-2">
        <h2 className="text-black m-0 mb-0 text-xl text-left font-normal">
          ハードライト合成色逆算機
        </h2>
        <p className="text-gray-600 text-left text-xs mt-2">
          「下のレイヤーに置く基本色」と「出したい結果色」から<br />
          合成モード「ハードライト」でのせる合成色を逆算します。<br />
          基本色と結果色のRGB値を入力して、逆算ボタンを押してください。
        </p>
      </div>

      {/*　入力行　*/}
      <InputRow whichLayer={baseColor} setColor={setBaseColor} />
      <InputRow whichLayer={blendColor} setColor={setBlendColor} />

      <div className="flex justify-end mt-1">
        <button 
          className="px-5 py-2 border-none bg-blue-600 text-white rounded cursor-pointer text-base font-bold hover:bg-blue-700"
          onClick={ClickInvertButton}
        >
          逆算
        </button>
      </div>

      <div className="flex items-center gap-2 mt-1 pt-4 border-t border-gray-300">
        <span className="text-black w-15 text-sm font-bold flex-shrink-0">合成色 :</span>
        <div className="flex gap-2">
          <div className="flex items-center gap-1">
            <label className="text-black font-bold">R</label>
            <input
              type="number"
              value={compositeColor.r}
              onChange={(e) => setCompositeColor({ ...compositeColor, r: parseInt(e.target.value) })}
              readOnly
              className="text-black bg-gray-200 w-11 text-right p-1 border border-gray-300 rounded font-bold [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none"
            />
          </div>
          <div className="flex items-center gap-1">
            <label className="text-black font-bold">G</label>
            <input
              type="number"
              value={compositeColor.g}
              min="0"
              max="255"
              onChange={(e) => setCompositeColor({ ...compositeColor, g: parseInt(e.target.value) })}
              readOnly
              className="text-black bg-gray-200 w-11 text-right p-1 border border-gray-300 rounded font-bold [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none"
            />
          </div>
          <div className="flex items-center gap-1">
            <label className="text-black font-bold">B</label>
            <input
              type="number"
              value={compositeColor.b}
              onChange={(e) => setCompositeColor({ ...compositeColor, b: parseInt(e.target.value) })}
              readOnly
              className="text-black bg-gray-200 w-11 text-right p-1 border border-gray-300 rounded font-bold [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none"
            />
          </div>
        </div>
        <div
          className="w-10 h-10 border border-gray-600 rounded-md ml-auto flex-shrink-0"
          style={{ backgroundColor: `rgb(${compositeColor.r}, ${compositeColor.g}, ${compositeColor.b})` }}
        ></div>
      </div>
    </div>
  );
};

export default App;
