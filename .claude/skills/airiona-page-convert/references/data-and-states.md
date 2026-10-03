# Data, sample data and states

## Types

Write a type per record the page shows (`Stay`, `Flight`, `Booking`, `Traveller`). Fields use `string`, `number`, `boolean`, `ISODate` (an ISO date string), string unions (`'confirmed' | 'pending'`), other type names, and `[]` for lists; suffix `?` when optional.

- **Money:** amount as `number` in the currency's minor or major unit (say which in `notes`) plus a `currency: string` (ISO 4217). Display strings like `"$1,284"` are fine for `sample` fields that the component takes as text (prices on cards), but the source of truth stays numeric.
- **Dates and times:** `ISODate` for calendar days (check-in, birth date). Flight times are local to the airport: keep `departAt` as an ISO date-time with offset and show the local time; never convert to the viewer's zone.
- **Fields that feed a component's union input** (`tone`, `variant`, `status`) must be typed with that union, or the build fails. `describe` shows the union.

## Sample data

Realistic, specific, and consistent across the page: real-sounding names (Maya Haddad, Omar Saleh), real cities and airport codes (DXB → LIS), plausible prices and dates in the near future. Never lorem ipsum, never "Item 1". The sample is what reviewers see in the screenshots, so it must read like the product.

Images: use the assets that ship with the system (`assets/photos/forest-cabin.webp`, `assets/photos/alpine-lodge.webp`, `assets/photos/cliff-villa.webp`, `assets/photos/tokyo-penthouse.webp`, `assets/photos/lisbon-rooftops.webp`, `assets/photos/white-hotel.webp`, `assets/photos/jet-clouds.webp`; 3D art in `assets/art/`: `globe.webp`, `route-globe.webp`, `jet-3d.webp`, `ai-orb.webp`, `car-3d.webp`, `scooter-3d.webp`). Components without an image fall back to a drawn `Scene`.

## States

Every `data` entry says what the page shows while **loading**, on **error**, and (for lists) when **empty**:

| State | Default treatment |
|---|---|
| Loading | `Skeleton` blocks in the final layout (same heights), never a full-page spinner. Keep sticky bars visible but disabled. |
| Empty list | `IllustrationCallout` with one sentence on why it is empty and one action ("Change dates"). |
| Error | `Toast` (danger) with a Retry action; keep showing the last good data when there is some. For a whole-page failure, an `IllustrationCallout` with Retry in place of the content. |
| Partial | Show what loaded; mark the missing part in place. |
| Offline | Same as error, with "You're offline" wording. |

Per element, use `states` when the element differs from its data's default (for example a price that shows "—" while the quote refreshes).

## Where data comes from

`source` names the endpoint or store (`GET /api/stays/:id`, `route param :id`, `user store`). Note pagination (`?page=`), sorting and filtering parameters the page drives, and which fields are editable.
