<script setup lang="ts">
import { computed } from 'vue';

export interface Props {
  modelValue?: number;
  min?: number;
  max?: number;
  disabled?: boolean;
}

const props = withDefaults(defineProps<Props>(), {
  modelValue: 8,
  min: 2,
  max: 20,
  disabled: false,
});

const emit = defineEmits<{
  (e: 'update:modelValue', value: number): void;
}>();

const displayValue = computed(() => props.modelValue ?? 8);

const fillPercentage = computed(() => {
  const minVal = Number(props.min);
  const maxVal = Number(props.max);
  if (maxVal <= minVal) return 0;
  const current = Math.min(Math.max(displayValue.value, minVal), maxVal);
  return (current - minVal) / (maxVal - minVal);
});

const fillStyle = computed(() => {
  const pct = fillPercentage.value;
  if (pct <= 0) {
    return { width: '0%' };
  }
  // Thumb is 16px wide (8px radius)
  return {
    width: `calc(8px + (100% - 16px) * ${pct})`,
  };
});

function handleInput(event: Event) {
  const target = event.target as HTMLInputElement;
  const numValue = Number(target.value);
  emit('update:modelValue', numValue);
}
</script>

<template>
  <div
    class="intensity-slider-card hud-scanlines"
    :class="{ 'is-disabled': disabled }"
  >
    <!-- Title Row -->
    <div class="slider-header">
      <span class="slider-title">BLUR INTENSITY</span>
      <span class="slider-value">[{{ displayValue }}px]</span>
    </div>

    <!-- Tactical Slider Track & Thumb -->
    <div class="slider-track-area">
      <!-- Unfilled segmented tick line -->
      <div class="track-dashed" aria-hidden="true"></div>
      <!-- Filled solid glowing line -->
      <div class="track-fill" :style="fillStyle" aria-hidden="true"></div>
      <!-- Native Range Input -->
      <input
        type="range"
        class="slider-input"
        :min="min"
        :max="max"
        :value="displayValue"
        :disabled="disabled"
        :aria-label="`Blur intensity: ${displayValue} pixels`"
        :aria-valuemin="min"
        :aria-valuemax="max"
        :aria-valuenow="displayValue"
        @input="handleInput"
        @change="handleInput"
      />
    </div>
  </div>
</template>

<style scoped>
.intensity-slider-card {
  position: relative;
  background: var(--card-bg, #0d1522);
  border: 1px solid var(--card-border, #1a2638);
  border-radius: 2px;
  padding: 12px 16px;
  display: flex;
  flex-direction: column;
  gap: 12px;
  box-sizing: border-box;
  user-select: none;
  overflow: hidden;
}

.intensity-slider-card.is-disabled {
  opacity: 0.45;
  pointer-events: none;
}

.slider-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  font-family: var(--font-mono, 'JetBrains Mono', 'Fira Code', 'Courier New', monospace);
  line-height: 1.2;
}

.slider-title {
  font-size: 11px;
  font-weight: 600;
  text-transform: uppercase;
  letter-spacing: 0.5px;
  color: var(--text-secondary, #8292a8);
}

.slider-value {
  font-size: 11px;
  font-weight: 700;
  letter-spacing: 0.5px;
  color: var(--accent-green, #25D366);
}

.slider-track-area {
  position: relative;
  width: 100%;
  height: 20px;
  display: flex;
  align-items: center;
}

/* Unfilled portion: segmented / dashed ticks */
.track-dashed {
  position: absolute;
  left: 0;
  right: 0;
  top: 50%;
  transform: translateY(-50%);
  height: 2px;
  background: repeating-linear-gradient(
    to right,
    #243348 0,
    #243348 6px,
    transparent 6px,
    transparent 10px
  );
  pointer-events: none;
  z-index: 1;
}

/* Filled portion: glowing WhatsApp pastel green */
.track-fill {
  position: absolute;
  left: 0;
  top: 50%;
  transform: translateY(-50%);
  height: 2px;
  background: var(--accent-green, #25D366);
  box-shadow: 0 0 6px var(--accent-green-glow, rgba(37, 211, 102, 0.4));
  pointer-events: none;
  z-index: 1;
  transition: width 0.05s ease-out;
}

/* Native range input overlay */
.slider-input {
  -webkit-appearance: none;
  appearance: none;
  width: 100%;
  height: 20px;
  background: transparent;
  outline: none;
  margin: 0;
  padding: 0;
  cursor: pointer;
  position: relative;
  z-index: 2;
  display: block;
}

.slider-input:focus-visible {
  outline: none;
}

.slider-input::-webkit-slider-runnable-track {
  width: 100%;
  height: 2px;
  background: transparent;
  border: none;
}

.slider-input::-moz-range-track {
  width: 100%;
  height: 2px;
  background: transparent;
  border: none;
}

/* Tactical HUD Thumb: Hollow square box [ ] */
.slider-input::-webkit-slider-thumb {
  -webkit-appearance: none;
  appearance: none;
  width: 16px;
  height: 16px;
  background: var(--bg-dark, #090e17);
  border: 1.5px solid var(--accent-green, #25D366);
  box-shadow: 0 0 6px var(--accent-green-glow, rgba(37, 211, 102, 0.4));
  border-radius: 1px;
  cursor: pointer;
  margin-top: -7px;
  transition: border-color 0.15s ease, box-shadow 0.15s ease;
}

.slider-input::-moz-range-thumb {
  width: 16px;
  height: 16px;
  background: var(--bg-dark, #090e17);
  border: 1.5px solid var(--accent-green, #25D366);
  box-shadow: 0 0 6px var(--accent-green-glow, rgba(37, 211, 102, 0.4));
  border-radius: 1px;
  cursor: pointer;
  transition: border-color 0.15s ease, box-shadow 0.15s ease;
}

.slider-input:hover:not(:disabled)::-webkit-slider-thumb,
.slider-input:active:not(:disabled)::-webkit-slider-thumb {
  border-color: #3bf57f;
  box-shadow: 0 0 8px var(--accent-green, #25D366);
}

.slider-input:hover:not(:disabled)::-moz-range-thumb,
.slider-input:active:not(:disabled)::-moz-range-thumb {
  border-color: #3bf57f;
  box-shadow: 0 0 8px var(--accent-green, #25D366);
}

.slider-input:focus-visible::-webkit-slider-thumb {
  box-shadow: 0 0 10px var(--accent-green, #25D366);
}

.slider-input:focus-visible::-moz-range-thumb {
  box-shadow: 0 0 10px var(--accent-green, #25D366);
}

.slider-input:disabled {
  cursor: not-allowed;
}

.slider-input:disabled::-webkit-slider-thumb {
  cursor: not-allowed;
  border-color: var(--text-secondary, #8292a8);
  box-shadow: none;
}

.slider-input:disabled::-moz-range-thumb {
  cursor: not-allowed;
  border-color: var(--text-secondary, #8292a8);
  box-shadow: none;
}
</style>
