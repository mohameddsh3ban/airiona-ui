# AuthShell

Split-screen sign-in and sign-up: the form column on one side and a cinematic media panel on the other, with a poster frame, a looping video, a headline and rotating highlight cards. Below 1024px the panel becomes a slim image strip above the form.

**Consumer provides:** `poster` (still frame, also the strip), optional `video` (muted loop), `stripImage` (phone crop), `headline`, `highlights` (`[{title, text}]`), `side` (`left` for sign-in, `right` for sign-up so the route change flips the card), `wide` (long forms), `brand`, `actions`, `footer`, `legal`, `interval` (ms per highlight), and the form as children. In Angular: `[arBrand]`, `[arActions]`, `[arFoot]` slots.

- Use the `ar-auth-head`, `ar-auth-row`, `ar-auth-link`, `ar-auth-divider`, `ar-auth-social` and `ar-auth-switch` classes for the form's parts so sign-in and sign-up line up.
- The video never competes with the first paint: it loads after the page has settled, only on wide screens and only when motion is allowed. Make the poster the video's first frame so the switch is invisible.
- Highlights are short, factual capabilities, not statistics or testimonials. They rotate when each progress tick fills and pause while the pointer is on the panel or focus is in the form.
- One h1 per screen, in the form column ("Welcome back", "Create your account"); the panel headline is decorative text.

## Motion

| Moment | Behaviour |
|---|---|
| Enter | The panel scales in; the brand, form fields and footer rise in a short stagger; the headline and cards follow. |
| State change | Highlight cards cross-fade; the tick under the current card fills over the interval. |
| Hover | The media drifts up to 10px with the pointer (parallax). |
| Tokens | duration-page · ease-enter |

All motion stops under `prefers-reduced-motion`; the video does not play and the highlights stop rotating.
