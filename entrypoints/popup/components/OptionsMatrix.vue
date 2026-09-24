<script setup lang="ts">
import type { PrivacyBlurSettings } from '@/types/settings';
import TacticalToggle from './TacticalToggle.vue';

interface Props {
  settings: PrivacyBlurSettings;
  disabled?: boolean;
}

withDefaults(defineProps<Props>(), {
  disabled: false,
});

const emit = defineEmits<{
  <K extends keyof PrivacyBlurSettings>(e: 'update', key: K, value: PrivacyBlurSettings[K]): void;
}>();
</script>

<template>
  <div class="options-matrix hud-scanlines" :class="{ 'is-disabled': disabled }">
    <!-- Row 1 (Full width): Entire Row -->
    <div class="matrix-row full-row">
      <span class="cell-label">Entire Row</span>
      <TacticalToggle
        :model-value="settings.blurEntireRow"
        :disabled="disabled"
        @update:model-value="emit('update', 'blurEntireRow', $event)"
      />
    </div>

    <!-- Row 2 (2 Columns): Last Message & Contact Name -->
    <div class="matrix-row split-row">
      <div class="matrix-cell split-cell-left">
        <span class="cell-label">Last Message</span>
        <TacticalToggle
          :model-value="settings.blurLastMessage"
          :disabled="disabled"
          @update:model-value="emit('update', 'blurLastMessage', $event)"
        />
      </div>
      <div class="matrix-cell">
        <span class="cell-label">Contact Name</span>
        <TacticalToggle
          :model-value="settings.blurContactName"
          :disabled="disabled"
          @update:model-value="emit('update', 'blurContactName', $event)"
        />
      </div>
    </div>

    <!-- Row 3 (2 Columns): Avatar Photo & Chat Window -->
    <div class="matrix-row split-row">
      <div class="matrix-cell split-cell-left">
        <span class="cell-label">Avatar Photo</span>
        <TacticalToggle
          :model-value="settings.blurAvatar"
          :disabled="disabled"
          @update:model-value="emit('update', 'blurAvatar', $event)"
        />
      </div>
      <div class="matrix-cell">
        <span class="cell-label">Chat Window</span>
        <TacticalToggle
          :model-value="settings.blurChatWindow"
          :disabled="disabled"
          @update:model-value="emit('update', 'blurChatWindow', $event)"
        />
      </div>
    </div>

    <!-- Row 4 (Full width): Reveal on Hover -->
    <div class="matrix-row full-row">
      <span class="cell-label">Reveal on Hover</span>
      <TacticalToggle
        :model-value="settings.unblurOnHover"
        :disabled="disabled"
        @update:model-value="emit('update', 'unblurOnHover', $event)"
      />
    </div>
  </div>
</template>

<style scoped>
.options-matrix {
  background: var(--card-bg, #0d1522);
  border: 1px solid var(--card-border, #1a2638);
  border-radius: 2px;
  display: flex;
  flex-direction: column;
}

.options-matrix.is-disabled {
  opacity: 0.45;
  pointer-events: none;
}

.matrix-row {
  display: flex;
}

.matrix-row:not(:last-child) {
  border-bottom: 1px solid var(--card-border, #1a2638);
}

.split-row {
  display: grid;
  grid-template-columns: 1fr 1fr;
}

.matrix-cell,
.full-row {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 10px 12px;
  min-height: 40px;
  box-sizing: border-box;
}

.split-cell-left {
  border-right: 1px solid var(--card-border, #1a2638);
}

.cell-label {
  font-family: var(--font-mono, monospace);
  font-size: 12px;
  font-weight: 600;
  color: var(--text-primary, #e2e8f0);
  user-select: none;
}
</style>
