# OnboardingFlow

The five-step welcome: step counter and Skip at the top, a swipeable art slide, eyebrow, title and one sentence, then progress dots and a round next button whose ring fills as you go. The last step shows Get started.

**Consumer provides:** `steps` (`[{image | art | scene, alt?, eyebrow, title, text, cta?}]`, 3–5), `onDone(reason)` (`'done'` or `'skip'`), `skipLabel`, `doneLabel`, `label`. Default copy is on `OnboardingFlow.copy`.

**The art.** Five 3D illustrations in one style: glossy Ion Blue and frosted glass, pearl white, small midnight accents, on the `mist` ground (#EDF0F5), which is also the screen colour, so the images have no visible edge. They are in the Onboarding asset group (WebP, about 20 KB each, 896 × 1120).
1. Welcome: a plane flying through a blue ring above glass clouds.
2. Discover: a glass globe with blue map pins and a flight path.
3. Stay: a black A-frame cabin on a cloud island with a calendar tile.
4. Pay: a boarding pass, a card and a blue shield with a check.
5. Go: a phone with trip cards, a blue suitcase and an orbiting plane.

**Rules**
- Five steps maximum, each one idea. The title says the benefit; the sentence says how. No more than 16 words of body text.
- Swiping, tapping next, and tapping a dot all move between steps; Skip jumps to the last step, never straight out.
- New art follows the same brief: soft 3D render, Ion Blue #2B5CFF and sky #C8DDF4 glass, pearl white, midnight #070B2A accents, plain #EDF0F5 background, no text, no people, 4:5.
- Show once on first launch, and again only from Settings → "Replay intro".

## Motion

| Moment | Behaviour |
|---|---|
| Hover | Next button grows 1.06; arrow nudges. |
| Press | Next scales to 0.94. |
| Enter | The art scales in then floats; eyebrow, title and text rise 70ms apart. |
| State change | Dots stretch to the active step; the ring fills. |
| Tokens | duration-page · ease-enter · ease-spring |

All motion stops under `prefers-reduced-motion`; state changes still apply instantly.
