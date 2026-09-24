<script setup lang="ts">
import { ref, onMounted, onUnmounted } from 'vue';
import {
  getPrivacySettings,
  updatePrivacySettings,
  resetPrivacySettings,
  privacySettingsStorage,
} from '@/utils/storage';
import { type PrivacyBlurSettings, DEFAULT_SETTINGS } from '@/types/settings';
import TacticalHeader from './components/TacticalHeader.vue';
import MasterCard from './components/MasterCard.vue';
import IntensitySlider from './components/IntensitySlider.vue';
import OptionsMatrix from './components/OptionsMatrix.vue';

const settings = ref<PrivacyBlurSettings>({ ...DEFAULT_SETTINGS });
let unwatch: (() => void) | undefined;

onMounted(async () => {
  settings.value = await getPrivacySettings();
  unwatch = privacySettingsStorage.watch((newSettings) => {
    if (newSettings) {
      settings.value = newSettings;
    }
  });
});

onUnmounted(() => {
  if (unwatch) {
    unwatch();
  }
});

async function handleUpdate<K extends keyof PrivacyBlurSettings>(
  key: K,
  value: PrivacyBlurSettings[K]
) {
  settings.value[key] = value;
  await updatePrivacySettings({ [key]: value });
}

async function handleReset() {
  await resetPrivacySettings();
  settings.value = await getPrivacySettings();
}
</script>

<template>
  <main class="popup-container">
    <TacticalHeader />
    <MasterCard
      :model-value="settings.enabled"
      @update:model-value="handleUpdate('enabled', $event)"
    />
    <div class="controls-section" :class="{ 'is-disabled': !settings.enabled }">
      <IntensitySlider
        :model-value="settings.blurAmount"
        :disabled="!settings.enabled"
        @update:model-value="handleUpdate('blurAmount', $event)"
      />
      <OptionsMatrix
        :settings="settings"
        :disabled="!settings.enabled"
        @update="handleUpdate"
      />
    </div>
    <footer class="popup-footer">
      <button type="button" class="reset-btn" @click="handleReset">
        [RESET DEFAULTS]
      </button>
    </footer>
  </main>
</template>

<style scoped>
:global(body) {
  margin: 0;
  padding: 0;
  background-color: var(--bg-body, #0a0e14);
  display: block;
  min-width: 320px;
}

:global(#app) {
  margin: 0;
  padding: 0;
  max-width: none;
  text-align: left;
}

.popup-container {
  width: 320px;
  box-sizing: border-box;
  font-family: var(--font-mono, monospace);
  padding: 12px;
  display: flex;
  flex-direction: column;
  gap: 10px;
}

.controls-section {
  display: flex;
  flex-direction: column;
  gap: 10px;
  transition: opacity 0.2s ease;
}

.controls-section.is-disabled {
  opacity: 0.45;
  pointer-events: none;
}

.popup-footer {
  display: flex;
  justify-content: center;
  padding-top: 2px;
}

.reset-btn {
  font-family: var(--font-mono, monospace);
  font-size: 11px;
  font-weight: 600;
  letter-spacing: 0.5px;
  color: var(--text-secondary, #8292a8);
  background: transparent;
  border: 1px solid var(--inactive-border, #243348);
  border-radius: 2px;
  padding: 6px 14px;
  cursor: pointer;
  text-transform: uppercase;
  transition: all 0.2s ease;
}

.reset-btn:hover {
  color: var(--accent-green, #25D366);
  border-color: var(--accent-green-border, rgba(37, 211, 102, 0.6));
  box-shadow: 0 0 6px var(--accent-green-glow);
  background-color: rgba(37, 211, 102, 0.06);
}

.reset-btn:active {
  transform: scale(0.98);
}
</style>
