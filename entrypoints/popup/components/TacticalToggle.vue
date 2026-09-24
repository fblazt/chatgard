<script setup lang="ts">
interface Props {
  modelValue: boolean;
  disabled?: boolean;
}

const props = withDefaults(defineProps<Props>(), {
  disabled: false,
});

const emit = defineEmits<{
  (e: 'update:modelValue', value: boolean): void;
}>();

function toggle() {
  if (props.disabled) return;
  emit('update:modelValue', !props.modelValue);
}
</script>

<template>
  <div
    class="tactical-toggle tactical-toggle-container"
    :class="{
      'is-active': modelValue,
      'is-disabled': disabled,
      active: modelValue,
      disabled: disabled,
    }"
    @click="toggle"
  >
    <span
      class="indicator-bar status-bar"
      :class="{
        'is-active': modelValue,
        'is-disabled': disabled,
      }"
      aria-hidden="true"
    />
    <button
      type="button"
      role="switch"
      :aria-checked="modelValue"
      :disabled="disabled"
      class="bracket-badge badge-button tactical-toggle-badge"
      :class="{
        'is-active': modelValue,
        'is-disabled': disabled,
      }"
      @click.stop="toggle"
    >
      {{ modelValue ? '[ON]' : '[OFF]' }}
    </button>
  </div>
</template>

<style scoped>
.tactical-toggle {
  display: inline-flex;
  align-items: center;
  gap: 6px;
  cursor: pointer;
  user-select: none;
  -webkit-user-select: none;
  font-family: var(--font-mono, monospace);
  text-transform: uppercase;
}

.tactical-toggle.is-disabled {
  cursor: not-allowed;
  opacity: 0.5;
}

.indicator-bar {
  width: 3px;
  height: 14px;
  border-radius: 1px;
  background-color: var(--inactive-bar, #334860);
  opacity: 0.6;
  transition: background-color 0.2s ease, box-shadow 0.2s ease, opacity 0.2s ease;
  flex-shrink: 0;
}

.indicator-bar.is-active {
  background-color: var(--accent-green, #25D366);
  box-shadow: 0 0 6px var(--accent-green-glow, rgba(37, 211, 102, 0.4));
  opacity: 1;
}

.bracket-badge {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  padding: 2px 6px;
  font-family: var(--font-mono, monospace);
  font-size: 11px;
  font-weight: 700;
  line-height: 1.2;
  letter-spacing: 0.5px;
  text-transform: uppercase;
  user-select: none;
  -webkit-user-select: none;
  border-radius: 2px;
  background: transparent;
  cursor: pointer;
  border: 1px solid var(--inactive-border, #243348);
  color: var(--text-muted, #50657e);
  transition: all 0.2s ease;
  outline: none;
}

.bracket-badge:hover:not(:disabled) {
  border-color: var(--accent-green-border, rgba(37, 211, 102, 0.6));
  color: var(--accent-green-pastel, #34d399);
}

.bracket-badge.is-active {
  border-color: var(--accent-green, #25D366);
  color: var(--accent-green-pastel, var(--accent-green, #25D366));
  box-shadow: 0 0 6px var(--accent-green-glow, rgba(37, 211, 102, 0.25));
  text-shadow: 0 0 4px var(--accent-green-glow, rgba(37, 211, 102, 0.4));
  background-color: rgba(37, 211, 102, 0.08);
}

.bracket-badge:disabled,
.bracket-badge.is-disabled {
  cursor: not-allowed;
  pointer-events: none;
}

.bracket-badge:focus-visible {
  outline: 1px dashed var(--accent-green, #25D366);
  outline-offset: 2px;
}
</style>
