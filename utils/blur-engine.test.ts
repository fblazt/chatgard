import { describe, it, expect, beforeEach, afterEach } from 'bun:test';
import type { PrivacyBlurSettings } from '../types/settings';
import {
  ALL_BLUR_CLASSES,
  BLUR_AVATAR_CLASS,
  BLUR_CONTACT_CLASS,
  BLUR_ENABLED_CLASS,
  BLUR_ENTIRE_ROW_CLASS,
  BLUR_MESSAGE_CLASS,
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
    expect(BLUR_ENABLED_CLASS).toBe('secure-chat-blur-enabled');
    expect(BLUR_ENTIRE_ROW_CLASS).toBe('secure-chat-blur-entire-row');
    expect(BLUR_MESSAGE_CLASS).toBe('secure-chat-blur-message');
    expect(BLUR_CONTACT_CLASS).toBe('secure-chat-blur-contact');
    expect(BLUR_AVATAR_CLASS).toBe('secure-chat-blur-avatar');
  });

  it('contains all blur classes in ALL_BLUR_CLASSES', () => {
    expect(ALL_BLUR_CLASSES).toEqual([
      BLUR_ENABLED_CLASS,
      BLUR_ENTIRE_ROW_CLASS,
      BLUR_MESSAGE_CLASS,
      BLUR_CONTACT_CLASS,
      BLUR_AVATAR_CLASS,
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
    };

    expect(computeDOMClasses(fullRowSettings)).toEqual([
      BLUR_ENABLED_CLASS,
      BLUR_ENTIRE_ROW_CLASS,
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
    };
    expect(computeDOMClasses(messageOnly)).toEqual([
      BLUR_ENABLED_CLASS,
      BLUR_MESSAGE_CLASS,
    ]);

    const contactAndAvatar: PrivacyBlurSettings = {
      ...baseSettings,
      enabled: true,
      blurEntireRow: false,
      blurLastMessage: false,
      blurContactName: true,
      blurAvatar: true,
    };
    expect(computeDOMClasses(contactAndAvatar)).toEqual([
      BLUR_ENABLED_CLASS,
      BLUR_CONTACT_CLASS,
      BLUR_AVATAR_CLASS,
    ]);

    const allSelective: PrivacyBlurSettings = {
      ...baseSettings,
      enabled: true,
      blurEntireRow: false,
      blurLastMessage: true,
      blurContactName: true,
      blurAvatar: true,
    };
    expect(computeDOMClasses(allSelective)).toEqual([
      BLUR_ENABLED_CLASS,
      BLUR_MESSAGE_CLASS,
      BLUR_CONTACT_CLASS,
      BLUR_AVATAR_CLASS,
    ]);
  });

  it('returns only BLUR_ENABLED_CLASS when enabled but no blur options selected', () => {
    const minimalEnabled: PrivacyBlurSettings = {
      ...baseSettings,
      enabled: true,
      blurEntireRow: false,
      blurLastMessage: false,
      blurContactName: false,
      blurAvatar: false,
    };
    expect(computeDOMClasses(minimalEnabled)).toEqual([BLUR_ENABLED_CLASS]);
  });
});

describe('computeStyleVariables', () => {
  it('sets --secure-chat-blur-amount based on blurAmount setting', () => {
    expect(computeStyleVariables({ ...baseSettings, blurAmount: 8 })).toEqual({
      '--secure-chat-blur-amount': '8px',
    });

    expect(computeStyleVariables({ ...baseSettings, blurAmount: 14 })).toEqual({
      '--secure-chat-blur-amount': '14px',
    });

    expect(computeStyleVariables({ ...baseSettings, blurAmount: 0 })).toEqual({
      '--secure-chat-blur-amount': '0px',
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
      blurAmount: 12,
    };

    applyPrivacySettingsToDOM(settings, doc);

    expect(classes.has(BLUR_ENABLED_CLASS)).toBe(true);
    expect(classes.has(BLUR_MESSAGE_CLASS)).toBe(true);
    expect(classes.has(BLUR_CONTACT_CLASS)).toBe(true);
    expect(classes.has(BLUR_AVATAR_CLASS)).toBe(false);
    expect(classes.has(BLUR_ENTIRE_ROW_CLASS)).toBe(false);
    expect(styles.get('--secure-chat-blur-amount')).toBe('12px');
  });

  it('removes stale blur classes when settings are updated', () => {
    const { doc, classes } = createMockDocument([
      BLUR_ENABLED_CLASS,
      BLUR_ENTIRE_ROW_CLASS,
      BLUR_MESSAGE_CLASS,
    ]);

    const selectiveSettings: PrivacyBlurSettings = {
      ...baseSettings,
      enabled: true,
      blurEntireRow: false,
      blurLastMessage: false,
      blurAvatar: true,
      blurAmount: 6,
    };

    applyPrivacySettingsToDOM(selectiveSettings, doc);

    expect(classes.has(BLUR_ENABLED_CLASS)).toBe(true);
    expect(classes.has(BLUR_ENTIRE_ROW_CLASS)).toBe(false);
    expect(classes.has(BLUR_MESSAGE_CLASS)).toBe(false);
    expect(classes.has(BLUR_AVATAR_CLASS)).toBe(true);
  });

  it('removes all blur classes when settings are disabled', () => {
    const { doc, classes } = createMockDocument([
      BLUR_ENABLED_CLASS,
      BLUR_ENTIRE_ROW_CLASS,
      BLUR_MESSAGE_CLASS,
    ]);

    const disabledSettings: PrivacyBlurSettings = {
      ...baseSettings,
      enabled: false,
      blurEntireRow: true,
    };

    applyPrivacySettingsToDOM(disabledSettings, doc);

    expect(classes.has(BLUR_ENABLED_CLASS)).toBe(false);
    expect(classes.has(BLUR_ENTIRE_ROW_CLASS)).toBe(false);
    expect(classes.has(BLUR_MESSAGE_CLASS)).toBe(false);
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
    expect(styles.get('--secure-chat-blur-amount')).toBe('10px');
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
});

describe('removePrivacySettingsFromDOM', () => {
  it('removes all blur classes and style properties from targetDoc', () => {
    const { doc, classes, styles } = createMockDocument(
      [BLUR_ENABLED_CLASS, BLUR_ENTIRE_ROW_CLASS, BLUR_MESSAGE_CLASS],
      { '--secure-chat-blur-amount': '10px' }
    );

    removePrivacySettingsFromDOM(doc);

    expect(classes.has(BLUR_ENABLED_CLASS)).toBe(false);
    expect(classes.has(BLUR_ENTIRE_ROW_CLASS)).toBe(false);
    expect(classes.has(BLUR_MESSAGE_CLASS)).toBe(false);
    expect(styles.has('--secure-chat-blur-amount')).toBe(false);
  });

  it('defaults to globalThis.document when targetDoc is omitted', () => {
    const originalDoc = (globalThis as any).document;
    const { doc, classes, styles } = createMockDocument(
      [BLUR_ENABLED_CLASS, BLUR_AVATAR_CLASS],
      { '--secure-chat-blur-amount': '8px' }
    );

    try {
      (globalThis as any).document = doc;
      removePrivacySettingsFromDOM();

      expect(classes.has(BLUR_ENABLED_CLASS)).toBe(false);
      expect(classes.has(BLUR_AVATAR_CLASS)).toBe(false);
      expect(styles.has('--secure-chat-blur-amount')).toBe(false);
    } finally {
      (globalThis as any).document = originalDoc;
    }
  });

  it('safely handles undefined document without throwing', () => {
    expect(() => removePrivacySettingsFromDOM(undefined)).not.toThrow();
  });
});
