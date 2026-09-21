import { storage } from 'wxt/utils/storage';
import { DEFAULT_SETTINGS, type PrivacyBlurSettings } from '../types/settings';

export const privacySettingsStorage = storage.defineItem<PrivacyBlurSettings>(
  'local:privacySettings',
  { defaultValue: DEFAULT_SETTINGS },
);

export async function getPrivacySettings(): Promise<PrivacyBlurSettings> {
  return await privacySettingsStorage.getValue();
}

export async function updatePrivacySettings(
  updates: Partial<PrivacyBlurSettings>,
): Promise<PrivacyBlurSettings> {
  const current = await getPrivacySettings();
  const next: PrivacyBlurSettings = {
    ...current,
    ...updates,
  };
  await privacySettingsStorage.setValue(next);
  return next;
}

export async function resetPrivacySettings(): Promise<PrivacyBlurSettings> {
  await privacySettingsStorage.setValue(DEFAULT_SETTINGS);
  return DEFAULT_SETTINGS;
}
