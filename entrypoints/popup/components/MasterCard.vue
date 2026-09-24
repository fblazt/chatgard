<script setup lang="ts">
import TacticalToggle from './TacticalToggle.vue';

interface Props {
  modelValue: boolean;
}

defineProps<Props>();

const emit = defineEmits<{
  (e: 'update:modelValue', value: boolean): void;
}>();
</script>

<template>
  <div class="master-card hud-scanlines">
    <div class="master-info">
      <span class="master-title">Enable ChatGard</span>
      <span class="master-subtitle">Toggle all blur protections on or off</span>
    </div>
    <TacticalToggle
      :model-value="modelValue"
      @update:model-value="emit('update:modelValue', $event)"
    />
  </div>
</template>

<style scoped>
.master-card {
  background-color: var(--card-bg, #0d1522);
  border: 1px solid var(--card-border, #1a2638);
  border-radius: 2px;
  padding: 12px 14px;
  display: flex;
  justify-content: space-between;
  align-items: center;
  box-sizing: border-box;
  user-select: none;
}

.master-info {
  display: flex;
  flex-direction: column;
}

.master-title {
  font-family: var(--font-mono, monospace);
  font-size: 13px;
  font-weight: 700;
  color: var(--text-primary, #e2e8f0);
  text-transform: uppercase;
}

.master-subtitle {
  font-family: var(--font-mono, monospace);
  font-size: 11px;
  color: var(--text-secondary, #8292a8);
  margin-top: 3px;
}
</style>
