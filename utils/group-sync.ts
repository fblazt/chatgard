import type { PrivacyBlurSettings } from '../types/settings';

/**
 * Synchronizes chat list privacy blur settings hierarchically.
 * Toggling blurEntireRow updates all child settings (blurLastMessage, blurContactName, blurAvatar).
 * Toggling any child setting recalculates blurEntireRow based on whether all children are active.
 */
export function syncChatListGroup<K extends keyof PrivacyBlurSettings>(
  key: K,
  value: PrivacyBlurSettings[K],
  currentSettings: PrivacyBlurSettings
): Partial<PrivacyBlurSettings> {
  if (key === 'blurEntireRow') {
    const active = Boolean(value);
    return {
      blurEntireRow: active,
      blurLastMessage: active,
      blurContactName: active,
      blurAvatar: active,
    };
  }

  if (key === 'blurLastMessage' || key === 'blurContactName' || key === 'blurAvatar') {
    const nextLast = key === 'blurLastMessage' ? Boolean(value) : currentSettings.blurLastMessage;
    const nextContact = key === 'blurContactName' ? Boolean(value) : currentSettings.blurContactName;
    const nextAvatar = key === 'blurAvatar' ? Boolean(value) : currentSettings.blurAvatar;
    const allActive = Boolean(nextLast && nextContact && nextAvatar);

    return {
      [key]: value,
      blurEntireRow: allActive,
    };
  }

  return {
    [key]: value,
  };
}

/**
 * Checks whether blurEntireRow matches the conjunction of all child chat list settings.
 */
export function isEntireRowSynchronized(settings: PrivacyBlurSettings): boolean {
  return (
    Boolean(settings.blurLastMessage && settings.blurContactName && settings.blurAvatar) ===
    Boolean(settings.blurEntireRow)
  );
}
