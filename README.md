# ChatGard: Screen Privacy for Web Messengers

ChatGard is a browser extension that blurs chat lists and messages until hovered to prevent shoulder surfing in public and office environments. Built for WhatsApp Web with planned support for Telegram Web and other web messengers.

## Features

- **Hover to reveal**: Blurs chat list items by default and reveals content when hovered.
- **Configurable popup**: Toggle protection on/off and adjust blur intensity.
- **Local-first**: No remote requests, no telemetry, and operates strictly on client DOM.

## Installation from Release

Download the pre-built zip file for your browser from the latest [GitHub Releases](https://github.com/fblazt/chatgard/releases).

### Chromium-based Browsers (Chrome, Brave, Edge)

1. Download the `chatgard-*-chrome.zip` archive from the release assets and extract it to a folder.
2. Open your browser's extensions page:
   - Chrome: `chrome://extensions`
   - Brave: `brave://extensions`
   - Edge: `edge://extensions`
3. Toggle **Developer mode** on (in the top-right corner).
4. Click **Load unpacked** and select the extracted folder.
5. Open [WhatsApp Web](https://web.whatsapp.com) to use ChatGard.

### Firefox (Experimental / Untested)

1. Download the `chatgard-*-firefox.zip` archive from the release assets and extract it to a folder.
2. Open `about:debugging#/runtime/this-firefox` in Firefox.
3. Click **Load Temporary Add-on...**.
4. Select the `manifest.json` file inside the extracted folder.
5. Open [WhatsApp Web](https://web.whatsapp.com).

> [!NOTE]
> In standard Firefox, temporary add-ons stay loaded until the browser restarts. Firefox support is experimental and has not been comprehensively validated on live WhatsApp Web yet.

## Building from Source

### Prerequisites

- [Bun](https://bun.sh/) (v1.0+)

### Setup & Build

Install project dependencies:

```bash
bun install
```

Start the development server:

```bash
bun run dev           # Chromium (default)
bun run dev:firefox   # Firefox
```

Build production packages:

```bash
bun run build         # Chromium (.output/chrome-mv3)
bun run build:firefox # Firefox (.output/firefox-mv2)
```

Create distributable zip files:

```bash
bun run zip           # Chromium zip (.output/chatgard-*-chrome.zip)
bun run zip:firefox   # Firefox zip (.output/chatgard-*-firefox.zip)
```

Run tests:

```bash
bun test
```

Run TypeScript type checking:

```bash
bun run compile
```

### Loading Unpacked Development Build

- **Chromium-based browsers**: Open `chrome://extensions`, enable Developer mode, click **Load unpacked**, and select `.output/chrome-mv3`.
- **Firefox**: Open `about:debugging#/runtime/this-firefox`, click **Load Temporary Add-on...**, and select `.output/firefox-mv2/manifest.json`.

## Browser Compatibility

- **Chromium-based browsers** (Chrome, Brave, Edge): Supported and tested.
- **Firefox**: Experimental / Not fully tested yet (Manifest V2 build available via `bun run build:firefox`).

## License

MIT
