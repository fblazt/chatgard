export interface PrivacyBlurSettings {
  enabled: boolean;
  blurAmount: number;
  blurEntireRow: boolean;
  blurLastMessage: boolean;
  blurContactName: boolean;
  blurAvatar: boolean;
  blurChatWindow: boolean;
  unblurOnHover: boolean;
}

export const DEFAULT_SETTINGS: PrivacyBlurSettings = {
  enabled: true,
  blurAmount: 8,
  blurEntireRow: true,
  blurLastMessage: false,
  blurContactName: false,
  blurAvatar: false,
  blurChatWindow: true,
  unblurOnHover: true,
};

export function isValidSettings(value: unknown): value is PrivacyBlurSettings {
  if (typeof value !== 'object' || value === null) {
    return false;
  }
  const s = value as Record<string, unknown>;
  return (
    typeof s.enabled === 'boolean' &&
    typeof s.blurAmount === 'number' &&
    !Number.isNaN(s.blurAmount) &&
    s.blurAmount >= 0 &&
    typeof s.blurEntireRow === 'boolean' &&
    typeof s.blurLastMessage === 'boolean' &&
    typeof s.blurContactName === 'boolean' &&
    typeof s.blurAvatar === 'boolean' &&
    typeof s.blurChatWindow === 'boolean' &&
    typeof s.unblurOnHover === 'boolean'
  );
}
