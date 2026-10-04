# Airiona showcase

Dribbble/Behance stills, a 15-second motion piece and a case-study page, all made from real captures of the sample pages.

Live case study: https://mohameddsh3ban.github.io/airiona-ui/showcase/

## Pieces

| # | Piece | File | Use |
|---|---|---|---|
| 1 | **Wheels up**: landing on desktop with booking and dashboard phones on one vanishing point | `dribbble/01-wheels-up.jpg` | Cover, Dribbble shot |
| 2 | **Ten screens. One system.**: isometric grid of all ten pages on midnight | `dribbble/02-ten-pages.jpg` | Dribbble shot, overview |
| 3 | **Book. Buy. Operate.**: three native phone apps in a fan | `dribbble/03-book-buy-operate.jpg` | Dribbble shot, mobile |
| 4 | **128 components**: tilted component wall with five floating heroes | `dribbble/04-component-wall.jpg` | Dribbble shot, system |
| 5 | **Built in layers**: exploded landing hero with dashed sockets | `dribbble/05-exploded-hero.jpg` | Dribbble shot, detail |
| 6 | **Specimen**: type, colour, radii and shadows | `dribbble/06-specimen.jpg` | Behance tokens slide |
| 7 | **Wheels up at golden hour**: dark cinematic sign-in and sign-up | `dribbble/07-night-approach.jpg` | Dribbble shot, dark |
| 8 | **Every page, end to end**: full-length phone scrolls on a tilted plane | `dribbble/08-end-to-end.jpg` | Behance closer |
| 9 | **Dubai to London, all-in**: booking on desktop and phone | `dribbble/09-dubai-to-london.jpg` | Behance chapter |
| 10 | **A Gulfstream G550, one tap away**: aircraft marketplace | `dribbble/10-aircraft-marketplace.jpg` | Behance chapter |
| 11 | **A roof for the jet**: hangar marketplace | `dribbble/11-hangar-marketplace.jpg` | Behance chapter |
| 12 | **Motion, 15s**: 1080x1920 vertical reel with music and sound | `site/airiona-motion-15s.mp4` | Reels, Shorts, TikTok, LinkedIn, Dribbble video |

Stills are 3200x2400 (Dribbble 2x, 4:3). Web versions at 2000x1500 live in `site/img/`.

## Rebuild

```bash
npm run playground:build
node tools/showcase/capture.mjs        # captures every page (desktop 2x, phone app 3x)
node tools/showcase/render.mjs         # renders the stills into showcase/out/shots
node tools/showcase/render-video.mjs   # renders the motion piece frame by frame and mixes the sound
```

`showcase/stage/` holds the compositions: `kit.css`/`kit.js` (device frames), `shots.js` (one function per still) and `video.html`/`video.js` (the timeline: `render(t)` places every element for a time, so each frame is exact). Music and sound effects are in `showcase/audio/` (generated with Runway). The hero loops and photos were generated with Higgsfield.
