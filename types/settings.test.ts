import { describe, expect, it } from "bun:test";
import { DEFAULT_SETTINGS, isValidSettings, type PrivacyBlurSettings } from "./settings";

describe("PrivacyBlurSettings and DEFAULT_SETTINGS", () => {
  it("should have correct default values defined in DEFAULT_SETTINGS", () => {
    expect(DEFAULT_SETTINGS).toBeDefined();
    expect(DEFAULT_SETTINGS.enabled).toBe(true);
    expect(DEFAULT_SETTINGS.blurAmount).toBe(8);
    expect(DEFAULT_SETTINGS.blurEntireRow).toBe(true);
    expect(DEFAULT_SETTINGS.blurLastMessage).toBe(false);
    expect(DEFAULT_SETTINGS.blurContactName).toBe(false);
    expect(DEFAULT_SETTINGS.blurAvatar).toBe(false);
    expect(DEFAULT_SETTINGS.blurChatWindow).toBe(true);
    expect(DEFAULT_SETTINGS.unblurOnHover).toBe(true);
  });

  it("should validate DEFAULT_SETTINGS using isValidSettings", () => {
    expect(isValidSettings(DEFAULT_SETTINGS)).toBe(true);
  });

  it("should validate custom valid settings objects", () => {
    const customSettings: PrivacyBlurSettings = {
      enabled: false,
      blurAmount: 12,
      blurEntireRow: false,
      blurLastMessage: true,
      blurContactName: true,
      blurAvatar: true,
      blurChatWindow: false,
      unblurOnHover: false,
    };
    expect(isValidSettings(customSettings)).toBe(true);
  });

  it("should return false for non-object or null values", () => {
    expect(isValidSettings(null)).toBe(false);
    expect(isValidSettings(undefined)).toBe(false);
    expect(isValidSettings("settings")).toBe(false);
    expect(isValidSettings(123)).toBe(false);
    expect(isValidSettings(true)).toBe(false);
  });

  it("should return false when required properties are missing", () => {
    const incomplete = {
      enabled: true,
      blurAmount: 8,
      blurEntireRow: true,
    };
    expect(isValidSettings(incomplete)).toBe(false);

    const missingBlurChatWindow: Record<string, unknown> = {
      ...DEFAULT_SETTINGS,
    };
    delete missingBlurChatWindow.blurChatWindow;
    expect(isValidSettings(missingBlurChatWindow)).toBe(false);
  });

  it("should return false when property types are incorrect", () => {
    expect(
      isValidSettings({
        ...DEFAULT_SETTINGS,
        enabled: "true",
      })
    ).toBe(false);

    expect(
      isValidSettings({
        ...DEFAULT_SETTINGS,
        blurAmount: "8",
      })
    ).toBe(false);

    expect(
      isValidSettings({
        ...DEFAULT_SETTINGS,
        blurAmount: Number.NaN,
      })
    ).toBe(false);

    expect(
      isValidSettings({
        ...DEFAULT_SETTINGS,
        blurAmount: -5,
      })
    ).toBe(false);

    expect(
      isValidSettings({
        ...DEFAULT_SETTINGS,
        blurChatWindow: "true",
      })
    ).toBe(false);

    expect(
      isValidSettings({
        ...DEFAULT_SETTINGS,
        unblurOnHover: 1,
      })
    ).toBe(false);
  });
});
