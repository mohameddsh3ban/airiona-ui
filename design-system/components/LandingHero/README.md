# LandingHero

The opening hero of a landing or home page. A full-bleed photo, with a looping video on wide screens once the page has settled. A scrim keeps the copy legible over it. The copy is an eyebrow pill, a display headline, a lede, actions and a row of proof figures. With `docked`, the children straddle the bottom edge; a search card is the usual child.

```jsx
<LandingHero
  image="assets/photos/aviation/hero-sky.webp" video="assets/video/hero-sky.mp4" focus="78% 50%"
  eyebrow="Private aviation" title="Fly on your own schedule."
  lede="Charter a jet, buy an aircraft or lease hangar space."
  stats={[{ value: '1,240', label: 'Aircraft listed' }, { value: '15 min', label: 'Average reply' }]}
  actions={<Button variant="primary" size="lg">Book a flight</Button>}
  docked>
  <BookingSearch />
</LandingHero>
```

```html
<ar-landing-hero image="assets/photos/aviation/hero-sky.webp" video="assets/video/hero-sky.mp4" focus="78% 50%"
  eyebrow="Private aviation" title="Fly on your own schedule." [stats]="stats" docked>
  <button arActions arButton variant="primary" size="lg">Book a flight</button>
  <ar-booking-search />
</ar-landing-hero>
```

## Guidance

- Use one per page, at the top. The title is the page's h1 unless you set `headingLevel`.
- Pick a photo with calm space on the left for the copy. On phones the photo is cropped narrow, so set `focus` (an `object-position`) to keep the subject in view.
- The video is decoration. It is muted and hidden from assistive technology. It plays only at 1024px and wider, starts 1200ms after `load` so it never competes with the first paint, and pauses while it is scrolled off screen. It never plays when the visitor prefers reduced motion. The `image` is its poster, so export the poster from the video's first frame.
- Keep stats to three or four short figures. Each one is a `dt` label and a `dd` value, read label first.

## Motion

| Element | Motion | Duration |
| --- | --- | --- |
| Photo | settles from 108% scale | 2400ms, enter easing |
| Copy | rises in order, 80–100ms apart | 800ms |
| Dock | rises after the copy | 800ms, 480ms delay |
| Video | fades in over the poster once playing | 1200ms |
| Grain | steps across the frame (1024px and wider) | 1.2s loop |

Under reduced motion every animation and the video are off.
