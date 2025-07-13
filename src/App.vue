<script setup lang="ts">

import { ref, computed } from 'vue'; // computed をインポート

// Color data structure
interface ColorRGB {
  r: number;
  g: number;
  b: number;
}

// Reactive state for colors
const baseColor = ref<ColorRGB>({ r: 0, g: 0, b: 0 });
const blendColor = ref<ColorRGB>({ r: 0, g: 0, b: 0 });
const compositeColor = ref<ColorRGB>({ r: 0, g: 0, b: 0 });


// 色プレビューのスタイルを動的に生成するための算出プロパティ
const baseColorStyle = computed(() => `rgb(${baseColor.value.r}, ${baseColor.value.g}, ${baseColor.value.b})`);
const blendColorStyle = computed(() => `rgb(${blendColor.value.r}, ${blendColor.value.g}, ${blendColor.value.b})`);
const compositeColorStyle = computed(() => `rgb(${compositeColor.value.r}, ${compositeColor.value.g}, ${compositeColor.value.b})`);


// Calculation logic
const calculate = () => {
  const newCompositeColor: ColorRGB = { r: 0, g: 0, b: 0 };
  
  for (const channel of Object.keys(baseColor.value) as Array<keyof ColorRGB>) {
    const base: number = baseColor.value[channel];
    const result: number = blendColor.value[channel];
    
    let S: number = 0.0;
    let M: number = 0.0;
    let finalValue: number = 0.0;

    if (base === 255) {
      if (result === 255) {
        S = 255;
      } else {
        S = -56562;
      }
    } else {
      S = (255 * (-2 * base + result + 255)) / (2 * (255 - base));
    }

    if (base !== 0) {
      M = (255 * result) / (2 * base);
    }

    if (S >= 128) {
      finalValue = S;
    } else {
      finalValue = M;
    }

    const roundedValue: number = Math.round(finalValue);
    newCompositeColor[channel] = Math.max(0, Math.min(255, roundedValue));
  }

  compositeColor.value = newCompositeColor;
  
  const iBase: Array<number> = [baseColor.value.r, baseColor.value.g, baseColor.value.b];
  const iResult: Array<number> = [blendColor.value.r, blendColor.value.g, blendColor.value.b];
  const iCom: Array<number> = [compositeColor.value.r, compositeColor.value.g, compositeColor.value.b];
  console.log(`基本色=[${iBase}], 合成色=[${iCom}] ⇒ 結果色=[${iResult}]`);
};

</script>

<template>
  <div class="hard-light-calculator">
    <div class="header-row">
      <h2>ハードライト合成色逆算機</h2>
      <p class="expl-row">
        「下のレイヤーに置く基本色」と「出したい結果色」から<br>合成モード「ハードライト」でのせる合成色を逆算します。<br>
        基本色と結果色のRGB値を入力して、逆算ボタンを押してください。
      </p>
    </div>

    <div class="color-row">
      <span class="label">基本色 :</span>
      <div class="inputs-wrapper">
        <div class="input-group">
          <label>R</label>
          <input type="number" v-model.number="baseColor.r" min="0" max="255">
        </div>
        <div class="input-group">
          <label>G</label>
          <input type="number" v-model.number="baseColor.g" min="0" max="255">
        </div>
        <div class="input-group">
          <label>B</label>
          <input type="number" v-model.number="baseColor.b" min="0" max="255">
        </div>
      </div>
      <div class="color-swatch" :style="{ backgroundColor: baseColorStyle }"></div>
    </div>

    <div class="color-row">
      <span class="label">結果色 :</span>
      <div class="inputs-wrapper">
        <div class="input-group">
          <label>R</label>
          <input type="number" v-model.number="blendColor.r" min="0" max="255">
        </div>
        <div class="input-group">
          <label>G</label>
          <input type="number" v-model.number="blendColor.g" min="0" max="255">
        </div>
        <div class="input-group">
          <label>B</label>
          <input type="number" v-model.number="blendColor.b" min="0" max="255">
        </div>
      </div>
      <div class="color-swatch" :style="{ backgroundColor: blendColorStyle }"></div>
    </div>

    <div class="action-row">
      <button @click="calculate" style="font-weight: bold">逆算</button>
    </div>

    <div class="color-row result-row">
      <span class="label">合成色 :</span>
      <div class="inputs-wrapper">
        <div class="input-group">
          <label>R</label>
          <input type="number" :value="compositeColor.r" readonly>
        </div>
        <div class="input-group">
          <label>G</label>
          <input type="number" :value="compositeColor.g" readonly>
        </div>
        <div class="input-group">
          <label>B</label>
          <input type="number" :value="compositeColor.b" readonly>
        </div>
      </div>
      <div class="color-swatch" :style="{ backgroundColor: compositeColorStyle }"></div>
    </div>
  </div>
</template>

<style scoped>

:root {
  color-scheme: light; /* ダークモードにならないようにします */
} 

.hard-light-calculator {
  display: flex;
  flex-direction: column;
  gap: 15px;
  width: 380px; /* 横幅を少し広げます */
  padding: 20px;
  border: 1px solid #ccc;
  border-radius: 8px;
  font-family: sans-serif;
  background-color: #f9f9f9;
}

.header-row {
  margin-bottom: 10px;
}

.expl-row {
  color: #666;
  text-align: left;
  font-size: 0.6em;
}

h2 {
  margin: 0 0 0px;
  font-size: 1.2em;
  text-align: left;
}

.color-row {
  display: flex;
  align-items: center;
  gap: 10px;
}

.label {
  width: 60px;
  font-size: 0.9em;
  font-weight: bold;
  flex-shrink: 0; /* ラベルが縮まないように */
}

.inputs-wrapper {
  display: flex;
  gap: 10px;
}

.input-group {
  display: flex;
  align-items: center;
  gap: 5px;
}

.input-group label {
  font-weight: bold;
}

input[type="number"] {
  width: 45px;
  text-align: right;
  padding: 5px;
  border: 1px solid #ccc;
  border-radius: 4px;
}

input[type=number]::-webkit-inner-spin-button, 
input[type=number]::-webkit-outer-spin-button { 
  -webkit-appearance: none; 
  margin: 0; 
}
input[type=number] {
  -moz-appearance: textfield;
}

.action-row {
  display: flex;
  justify-content: flex-end;
  margin-top: 5px;
}

button {
  padding: 8px 20px;
  border: none;
  background-color: #007bff;
  color: white;
  border-radius: 5px;
  cursor: pointer;
  font-size: 1em;
}

button:hover {
  background-color: #0056b3;
}

.result-row {
  margin-top: 5px;
  padding-top: 15px;
  border-top: 1px solid #ddd;
}

.result-row input {
  background-color: #e9ecef;
  font-weight: bold;
}


/* 色のプレビュー */
.color-swatch {
  width: 40px;
  height: 40px;
  border: 1px solid #999;
  border-radius: 6px;
  margin-left: auto; /* 右端に配置 */
  flex-shrink: 0;
}

</style>
