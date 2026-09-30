import { defineConfig } from 'wxt';

// See https://wxt.dev/api/config.html
export default defineConfig({
  modules: ['@wxt-dev/module-vue'],
  manifest: {
    name: 'ChatGard: Screen Privacy for Web Messengers',
    description: 'Screen privacy and blur protection for WhatsApp Web, Telegram, and web messengers.',
    permissions: ['storage'],
    browser_specific_settings: {
      gecko: {
        id: 'chatgard@fblazt',
        strict_min_version: '109.0',
        data_collection_permissions: {
          required: ['none'],
        },
      },
    },
  },
  webExt: {
    disabled: true,
  },
  zip: {
    zipSources: false,
  },
});
