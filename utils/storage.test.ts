import { fakeBrowser } from 'wxt/testing/fake-browser';
(globalThis as any).browser = fakeBrowser;

import { describe, it, expect, beforeEach } from 'bun:test';
import { DEFAULT_SETTINGS } from '../types/settings';

const {
  privacySettingsStorage,
  getPrivacySettings,
  updatePrivacySettings,
  resetPrivacySettings,
} = await import('./storage');

describe('storage utility', () => {
  beforeEach(async () => {
    await resetPrivacySettings();
  });

  describe('privacySettingsStorage item definition', () => {
    it('is defined with expected key', () => {
      expect(privacySettingsStorage).toBeDefined();
      expect(privacySettingsStorage.key).toBe('local:privacySettings');
    });
  });

  describe('getPrivacySettings', () => {
    it('returns default settings initially', async () => {
      const settings = await getPrivacySettings();
      expect(settings).toEqual(DEFAULT_SETTINGS);
    });
  });

  describe('updatePrivacySettings', () => {
    it('updates partial settings and preserves remaining fields', async () => {
      const updated = await updatePrivacySettings({
        blurEntireRow: true,
      });

      expect(updated.blurEntireRow).toBe(true);
      expect(updated.blurLastMessage).toBe(DEFAULT_SETTINGS.blurLastMessage);
      expect(updated.blurContactName).toBe(DEFAULT_SETTINGS.blurContactName);

      const stored = await getPrivacySettings();
      expect(stored.blurEntireRow).toBe(true);
      expect(stored).toEqual(updated);
    });

    it('updates multiple settings simultaneously', async () => {
      const updated = await updatePrivacySettings({
        blurEntireRow: true,
        blurAvatar: true,
        blurAmount: 12,
      });

      expect(updated.blurEntireRow).toBe(true);
      expect(updated.blurAvatar).toBe(true);
      expect(updated.blurAmount).toBe(12);

      const stored = await getPrivacySettings();
      expect(stored).toEqual(updated);
    });

    it('updates blurChatWindow setting independently and persists it', async () => {
      const updated = await updatePrivacySettings({
        blurChatWindow: false,
      });

      expect(updated.blurChatWindow).toBe(false);

      const stored = await getPrivacySettings();
      expect(stored.blurChatWindow).toBe(false);
      expect(stored).toEqual(updated);
    });
  });

  describe('resetPrivacySettings', () => {
    it('resets modified settings back to DEFAULT_SETTINGS', async () => {
      await updatePrivacySettings({
        blurEntireRow: true,
        blurAmount: 20,
        blurChatWindow: false,
      });

      const resetResult = await resetPrivacySettings();
      expect(resetResult).toEqual(DEFAULT_SETTINGS);
      expect(resetResult.blurChatWindow).toBe(DEFAULT_SETTINGS.blurChatWindow);

      const stored = await getPrivacySettings();
      expect(stored).toEqual(DEFAULT_SETTINGS);
      expect(stored.blurChatWindow).toBe(DEFAULT_SETTINGS.blurChatWindow);
    });
  });
});
