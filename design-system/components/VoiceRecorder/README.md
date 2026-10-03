# VoiceRecorder

A midnight tile for a voice note: title, date, settings button, waveform with a red playhead, running time and a red pause button.

**Consumer provides:** `title`, `date`, `time`, `waveform` (bar heights), `position` (0–1), `playing`.

- Red here means recording, the one place `danger` is used outside errors.

## Motion

| Moment | Behaviour |
|---|---|
| State change | While playing, the waveform breathes bar by bar. |
| Tokens | 1s loop |

All motion stops under `prefers-reduced-motion`; state changes still apply instantly.
