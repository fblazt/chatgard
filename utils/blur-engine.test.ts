import { describe, it, expect, beforeEach, afterEach } from 'bun:test';
import type { PrivacyBlurSettings } from '../types/settings';
import {
  ALL_BLUR_CLASSES,
  BLUR_AVATAR_CLASS,
  BLUR_CHAT_WINDOW_CLASS,
  BLUR_CONTACT_CLASS,
  BLUR_ENABLED_CLASS,
  BLUR_ENTIRE_ROW_CLASS,
  BLUR_MESSAGE_CLASS,
  BLUR_UNBLUR_ON_HOVER_CLASS,
  applyPrivacySettingsToDOM,
  computeDOMClasses,
  computeStyleVariables,
  removePrivacySettingsFromDOM,
} from './blur-engine';

const baseSettings: PrivacyBlurSettings = {
  enabled: true,
  blurAmount: 8,
  blurEntireRow: false,
  blurLastMessage: false,
  blurContactName: false,
  blurAvatar: false,
  blurChatWindow: false,
  unblurOnHover: true,
};

function createMockDocument(
  initialClasses: string[] = [],
  initialStyles: Record<string, string> = {},
  options: { noDocumentElement?: boolean } = {}
) {
  const classes = new Set<string>(initialClasses);
  const styles = new Map<string, string>(Object.entries(initialStyles));

  const rootElement = {
    classList: {
      add: (cls: string) => {
        classes.add(cls);
      },
      remove: (cls: string) => {
        classes.delete(cls);
      },
      contains: (cls: string) => classes.has(cls),
    },
    style: {
      setProperty: (prop: string, val: string) => {
        styles.set(prop, val);
      },
      removeProperty: (prop: string) => {
        styles.delete(prop);
      },
      getPropertyValue: (prop: string) => styles.get(prop) ?? '',
    },
  };

  const doc = options.noDocumentElement
    ? {
        documentElement: null,
        body: rootElement,
      }
    : {
        documentElement: rootElement,
        body: null,
      };

  return {
    doc: doc as unknown as Document,
    classes,
    styles,
    root: rootElement,
  };
}

describe('blur-engine constants', () => {
  it('exports expected class names', () => {
    expect(BLUR_ENABLED_CLASS).toBe('chat-blur-enabled');
    expect(BLUR_ENTIRE_ROW_CLASS).toBe('chat-blur-entire-row');
    expect(BLUR_MESSAGE_CLASS).toBe('chat-blur-message');
    expect(BLUR_CONTACT_CLASS).toBe('chat-blur-contact');
    expect(BLUR_AVATAR_CLASS).toBe('chat-blur-avatar');
    expect(BLUR_CHAT_WINDOW_CLASS).toBe('chat-blur-chat-window');
    expect(BLUR_UNBLUR_ON_HOVER_CLASS).toBe('chat-blur-unblur-on-hover');
  });

  it('contains all blur classes in ALL_BLUR_CLASSES', () => {
    expect(ALL_BLUR_CLASSES).toEqual([
      BLUR_ENABLED_CLASS,
      BLUR_ENTIRE_ROW_CLASS,
      BLUR_MESSAGE_CLASS,
      BLUR_CONTACT_CLASS,
      BLUR_AVATAR_CLASS,
      BLUR_CHAT_WINDOW_CLASS,
      BLUR_UNBLUR_ON_HOVER_CLASS,
    ]);
  });
});

describe('computeDOMClasses', () => {
  it('returns empty array when disabled regardless of other settings', () => {
    const disabledSettings: PrivacyBlurSettings = {
      ...baseSettings,
      enabled: false,
      blurEntireRow: true,
      blurLastMessage: true,
      blurContactName: true,
      blurAvatar: true,
      blurChatWindow: true,
    };

    expect(computeDOMClasses(disabledSettings)).toEqual([]);
  });

  it('returns blur enabled and full row classes in full row mode', () => {
    const fullRowSettings: PrivacyBlurSettings = {
      ...baseSettings,
      enabled: true,
      blurEntireRow: true,
      blurLastMessage: false,
      blurContactName: false,
      blurAvatar: false,
      blurChatWindow: false,
    };

    expect(computeDOMClasses(fullRowSettings)).toEqual([
      BLUR_ENABLED_CLASS,
      BLUR_ENTIRE_ROW_CLASS,
      BLUR_UNBLUR_ON_HOVER_CLASS,
    ]);
  });

  it('returns selective blur classes based on individual toggles', () => {
    const messageOnly: PrivacyBlurSettings = {
      ...baseSettings,
      enabled: true,
      blurEntireRow: false,
      blurLastMessage: true,
      blurContactName: false,
      blurAvatar: false,
      blurChatWindow: false,
    };
    expect(computeDOMClasses(messageOnly)).toEqual([
      BLUR_ENABLED_CLASS,
      BLUR_MESSAGE_CLASS,
      BLUR_UNBLUR_ON_HOVER_CLASS,
    ]);

    const contactAndAvatar: PrivacyBlurSettings = {
      ...baseSettings,
      enabled: true,
      blurEntireRow: false,
      blurLastMessage: false,
      blurContactName: true,
      blurAvatar: true,
      blurChatWindow: false,
    };
    expect(computeDOMClasses(contactAndAvatar)).toEqual([
      BLUR_ENABLED_CLASS,
      BLUR_CONTACT_CLASS,
      BLUR_AVATAR_CLASS,
      BLUR_UNBLUR_ON_HOVER_CLASS,
    ]);

    const allSelective: PrivacyBlurSettings = {
      ...baseSettings,
      enabled: true,
      blurEntireRow: false,
      blurLastMessage: true,
      blurContactName: true,
      blurAvatar: true,
      blurChatWindow: true,
    };
    expect(computeDOMClasses(allSelective)).toEqual([
      BLUR_ENABLED_CLASS,
      BLUR_MESSAGE_CLASS,
      BLUR_CONTACT_CLASS,
      BLUR_AVATAR_CLASS,
      BLUR_CHAT_WINDOW_CLASS,
      BLUR_UNBLUR_ON_HOVER_CLASS,
    ]);
  });

  it('returns chat window blur class when blurChatWindow is true', () => {
    const chatWindowSettings: PrivacyBlurSettings = {
      ...baseSettings,
      enabled: true,
      blurChatWindow: true,
    };

    expect(computeDOMClasses(chatWindowSettings)).toEqual([
      BLUR_ENABLED_CLASS,
      BLUR_CHAT_WINDOW_CLASS,
      BLUR_UNBLUR_ON_HOVER_CLASS,
    ]);
  });

  it('does not return chat window blur class when blurChatWindow is false', () => {
    const withoutChatWindow: PrivacyBlurSettings = {
      ...baseSettings,
      enabled: true,
      blurChatWindow: false,
    };

    expect(computeDOMClasses(withoutChatWindow)).not.toContain(BLUR_CHAT_WINDOW_CLASS);
  });

  it('returns only BLUR_ENABLED_CLASS and unblur class when enabled but no blur options selected', () => {
    const minimalEnabled: PrivacyBlurSettings = {
      ...baseSettings,
      enabled: true,
      blurEntireRow: false,
      blurLastMessage: false,
      blurContactName: false,
      blurAvatar: false,
      blurChatWindow: false,
    };
    expect(computeDOMClasses(minimalEnabled)).toEqual([
      BLUR_ENABLED_CLASS,
      BLUR_UNBLUR_ON_HOVER_CLASS,
    ]);
  });

  it('returns hover unblur class when unblurOnHover is true', () => {
    const hoverEnabled: PrivacyBlurSettings = {
      ...baseSettings,
      enabled: true,
      unblurOnHover: true,
    };
    expect(computeDOMClasses(hoverEnabled)).toContain(BLUR_UNBLUR_ON_HOVER_CLASS);
  });

  it('omits hover unblur class when unblurOnHover is false', () => {
    const hoverDisabled: PrivacyBlurSettings = {
      ...baseSettings,
      enabled: true,
      unblurOnHover: false,
    };
    expect(computeDOMClasses(hoverDisabled)).not.toContain(BLUR_UNBLUR_ON_HOVER_CLASS);
    expect(computeDOMClasses(hoverDisabled)).toEqual([BLUR_ENABLED_CLASS]);
  });

  it('does not emit hover unblur class when settings are disabled even if unblurOnHover is true', () => {
    const disabledWithHover: PrivacyBlurSettings = {
      ...baseSettings,
      enabled: false,
      unblurOnHover: true,
    };
    expect(computeDOMClasses(disabledWithHover)).toEqual([]);
    expect(computeDOMClasses(disabledWithHover)).not.toContain(BLUR_UNBLUR_ON_HOVER_CLASS);
  });
});

describe('computeStyleVariables', () => {
  it('sets --chat-blur-amount based on blurAmount setting', () => {
    expect(computeStyleVariables({ ...baseSettings, blurAmount: 8 })).toEqual({
      '--chat-blur-amount': '8px',
    });

    expect(computeStyleVariables({ ...baseSettings, blurAmount: 14 })).toEqual({
      '--chat-blur-amount': '14px',
    });

    expect(computeStyleVariables({ ...baseSettings, blurAmount: 0 })).toEqual({
      '--chat-blur-amount': '0px',
    });
  });
});

describe('applyPrivacySettingsToDOM', () => {
  it('applies active classes and style custom properties to targetDoc', () => {
    const { doc, classes, styles } = createMockDocument();
    const settings: PrivacyBlurSettings = {
      ...baseSettings,
      enabled: true,
      blurEntireRow: false,
      blurLastMessage: true,
      blurContactName: true,
      blurChatWindow: true,
      blurAmount: 12,
    };

    applyPrivacySettingsToDOM(settings, doc);

    expect(classes.has(BLUR_ENABLED_CLASS)).toBe(true);
    expect(classes.has(BLUR_MESSAGE_CLASS)).toBe(true);
    expect(classes.has(BLUR_CONTACT_CLASS)).toBe(true);
    expect(classes.has(BLUR_CHAT_WINDOW_CLASS)).toBe(true);
    expect(classes.has(BLUR_AVATAR_CLASS)).toBe(false);
    expect(classes.has(BLUR_ENTIRE_ROW_CLASS)).toBe(false);
    expect(classes.has(BLUR_UNBLUR_ON_HOVER_CLASS)).toBe(true);
    expect(styles.get('--chat-blur-amount')).toBe('12px');
  });

  it('removes stale blur classes when settings are updated', () => {
    const { doc, classes } = createMockDocument([
      BLUR_ENABLED_CLASS,
      BLUR_ENTIRE_ROW_CLASS,
      BLUR_MESSAGE_CLASS,
      BLUR_CHAT_WINDOW_CLASS,
    ]);

    const selectiveSettings: PrivacyBlurSettings = {
      ...baseSettings,
      enabled: true,
      blurEntireRow: false,
      blurLastMessage: false,
      blurAvatar: true,
      blurChatWindow: false,
      blurAmount: 6,
    };

    applyPrivacySettingsToDOM(selectiveSettings, doc);

    expect(classes.has(BLUR_ENABLED_CLASS)).toBe(true);
    expect(classes.has(BLUR_ENTIRE_ROW_CLASS)).toBe(false);
    expect(classes.has(BLUR_MESSAGE_CLASS)).toBe(false);
    expect(classes.has(BLUR_CHAT_WINDOW_CLASS)).toBe(false);
    expect(classes.has(BLUR_AVATAR_CLASS)).toBe(true);
  });

  it('removes all blur classes when settings are disabled', () => {
    const { doc, classes } = createMockDocument([
      BLUR_ENABLED_CLASS,
      BLUR_ENTIRE_ROW_CLASS,
      BLUR_MESSAGE_CLASS,
      BLUR_CHAT_WINDOW_CLASS,
      BLUR_UNBLUR_ON_HOVER_CLASS,
    ]);

    const disabledSettings: PrivacyBlurSettings = {
      ...baseSettings,
      enabled: false,
      blurEntireRow: true,
      blurChatWindow: true,
      unblurOnHover: true,
    };

    applyPrivacySettingsToDOM(disabledSettings, doc);

    expect(classes.has(BLUR_ENABLED_CLASS)).toBe(false);
    expect(classes.has(BLUR_ENTIRE_ROW_CLASS)).toBe(false);
    expect(classes.has(BLUR_MESSAGE_CLASS)).toBe(false);
    expect(classes.has(BLUR_CHAT_WINDOW_CLASS)).toBe(false);
    expect(classes.has(BLUR_UNBLUR_ON_HOVER_CLASS)).toBe(false);
  });

  it('falls back to doc.body if documentElement is absent', () => {
    const { doc, classes, styles } = createMockDocument([], {}, { noDocumentElement: true });
    const settings: PrivacyBlurSettings = {
      ...baseSettings,
      enabled: true,
      blurEntireRow: true,
      blurAmount: 10,
    };

    applyPrivacySettingsToDOM(settings, doc);

    expect(classes.has(BLUR_ENABLED_CLASS)).toBe(true);
    expect(classes.has(BLUR_ENTIRE_ROW_CLASS)).toBe(true);
    expect(styles.get('--chat-blur-amount')).toBe('10px');
  });

  it('safely handles undefined document in non-DOM environment', () => {
    expect(() => applyPrivacySettingsToDOM(baseSettings, undefined)).not.toThrow();
  });

  it('defaults to globalThis.document when targetDoc is omitted and document exists', () => {
    const originalDoc = (globalThis as any).document;
    const { doc, classes } = createMockDocument();

    try {
      (globalThis as any).document = doc;
      applyPrivacySettingsToDOM({
        ...baseSettings,
        enabled: true,
        blurEntireRow: true,
      });

      expect(classes.has(BLUR_ENABLED_CLASS)).toBe(true);
      expect(classes.has(BLUR_ENTIRE_ROW_CLASS)).toBe(true);
    } finally {
      (globalThis as any).document = originalDoc;
    }
  });

  it('updates hover unblur class when unblurOnHover setting is toggled', () => {
    const { doc, classes } = createMockDocument();

    applyPrivacySettingsToDOM({ ...baseSettings, unblurOnHover: true }, doc);
    expect(classes.has(BLUR_UNBLUR_ON_HOVER_CLASS)).toBe(true);

    applyPrivacySettingsToDOM({ ...baseSettings, unblurOnHover: false }, doc);
    expect(classes.has(BLUR_UNBLUR_ON_HOVER_CLASS)).toBe(false);
  });
});

describe('removePrivacySettingsFromDOM', () => {
  it('removes all blur classes and style properties from targetDoc', () => {
    const { doc, classes, styles } = createMockDocument(
      [
        BLUR_ENABLED_CLASS,
        BLUR_ENTIRE_ROW_CLASS,
        BLUR_MESSAGE_CLASS,
        BLUR_CHAT_WINDOW_CLASS,
        BLUR_UNBLUR_ON_HOVER_CLASS,
      ],
      { '--chat-blur-amount': '10px' }
    );

    removePrivacySettingsFromDOM(doc);

    expect(classes.has(BLUR_ENABLED_CLASS)).toBe(false);
    expect(classes.has(BLUR_ENTIRE_ROW_CLASS)).toBe(false);
    expect(classes.has(BLUR_MESSAGE_CLASS)).toBe(false);
    expect(classes.has(BLUR_CHAT_WINDOW_CLASS)).toBe(false);
    expect(classes.has(BLUR_UNBLUR_ON_HOVER_CLASS)).toBe(false);
    expect(styles.has('--chat-blur-amount')).toBe(false);
  });

  it('defaults to globalThis.document when targetDoc is omitted', () => {
    const originalDoc = (globalThis as any).document;
    const { doc, classes, styles } = createMockDocument(
      [
        BLUR_ENABLED_CLASS,
        BLUR_AVATAR_CLASS,
        BLUR_CHAT_WINDOW_CLASS,
        BLUR_UNBLUR_ON_HOVER_CLASS,
      ],
      { '--chat-blur-amount': '8px' }
    );

    try {
      (globalThis as any).document = doc;
      removePrivacySettingsFromDOM();

      expect(classes.has(BLUR_ENABLED_CLASS)).toBe(false);
      expect(classes.has(BLUR_AVATAR_CLASS)).toBe(false);
      expect(classes.has(BLUR_CHAT_WINDOW_CLASS)).toBe(false);
      expect(classes.has(BLUR_UNBLUR_ON_HOVER_CLASS)).toBe(false);
      expect(styles.has('--chat-blur-amount')).toBe(false);
    } finally {
      (globalThis as any).document = originalDoc;
    }
  });

  it('safely handles undefined document without throwing', () => {
    expect(() => removePrivacySettingsFromDOM(undefined)).not.toThrow();
  });
});
