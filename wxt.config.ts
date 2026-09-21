import { defineConfig } from 'wxt';

// See https://wxt.dev/api/config.html
export default defineConfig({
  modules: ['@wxt-dev/module-vue'],
  manifest: {
    name: 'ChatGard: Screen Privacy for Web Messengers',
    description: 'Screen privacy and blur protection for WhatsApp Web, Telegram, and web messengers.',
    permissions: ['storage'],
  },
});
