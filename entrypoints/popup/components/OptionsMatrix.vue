<script setup lang="ts">
import type { PrivacyBlurSettings } from '@/types/settings';
import TacticalToggle from './TacticalToggle.vue';
import { syncChatListGroup } from '@/utils/group-sync';

interface Props {
  settings: PrivacyBlurSettings;
  disabled?: boolean;
}

const props = withDefaults(defineProps<Props>(), {
  disabled: false,
});

const emit = defineEmits<{
  <K extends keyof PrivacyBlurSettings>(e: 'update', key: K, value: PrivacyBlurSettings[K]): void;
  (e: 'update-batch', updates: Partial<PrivacyBlurSettings>): void;
}>();

function handleToggle<K extends keyof PrivacyBlurSettings>(
  key: K,
  value: PrivacyBlurSettings[K],
) {
  if (props.disabled) return;
  const updates = syncChatListGroup(key, value, props.settings);
  if (Object.keys(updates).length > 1) {
    emit('update-batch', updates);
  }
  emit('update', key, value);
}
</script>

<template>
  <div class="options-sections" :class="{ 'is-disabled': disabled }">
    <!-- Section 1: CHAT LIST -->
    <section class="options-group">
      <div class="section-header">
        <span class="section-title">CHAT LIST</span>
      </div>
      <div class="options-card hud-scanlines">
        <!-- Master Row: Entire Row -->
        <div class="matrix-row full-row master-row">
          <span class="cell-label master-label">Entire Row</span>
          <TacticalToggle
            :model-value="settings.blurEntireRow"
            :disabled="disabled"
            @update:model-value="handleToggle('blurEntireRow', $event)"
          />
        </div>

        <!-- Split Row: Last Message & Contact Name -->
        <div class="matrix-row split-row">
          <div class="matrix-cell split-cell-left">
            <span class="cell-label">Last Message</span>
            <TacticalToggle
              :model-value="settings.blurLastMessage"
              :disabled="disabled"
              @update:model-value="handleToggle('blurLastMessage', $event)"
            />
          </div>
          <div class="matrix-cell">
            <span class="cell-label">Contact Name</span>
            <TacticalToggle
              :model-value="settings.blurContactName"
              :disabled="disabled"
              @update:model-value="handleToggle('blurContactName', $event)"
            />
          </div>
        </div>

        <!-- Row 3: Avatar Photo -->
        <div class="matrix-row full-row">
          <span class="cell-label">Avatar Photo</span>
          <TacticalToggle
            :model-value="settings.blurAvatar"
            :disabled="disabled"
            @update:model-value="handleToggle('blurAvatar', $event)"
          />
        </div>
      </div>
    </section>

    <!-- Section 2: CONVERSATION -->
    <section class="options-group">
      <div class="section-header">
        <span class="section-title">CONVERSATION</span>
      </div>
      <div class="options-card hud-scanlines">
        <!-- Row 1: Chat Window -->
        <div class="matrix-row full-row">
          <span class="cell-label">Chat Window</span>
          <TacticalToggle
            :model-value="settings.blurChatWindow"
            :disabled="disabled"
            @update:model-value="handleToggle('blurChatWindow', $event)"
          />
        </div>

        <!-- Row 2: Reveal on Hover -->
        <div class="matrix-row full-row">
          <span class="cell-label">Reveal on Hover</span>
          <TacticalToggle
            :model-value="settings.unblurOnHover"
            :disabled="disabled"
            @update:model-value="handleToggle('unblurOnHover', $event)"
          />
        </div>
      </div>
    </section>
  </div>
</template>

<style scoped>
.options-sections {
  display: flex;
  flex-direction: column;
  gap: 12px;
}

.options-sections.is-disabled {
  opacity: 0.45;
  pointer-events: none;
}

.options-group {
  display: flex;
  flex-direction: column;
  gap: 6px;
}

.section-header {
  display: flex;
  align-items: center;
  padding: 0 2px;
}

.section-title {
  font-family: var(--font-mono, monospace);
  font-size: 11px;
  font-weight: 700;
  letter-spacing: 0.8px;
  text-transform: uppercase;
  color: var(--text-secondary, #8292a8);
  user-select: none;
}

.options-card {
  background: var(--card-bg, #0d1522);
  border: 1px solid var(--card-border, #1a2638);
  border-radius: 2px;
  display: flex;
  flex-direction: column;
}

.matrix-row {
  display: flex;
}

.matrix-row:not(:last-child) {
  border-bottom: 1px solid var(--card-border, #1a2638);
}

.master-row {
  background-color: rgba(22, 34, 52, 0.4);
}

.master-label {
  font-weight: 700;
  color: var(--text-primary, #e2e8f0);
}

.split-row {
  display: grid;
  grid-template-columns: 1fr 1fr;
}

.split-row .matrix-cell {
  padding: 9px 10px;
  gap: 8px;
  min-height: 40px;
}

.full-row {
  padding: 10px 14px;
  gap: 12px;
  min-height: 42px;
}

.matrix-cell,
.full-row {
  display: flex;
  justify-content: space-between;
  align-items: center;
  box-sizing: border-box;
}

.split-cell-left {
  border-right: 1px solid var(--card-border, #1a2638);
}

.cell-label {
  font-family: var(--font-mono, monospace);
  font-size: 11px;
  font-weight: 500;
  letter-spacing: -0.2px;
  white-space: nowrap;
  color: var(--text-primary, #e2e8f0);
  user-select: none;
}

.full-row .cell-label {
  font-size: 12px;
  font-weight: 600;
}
</style>
