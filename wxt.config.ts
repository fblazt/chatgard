import { defineConfig } from 'wxt';

// See https://wxt.dev/api/config.html
export default defineConfig({
  modules: ['@wxt-dev/module-vue'],
  manifest: {
    name: 'Secure Chat',
    description: 'Blurs WhatsApp Web chat list items until hovered for enhanced screen privacy.',
    permissions: ['storage'],
  },
});
