# SuccessBurst

The big stop. One celebration at the end of a flow: the disc pops, the tick draws itself, a ring and fourteen particles burst outward, then the title and line rise in. About 1.2s end to end (`duration-celebrate`).

**Consumer provides:** `title`, `children` (one line), optional `size` (`md` | `sm`), `replayKey` (change it to play again).

- Only for money and commitments that succeeded: booking confirmed, payment done, trip saved for offline. Once per flow, never on every save.
- Put it inside the success Dialog or at the top of the confirmation screen; buttons appear after the text has risen in.
- It has `role="status"`, so the title is announced.

## Motion

| Moment | Behaviour |
|---|---|
| Enter | Disc pops, the tick draws, a ring and 14 particles burst, then title and text rise. |
| State change | Replay with a new replayKey. Once per flow. |
| Tokens | duration-celebrate · ease-spring |

All motion stops under `prefers-reduced-motion`; state changes still apply instantly.
