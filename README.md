# ChatGard: Screen Privacy for Web Messengers

ChatGard is a browser extension that blurs chat lists and messages until hovered to prevent shoulder surfing in public and office environments. Built for WhatsApp Web with planned support for Telegram Web and other web messengers.

## Features

- **Hover to reveal**: Blurs chat list items by default and reveals content when hovered.
- **Configurable popup**: Toggle protection on/off and adjust blur intensity.
- **Local-first**: No remote requests, no telemetry, and operates strictly on client DOM.

## Prerequisites

- [Bun](https://bun.sh/) (v1.0+)

## Getting Started

Install project dependencies:

```bash
bun install
```

Start the development server:

```bash
bun run dev
```

Build for production:

```bash
bun run build
```

Run tests:

```bash
bun test
```

Run TypeScript type checking:

```bash
bun run compile
```

## Unpacked Installation Guide

Follow these steps to install the unpacked extension on Chromium-based browsers (Chrome, Brave, Edge):

1. Run `bun run build` to generate the extension output in `.output/chrome-mv3`.
2. Go to `chrome://extensions` (or `brave://extensions`, `edge://extensions`).
3. Turn on "Developer mode" in the top right.
4. Click "Load unpacked" and select the `.output/chrome-mv3` directory.
5. Navigate to `https://web.whatsapp.com`.

## Browser Compatibility

- **Chromium-based browsers** (Chrome, Brave, Edge): Supported.
- **Firefox**: Not fully tested yet (though `bun run build:firefox` is available).

## License

MIT
