import { Description } from './components/Description';
import { InputRow } from './components/InputRow';
import { Button } from './components/Button';
import { OutputRow } from './components/OutputRow';
import { ClickInvertHLButton } from './hooks/ClickInvertHLButton';
import { useColorState } from './hooks/useColorState';

export const App = () => {
  const {baseColor, setBaseColor, blendColor, setBlendColor, compositeColor, setCompositeColor} = useColorState()
  return (
    <div className="flex flex-col gap-4 w-[380px] p-5 border border-gray-300 rounded-lg font-sans bg-gray-50">
      <Description />
      <InputRow LayerName="基本色" whichLayer={baseColor} setColor={setBaseColor} />
      <InputRow LayerName="結果色" whichLayer={blendColor} setColor={setBlendColor} />
      <Button onClick={() => ClickInvertHLButton(baseColor, blendColor, setCompositeColor)}/>
      <OutputRow LayerName="合成色" whichLayer={compositeColor} setColor={setCompositeColor} />
    </div>
  );
};

export default App;
