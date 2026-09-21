import type { PrivacyBlurSettings } from '../types/settings';

export const BLUR_ENABLED_CLASS = 'chat-blur-enabled';
export const BLUR_ENTIRE_ROW_CLASS = 'chat-blur-entire-row';
export const BLUR_MESSAGE_CLASS = 'chat-blur-message';
export const BLUR_CONTACT_CLASS = 'chat-blur-contact';
export const BLUR_AVATAR_CLASS = 'chat-blur-avatar';

export const ALL_BLUR_CLASSES: string[] = [
  BLUR_ENABLED_CLASS,
  BLUR_ENTIRE_ROW_CLASS,
  BLUR_MESSAGE_CLASS,
  BLUR_CONTACT_CLASS,
  BLUR_AVATAR_CLASS,
];

export function computeDOMClasses(settings: PrivacyBlurSettings): string[] {
  if (!settings.enabled) {
    return [];
  }

  const classes: string[] = [BLUR_ENABLED_CLASS];

  if (settings.blurEntireRow) {
    classes.push(BLUR_ENTIRE_ROW_CLASS);
  }
  if (settings.blurLastMessage) {
    classes.push(BLUR_MESSAGE_CLASS);
  }
  if (settings.blurContactName) {
    classes.push(BLUR_CONTACT_CLASS);
  }
  if (settings.blurAvatar) {
    classes.push(BLUR_AVATAR_CLASS);
  }

  return classes;
}

export function computeStyleVariables(settings: PrivacyBlurSettings): Record<string, string> {
  return {
    '--chat-blur-amount': `${settings.blurAmount}px`,
  };
}

function getTargetRoot(targetDoc?: Document): HTMLElement | null {
  const doc = targetDoc ?? (typeof document !== 'undefined' ? document : undefined);
  if (!doc) {
    return null;
  }
  return (doc.documentElement ?? doc.body) as HTMLElement | null;
}

export function applyPrivacySettingsToDOM(settings: PrivacyBlurSettings, targetDoc?: Document): void {
  const root = getTargetRoot(targetDoc);
  if (!root) {
    return;
  }

  const activeClasses = new Set(computeDOMClasses(settings));

  for (const cls of ALL_BLUR_CLASSES) {
    if (activeClasses.has(cls)) {
      root.classList.add(cls);
    } else {
      root.classList.remove(cls);
    }
  }

  const styles = computeStyleVariables(settings);
  for (const [key, value] of Object.entries(styles)) {
    root.style.setProperty(key, value);
  }
}

export function removePrivacySettingsFromDOM(targetDoc?: Document): void {
  const root = getTargetRoot(targetDoc);
  if (!root) {
    return;
  }

  for (const cls of ALL_BLUR_CLASSES) {
    root.classList.remove(cls);
  }

  root.style.removeProperty('--chat-blur-amount');
}
