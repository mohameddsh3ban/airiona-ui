import { Type } from '@angular/core';

/** One showcase entry. `component` renders the same states as the React preview card. */
export interface DemoDef {
  name: string;
  group: string;
  component: Type<unknown>;
  /** Minimum stage height in px (from the React preview). */
  height?: number;
  /** Extra inline style on the stage, e.g. 'padding:20px 0;'. */
  stage?: string;
}

/** Image paths used by demos, mirroring the design system's asset groups. */
export const IMG = {
  forestCabin: 'photos/forest-cabin.webp',
  alpineLodge: 'photos/alpine-lodge.webp',
  cliffVilla: 'photos/cliff-villa.webp',
  tokyoPenthouse: 'photos/tokyo-penthouse.webp',
  lisbonRooftops: 'photos/lisbon-rooftops.webp',
  jetClouds: 'photos/jet-clouds.webp',
  whiteHotel: 'photos/white-hotel.webp',
  onboarding: [1, 2, 3, 4, 5].map((i) => `onboarding/onboarding-${i}.webp`),
  aiOrb: 'art/ai-orb.webp',
  globe: 'art/globe.webp',
  jet3d: 'art/jet-3d.webp',
  car3d: 'art/car-3d.webp',
  scooter3d: 'art/scooter-3d.webp',
  routeGlobe: 'art/route-globe.webp',
} as const;
