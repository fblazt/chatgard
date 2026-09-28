<template>
  <header class="tactical-header hud-scanlines">
    <div class="icon-box">
      <svg
        class="shield-icon"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        stroke-width="2"
        stroke-linecap="round"
        stroke-linejoin="round"
        aria-hidden="true"
      >
        <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
      </svg>
    </div>
    <span class="brand-title">CHATGARD</span>
  </header>
</template>

<style scoped>
.tactical-header {
  display: flex;
  align-items: center;
  gap: 10px;
  padding: 6px 12px;
  background: var(--card-bg, #0d1522);
  border: 1px solid var(--card-border, #1a2638);
  border-radius: 2px;
  box-sizing: border-box;
}

.icon-box {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 26px;
  height: 26px;
  border: 1px solid var(--inactive-border, #243348);
  border-radius: 2px;
  background: rgba(0, 0, 0, 0.2);
  flex-shrink: 0;
  box-sizing: border-box;
}

.shield-icon {
  width: 15px;
  height: 15px;
  color: var(--accent-green, #25D366);
  filter: drop-shadow(0 0 4px var(--accent-green-glow, rgba(37, 211, 102, 0.4)));
}

.brand-title {
  font-family: var(--font-mono, monospace);
  font-size: 14px;
  font-weight: 700;
  letter-spacing: 1.8px;
  color: var(--text-primary, #e2e8f0);
  text-transform: uppercase;
  line-height: 1;
  user-select: none;
}
</style>
