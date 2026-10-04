# SplitHero

The opening of the landing page:
- **Copy on one side:** an eyebrow with a dashed flight trail, a two-part display headline (the second part in Ion Blue with a hand-drawn underline), a lede and actions.
- **Photo on the other side**, in an organic shape. It turns into a looping video once the page has settled.
- **Glass badge** with faces and a figure.
- **"Watch the story"** ring button.
- **Docked children** (the search bar) straddle the bottom edge when `docked` is set.

```jsx
<SplitHero eyebrow="Fly. Land. Explore." title="The sky" accent="is yours."
  lede="Private jets, hand-picked destinations and hangar space, booked in minutes."
  image="assets/photos/aviation/landing-hero.webp" video="assets/video/landing-hero.mp4"
  badge={{ value: '28K+', title: 'Happy flyers', text: 'joined this year', people }}
  storyLabel="Watch the story" onStory={openStory}
  actions={<Button variant="primary" size="lg" iconEnd="arrow-right">Book a flight</Button>} docked>
  <BookingSearch />
</SplitHero>
```

```html
<ar-split-hero eyebrow="Fly. Land. Explore." title="The sky" accent="is yours." image="…" video="…"
  [badge]="badge" storyLabel="Watch the story" (story)="openStory()" docked>
  <button arActions arButton variant="primary" size="lg" iconEnd="arrow-right">Book a flight</button>
  <ar-booking-search />
</ar-split-hero>
```

## Guidance

- Use one per page, at the top. The title is the page's h1 unless you set `headingLevel`.
- Keep `title` to two or three words and `accent` to two. They stack on two lines at every width.
- **Frame, then video:**
  - `image` is the first frame people see, so export it from the video's first frame.
  - The video starts 1200ms after `load`, fades in over the frame, and pauses while scrolled off screen.
  - It never plays under reduced motion or when data saver is on.
  - It is muted and hidden from assistive technology. Put the story itself behind `storyLabel`; the ring button emits `story`, so open a dialog with the full film there.
- The shape bites in on the left, where the ring button sits, at 1024px and wider. Below that the media stacks under the copy and the button sits at the photo's lower left.
- The badge sits on the photo's top right: three faces, one short figure and two short lines.

## Motion

| Element | Motion | Duration |
| --- | --- | --- |
| Copy | rises in order | 800ms, 80–340ms delays |
| Photo | settles from 104% scale and fades in | 1400ms |
| Badge, ring button | rise in after the photo | 700ms, 600 and 720ms delays |
| Ring text | turns once every 22s (1024px and wider) | loop |
| Video | fades in over the frame once playing | 1200ms |

Under reduced motion every animation and the video are off.
