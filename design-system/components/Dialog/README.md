# Dialog

A modal panel that asks for one decision or one short task, over a blurred scrim. On phones it becomes a bottom sheet.

**Consumer provides:** `open`, `onClose`, `title`, `description`, `children` (body), `footer` (buttons, primary last), optional `tone` (`default` | `danger` | `success` | `brand`), `icon` (or `false`), `size` (`sm` 420 · `md` 520 · `lg` 720), `media` (a `Scene` or image on top), `dismissible` (default true), `inline` (render in place, for docs).

- Renders into `document.body`, locks page scroll, traps Tab, closes on Escape and scrim click, and returns focus to the element that opened it. Put `data-autofocus` on the field that should take focus first.
- Title is a question or an outcome ("Cancel this booking?", "Booking confirmed"). The description states the specifics.
- The confirm button names the consequence with the amount: "Cancel and refund $512", never "OK" or "Yes".
- Money dialogs show the breakdown in an inset plate (`.ar-plate`, `.ar-plate__row`, `.ar-plate__row--total`).
- `danger` tone uses `role="alertdialog"` and the danger icon. One dialog at a time; never stack them.
- Use a full page, not a dialog, for anything longer than one screen (checkout, profile edit).

## Motion

| Moment | Behaviour |
|---|---|
| Enter | Scrim fades and blurs in; panel rises 12px and scales from 0.98; the icon pops. |
| State change | Closing plays in reverse: panel sinks and fades in 200ms before unmounting. |
| Tokens | duration-slow in · duration-base out · ease-enter / ease-exit |

All motion stops under `prefers-reduced-motion`; state changes still apply instantly.
