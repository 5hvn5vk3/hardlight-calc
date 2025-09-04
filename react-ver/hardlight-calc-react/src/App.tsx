import { Description } from './components/Description';

import { InputRow } from './components/InputRow';
import { InputField } from './components/InputRow/InputField';

import { Button } from './components/Button';
import { ClickInvertHLButton } from './hooks/ClickInvertHLButton';

import { OutputRow } from './components/OutputRow';
import { OutputField} from './components/OutputRow/OutputField';

import { useColorState } from './hooks/useColorState';

export const App = () => {
  const {baseColor, setBaseColor, blendColor, setBlendColor, compositeColor, setCompositeColor} = useColorState()
  return (
    <div className="flex flex-col gap-4 w-[380px] p-5 border border-gray-300 rounded-lg font-sans bg-gray-50">
      <Description />

      <InputRow LayerName="基本色" whichLayer={baseColor}>
        <InputField whichLayer={baseColor} partOfColor="r" label="R" setColor={setBaseColor} />
        <InputField whichLayer={baseColor} partOfColor="g" label="G" setColor={setBaseColor} />
        <InputField whichLayer={baseColor} partOfColor="b" label="B" setColor={setBaseColor} />
      </InputRow>

      <InputRow LayerName="結果色" whichLayer={blendColor}>
        <InputField whichLayer={blendColor} partOfColor="r" label="R" setColor={setBlendColor} />
        <InputField whichLayer={blendColor} partOfColor="g" label="G" setColor={setBlendColor} />
        <InputField whichLayer={blendColor} partOfColor="b" label="B" setColor={setBlendColor} />
      </InputRow>

      <Button label="逆算" onClick={() => ClickInvertHLButton(baseColor, blendColor, setCompositeColor)}/>

      <OutputRow LayerName="合成色" whichLayer={compositeColor}>
        <OutputField whichLayer={compositeColor} partOfColor="r" label="R" setColor={setCompositeColor} />
        <OutputField whichLayer={compositeColor} partOfColor="g" label="G" setColor={setCompositeColor} />
        <OutputField whichLayer={compositeColor} partOfColor="b" label="B" setColor={setCompositeColor} />
      </OutputRow>
    </div>
  );
};

export default App;
