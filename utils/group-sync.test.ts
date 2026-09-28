import { describe, expect, it } from 'bun:test';
import { DEFAULT_SETTINGS, type PrivacyBlurSettings } from '../types/settings';
import { isEntireRowSynchronized, syncChatListGroup } from './group-sync';

describe('syncChatListGroup', () => {
  const baseSettings: PrivacyBlurSettings = {
    ...DEFAULT_SETTINGS,
    blurEntireRow: false,
    blurLastMessage: false,
    blurContactName: false,
    blurAvatar: false,
    blurChatWindow: false,
    unblurOnHover: false,
  };

  it('activates all 3 children when blurEntireRow is toggled to true', () => {
    const result = syncChatListGroup('blurEntireRow', true, baseSettings);
    expect(result).toEqual({
      blurEntireRow: true,
      blurLastMessage: true,
      blurContactName: true,
      blurAvatar: true,
    });
  });

  it('deactivates all 3 children when blurEntireRow is toggled to false', () => {
    const allActiveSettings: PrivacyBlurSettings = {
      ...baseSettings,
      blurEntireRow: true,
      blurLastMessage: true,
      blurContactName: true,
      blurAvatar: true,
    };

    const result = syncChatListGroup('blurEntireRow', false, allActiveSettings);
    expect(result).toEqual({
      blurEntireRow: false,
      blurLastMessage: false,
      blurContactName: false,
      blurAvatar: false,
    });
  });

  it('turns blurEntireRow to false when a child is toggled to false while all were true', () => {
    const allActiveSettings: PrivacyBlurSettings = {
      ...baseSettings,
      blurEntireRow: true,
      blurLastMessage: true,
      blurContactName: true,
      blurAvatar: true,
    };

    const result = syncChatListGroup('blurLastMessage', false, allActiveSettings);
    expect(result).toEqual({
      blurLastMessage: false,
      blurEntireRow: false,
    });

    const resultContact = syncChatListGroup('blurContactName', false, allActiveSettings);
    expect(resultContact).toEqual({
      blurContactName: false,
      blurEntireRow: false,
    });

    const resultAvatar = syncChatListGroup('blurAvatar', false, allActiveSettings);
    expect(resultAvatar).toEqual({
      blurAvatar: false,
      blurEntireRow: false,
    });
  });

  it('turns blurEntireRow to true when a child is toggled to true and the other 2 are already true', () => {
    const twoActiveSettings: PrivacyBlurSettings = {
      ...baseSettings,
      blurEntireRow: false,
      blurLastMessage: true,
      blurContactName: true,
      blurAvatar: false,
    };

    const result = syncChatListGroup('blurAvatar', true, twoActiveSettings);
    expect(result).toEqual({
      blurAvatar: true,
      blurEntireRow: true,
    });
  });

  it('keeps blurEntireRow false when a child is toggled to true but not all children are true', () => {
    const oneActiveSettings: PrivacyBlurSettings = {
      ...baseSettings,
      blurEntireRow: false,
      blurLastMessage: true,
      blurContactName: false,
      blurAvatar: false,
    };

    const result = syncChatListGroup('blurContactName', true, oneActiveSettings);
    expect(result).toEqual({
      blurContactName: true,
      blurEntireRow: false,
    });
  });

  it('only updates the specific key when toggling non-chat-list keys', () => {
    const resultChatWindow = syncChatListGroup('blurChatWindow', true, baseSettings);
    expect(resultChatWindow).toEqual({
      blurChatWindow: true,
    });

    const resultHover = syncChatListGroup('unblurOnHover', true, baseSettings);
    expect(resultHover).toEqual({
      unblurOnHover: true,
    });
  });
});

describe('isEntireRowSynchronized', () => {
  const baseSettings: PrivacyBlurSettings = {
    ...DEFAULT_SETTINGS,
    blurEntireRow: false,
    blurLastMessage: false,
    blurContactName: false,
    blurAvatar: false,
    blurChatWindow: false,
    unblurOnHover: false,
  };

  it('returns true when all are false and blurEntireRow is false', () => {
    expect(isEntireRowSynchronized(baseSettings)).toBe(true);
  });

  it('returns true when all children are true and blurEntireRow is true', () => {
    const allActive: PrivacyBlurSettings = {
      ...baseSettings,
      blurEntireRow: true,
      blurLastMessage: true,
      blurContactName: true,
      blurAvatar: true,
    };
    expect(isEntireRowSynchronized(allActive)).toBe(true);
  });

  it('returns false when all children are true but blurEntireRow is false', () => {
    const mismatch: PrivacyBlurSettings = {
      ...baseSettings,
      blurEntireRow: false,
      blurLastMessage: true,
      blurContactName: true,
      blurAvatar: true,
    };
    expect(isEntireRowSynchronized(mismatch)).toBe(false);
  });

  it('returns false when blurEntireRow is true but one or more children are false', () => {
    const mismatch: PrivacyBlurSettings = {
      ...baseSettings,
      blurEntireRow: true,
      blurLastMessage: true,
      blurContactName: false,
      blurAvatar: true,
    };
    expect(isEntireRowSynchronized(mismatch)).toBe(false);
  });
});
