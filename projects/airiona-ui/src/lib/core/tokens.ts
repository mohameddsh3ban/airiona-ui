/* Generated from tokens.json. Use CSS variables in templates (var(--blue-500)); use these where a value is needed in code, e.g. charts or canvas. */
export const AR_TOKENS = {
  "color": {
    "canvas": "#eceef2",
    "surface": "#ffffff",
    "surface-sunken": "#f4f5f8",
    "surface-raised": "#ffffff",
    "line": "#e2e5eb",
    "line-strong": "#cdd2db",
    "line-control": "#8c93a3",
    "ink": "#0a0f24",
    "ink-muted": "#545b6e",
    "ink-subtle": "#646b7e",
    "ink-inverse": "#ffffff",
    "blue-50": "#eef3ff",
    "blue-100": "#dde7ff",
    "blue-200": "#bccdff",
    "blue-300": "#8da8ff",
    "blue-400": "#5c82ff",
    "blue-500": "#2b5cff",
    "blue-600": "#1a45e0",
    "blue-700": "#1534b0",
    "blue-900": "#0b1a5c",
    "on-brand": "#ffffff",
    "sky-100": "#e3eefa",
    "sky-200": "#c8ddf4",
    "mist": "#edf0f5",
    "midnight": "#070b2a",
    "action": "#0a0f24",
    "action-hover": "#1f2640",
    "on-action": "#ffffff",
    "success": "#0e7c55",
    "success-tint": "#e3f5ec",
    "warning": "#a35f00",
    "warning-tint": "#fff2dc",
    "danger": "#c8322a",
    "danger-tint": "#fde8e6",
    "rating": "#e8920c",
    "glass": "rgba(255, 255, 255, 0.72)",
    "glass-dark": "rgba(8, 11, 24, 0.42)",
    "glass-line": "rgba(255, 255, 255, 0.65)",
    "scrim": "rgba(5, 8, 20, 0.55)"
  },
  "shadow": {
    "shadow-xs": "0 1px 2px rgba(10, 15, 36, 0.06)",
    "shadow-card": "0 1px 2px rgba(10, 15, 36, 0.04), 0 12px 32px -12px rgba(10, 15, 36, 0.14)",
    "shadow-float": "0 2px 4px rgba(10, 15, 36, 0.04), 0 28px 64px -20px rgba(10, 15, 36, 0.30)",
    "shadow-glass": "inset 0 1px 0 rgba(255, 255, 255, 0.6), 0 8px 24px -8px rgba(10, 15, 36, 0.28)",
    "shadow-brand": "0 10px 24px -10px rgba(43, 92, 255, 0.6)"
  },
  "spacing": {
    "space-1": "4px",
    "space-2": "8px",
    "space-3": "12px",
    "space-4": "16px",
    "space-5": "20px",
    "space-6": "24px",
    "space-8": "32px",
    "space-10": "40px",
    "space-12": "48px",
    "space-16": "64px",
    "space-24": "96px"
  },
  "radius": {
    "radius-xs": "6px",
    "radius-sm": "12px",
    "radius-md": "18px",
    "radius-lg": "24px",
    "radius-xl": "32px",
    "radius-2xl": "40px",
    "radius-pill": "999px"
  },
  "duration": {
    "duration-instant": "80ms",
    "duration-fast": "120ms",
    "duration-base": "200ms",
    "duration-slow": "320ms",
    "duration-sheet": "380ms",
    "duration-page": "420ms",
    "duration-emphasis": "900ms",
    "duration-celebrate": "1200ms",
    "duration-stagger": "40ms"
  },
  "easing": {
    "ease-standard": "cubic-bezier(0.2, 0, 0, 1)",
    "ease-enter": "cubic-bezier(0.05, 0.7, 0.1, 1)",
    "ease-exit": "cubic-bezier(0.3, 0, 0.8, 0.15)",
    "ease-spring": "cubic-bezier(0.34, 1.4, 0.64, 1)",
    "ease-sheet": "cubic-bezier(0.32, 0.72, 0, 1)",
    "ease-linear": "linear"
  },
  "zIndex": {
    "z-sticky": "20",
    "z-popover": "40",
    "z-dialog": "60",
    "z-toast": "80"
  },
  "touch": {
    "tap-min": "44px",
    "tap-comfort": "56px",
    "gutter-mobile": "20px",
    "status-bar": "50px",
    "home-indicator": "34px",
    "tabbar-height": "84px",
    "appbar-height": "56px",
    "sheet-radius": "34px",
    "card-radius-mobile": "28px"
  },
  "fontFamily": {
    "display": "\"Bricolage Grotesque\", \"Geist\", ui-sans-serif, system-ui, sans-serif",
    "sans": "\"Geist\", ui-sans-serif, system-ui, -apple-system, \"Segoe UI\", sans-serif",
    "mono": "\"Geist Mono\", ui-monospace, \"SFMono-Regular\", Menlo, Consolas, monospace"
  }
} as const;

export type ArColorToken = keyof typeof AR_TOKENS.color;

/** `arVar('blue-500')` -> 'var(--blue-500)' */
export function arVar(name: string): string {
  return `var(--${name})`;
}
