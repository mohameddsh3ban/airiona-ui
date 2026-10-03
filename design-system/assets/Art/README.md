# Art

3D renders in the onboarding style, used inside components: soft 3D, glossy Ion Blue #2B5CFF and sky #C8DDF4 glass, pearl white, small midnight #070B2A accents.

| File | Used by | Notes |
|---|---|---|
| ai-orb.webp | PromptCard, AssistantCard, PilotDashboard | Glass orb with ring and sparkles on a pearl pedestal. Transparent. |
| globe.webp | RouteHeader, HeroHeader | Frosted glass globe rising from the bottom, on midnight #070B2A. Opaque, crop from the bottom. |
| jet-3d.webp | BoardingPass | Pearl-white jet with an Ion Blue tail. Transparent. |
| car-3d.webp | RideTile | Pearl-white sedan with Ion Blue wheels and trim. Transparent. |
| scooter-3d.webp | TripSummaryTile | Pearl-white kick scooter with an Ion Blue deck. Transparent. |
| route-globe.webp | Marketing, empty states | Globe with a plane on a dashed arc. Do not put it behind RouteHeader, which draws its own arc. |

- WebP, transparent where noted, 15–35 KB each. Generated for Airiona with Higgsfield (gpt_image_2_5), backgrounds removed with Higgsfield's remover.
- New art follows the same brief. No text, no people, no logos. Never stretch; use object-fit: contain (cutouts) or cover from the bottom (globe).
