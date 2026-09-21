import '@/assets/chat-blur.css';
import { getPrivacySettings, privacySettingsStorage } from '@/utils/storage';
import { applyPrivacySettingsToDOM, removePrivacySettingsFromDOM } from '@/utils/blur-engine';

export default defineContentScript({
  matches: ['*://web.whatsapp.com/*'],
  cssInjectionMode: 'manifest',
  async main(ctx) {
    const initialSettings = await getPrivacySettings();
    applyPrivacySettingsToDOM(initialSettings);

    const unwatch = privacySettingsStorage.watch((newSettings) => {
      if (newSettings) {
        applyPrivacySettingsToDOM(newSettings);
      }
    });

    ctx.onInvalidated(() => {
      unwatch();
      removePrivacySettingsFromDOM();
    });

    console.info('[ChatGard] Privacy blur initialized');
  },
});
