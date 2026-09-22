<script lang="ts" setup>
import { ref, onMounted, onUnmounted } from 'vue';
import {
  getPrivacySettings,
  updatePrivacySettings,
  resetPrivacySettings,
  privacySettingsStorage,
} from '@/utils/storage';
import { type PrivacyBlurSettings, DEFAULT_SETTINGS } from '@/types/settings';

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
    <!-- Header -->
    <header class="popup-header">
      <div class="header-brand">
        <div class="icon-wrapper">
          <svg
            class="shield-icon"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            stroke-width="2"
            stroke-linecap="round"
            stroke-linejoin="round"
          >
            <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
            <path d="M9 12l2 2 4-4" />
          </svg>
        </div>
        <h1 class="header-title">ChatGard</h1>
      </div>
    </header>

    <!-- Master Switch Card -->
    <div class="master-card">
      <div class="master-text">
        <span class="master-title">Enable ChatGard</span>
        <span class="master-subtitle">Toggle all blur protections on or off</span>
      </div>
      <label class="switch">
        <input
          type="checkbox"
          :checked="settings.enabled"
          @change="handleUpdate('enabled', !settings.enabled)"
        />
        <span class="slider"></span>
      </label>
    </div>

    <!-- Controls Section -->
    <div class="controls-section" :class="{ 'is-disabled': !settings.enabled }">
      <!-- Blur Intensity Slider -->
      <div class="control-group">
        <div class="control-label-row">
          <span class="control-label">Blur Intensity</span>
          <span class="intensity-badge">{{ settings.blurAmount }}px</span>
        </div>
        <input
          type="range"
          min="2"
          max="20"
          :value="settings.blurAmount"
          @input="handleUpdate('blurAmount', Number(($event.target as HTMLInputElement).value))"
          class="range-slider"
        />
      </div>

      <!-- Selective Toggles List -->
      <div class="options-list">
        <div class="option-row">
          <span class="option-label">Entire Row</span>
          <label class="switch">
            <input
              type="checkbox"
              :checked="settings.blurEntireRow"
              @change="handleUpdate('blurEntireRow', !settings.blurEntireRow)"
            />
            <span class="slider"></span>
          </label>
        </div>

        <div class="option-row">
          <span class="option-label">Last Message</span>
          <label class="switch">
            <input
              type="checkbox"
              :checked="settings.blurLastMessage"
              @change="handleUpdate('blurLastMessage', !settings.blurLastMessage)"
            />
            <span class="slider"></span>
          </label>
        </div>

        <div class="option-row">
          <span class="option-label">Contact Name</span>
          <label class="switch">
            <input
              type="checkbox"
              :checked="settings.blurContactName"
              @change="handleUpdate('blurContactName', !settings.blurContactName)"
            />
            <span class="slider"></span>
          </label>
        </div>

        <div class="option-row">
          <span class="option-label">Avatar Photo</span>
          <label class="switch">
            <input
              type="checkbox"
              :checked="settings.blurAvatar"
              @change="handleUpdate('blurAvatar', !settings.blurAvatar)"
            />
            <span class="slider"></span>
          </label>
        </div>

        <div class="option-row">
          <span class="option-label">Chat Window</span>
          <label class="switch">
            <input
              type="checkbox"
              :checked="settings.blurChatWindow"
              @change="handleUpdate('blurChatWindow', !settings.blurChatWindow)"
            />
            <span class="slider"></span>
          </label>
        </div>

        <div class="option-row">
          <span class="option-label">Reveal on Hover</span>
          <label class="switch">
            <input
              type="checkbox"
              :checked="settings.unblurOnHover"
              @change="handleUpdate('unblurOnHover', !settings.unblurOnHover)"
            />
            <span class="slider"></span>
          </label>
        </div>
      </div>
    </div>

    <!-- Footer -->
    <footer class="popup-footer">
      <button type="button" class="reset-btn" @click="handleReset">
        Reset Defaults
      </button>
    </footer>
  </main>
</template>

<style scoped>
:global(body) {
  margin: 0;
  padding: 0;
  background-color: #0f172a;
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
  font-family: system-ui, -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
  background-color: #0f172a;
  color: #f8fafc;
  padding: 16px;
  display: flex;
  flex-direction: column;
  gap: 14px;
}

/* Header */
.popup-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding-bottom: 2px;
}

.header-brand {
  display: flex;
  align-items: center;
  gap: 8px;
}

.icon-wrapper {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 28px;
  height: 28px;
  border-radius: 8px;
  background: rgba(16, 185, 129, 0.15);
  color: #10b981;
}

.shield-icon {
  width: 18px;
  height: 18px;
}

.header-title {
  margin: 0;
  font-size: 15px;
  font-weight: 600;
  letter-spacing: -0.01em;
  color: #f8fafc;
}


/* Master Card */
.master-card {
  display: flex;
  align-items: center;
  justify-content: space-between;
  background-color: #1e293b;
  border: 1px solid #334155;
  border-radius: 12px;
  padding: 12px 14px;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.2);
}

.master-text {
  display: flex;
  flex-direction: column;
  gap: 2px;
}

.master-title {
  font-size: 13.5px;
  font-weight: 600;
  color: #f8fafc;
}

.master-subtitle {
  font-size: 11px;
  color: #94a3b8;
}

/* Controls Section */
.controls-section {
  display: flex;
  flex-direction: column;
  gap: 12px;
  transition: opacity 0.2s ease, filter 0.2s ease;
}

.controls-section.is-disabled {
  opacity: 0.4;
  pointer-events: none;
  filter: grayscale(0.2);
}

/* Control Group (Intensity Slider) */
.control-group {
  background-color: #1e293b;
  border: 1px solid #334155;
  border-radius: 10px;
  padding: 10px 12px;
  display: flex;
  flex-direction: column;
  gap: 8px;
}

.control-label-row {
  display: flex;
  align-items: center;
  justify-content: space-between;
}

.control-label {
  font-size: 12px;
  font-weight: 500;
  color: #cbd5e1;
}

.intensity-badge {
  font-size: 11px;
  font-weight: 600;
  padding: 1px 6px;
  border-radius: 4px;
  background: rgba(16, 185, 129, 0.15);
  color: #10b981;
}

.range-slider {
  appearance: none;
  -webkit-appearance: none;
  width: 100%;
  height: 5px;
  background: #334155;
  border-radius: 9999px;
  outline: none;
  margin: 4px 0 2px;
}

.range-slider::-webkit-slider-thumb {
  -webkit-appearance: none;
  appearance: none;
  width: 15px;
  height: 15px;
  border-radius: 50%;
  background: #10b981;
  cursor: pointer;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.3);
  transition: transform 0.15s ease, background-color 0.15s ease;
}

.range-slider::-webkit-slider-thumb:hover {
  transform: scale(1.15);
  background: #34d399;
}

.range-slider::-moz-range-thumb {
  width: 15px;
  height: 15px;
  border-radius: 50%;
  background: #10b981;
  border: none;
  cursor: pointer;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.3);
}

/* Options List */
.options-list {
  background-color: #1e293b;
  border: 1px solid #334155;
  border-radius: 10px;
  padding: 4px 12px;
  display: flex;
  flex-direction: column;
}

.option-row {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 8px 0;
  border-bottom: 1px solid rgba(51, 65, 85, 0.5);
}

.option-row:last-child {
  border-bottom: none;
}

.option-label {
  font-size: 12.5px;
  color: #e2e8f0;
  font-weight: 500;
}

/* Toggle Switch Component */
.switch {
  position: relative;
  display: inline-block;
  width: 36px;
  height: 20px;
  flex-shrink: 0;
  cursor: pointer;
}

.switch input {
  opacity: 0;
  width: 0;
  height: 0;
  position: absolute;
}

.slider {
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background-color: #334155;
  border-radius: 20px;
  transition: background-color 0.2s ease;
}

.slider::before {
  position: absolute;
  content: "";
  height: 14px;
  width: 14px;
  left: 3px;
  bottom: 3px;
  background-color: #ffffff;
  border-radius: 50%;
  transition: transform 0.2s cubic-bezier(0.4, 0, 0.2, 1);
  box-shadow: 0 1px 2px rgba(0, 0, 0, 0.25);
}

.switch input:checked + .slider {
  background-color: #10b981;
}

.switch input:checked + .slider::before {
  transform: translateX(16px);
}

.switch input:focus-visible + .slider {
  outline: 2px solid #10b981;
  outline-offset: 2px;
}

/* Footer */
.popup-footer {
  display: flex;
  justify-content: center;
  padding-top: 2px;
}

.reset-btn {
  background: transparent;
  border: 1px solid #334155;
  border-radius: 6px;
  color: #94a3b8;
  font-size: 11.5px;
  font-weight: 500;
  padding: 6px 14px;
  cursor: pointer;
  transition: all 0.2s ease;
}

.reset-btn:hover {
  background-color: #1e293b;
  color: #f1f5f9;
  border-color: #475569;
}

.reset-btn:active {
  transform: scale(0.98);
}
</style>
