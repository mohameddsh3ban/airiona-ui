// Types and sample data for the Aircraft page. Generated from docs/pages/aircraft-market/page.spec.json.
// Sources: aircraft <- GET /api/aircraft?category&sort&q&page (24 per page); hangarTiles <- GET /api/featured (three tiles from the other marketplace).

export type Listing = {
  id: string;
  title: string;
  price: string;
  unit: string;
  description: string;
  tags: string[];
  image: string;
  photos: number;
  saved: boolean;
};

export type Tile = {
  title: string;
  image: string;
  price: string;
  duration: string;
  dates: string;
  badge?: string;
};

export interface AircraftMarketPageData {
  aircraft: Listing[];
  hangarTiles: Tile[];
}

export const AIRCRAFTMARKET_SAMPLE: AircraftMarketPageData = {
  "aircraft": [
    {
      "id": "g550",
      "title": "Gulfstream G550",
      "price": "$24.5M",
      "unit": "asking",
      "description": "2016 · 4,210 hours, 16 seats, 6,750 nm range. Fresh 72-month inspection, PlaneView cockpit, full records. Based at Dubai World Central.",
      "tags": [
        "Heavy jet",
        "Dubai"
      ],
      "image": "assets/photos/aviation/jet-heavy.webp",
      "photos": 5,
      "saved": true
    },
    {
      "id": "praetor",
      "title": "Embraer Praetor 600",
      "price": "$16.9M",
      "unit": "asking",
      "description": "2020 · 1,180 hours, 12 seats, 4,018 nm range. Ka-band Wi-Fi, fly-by-wire, on Embraer Executive Care.",
      "tags": [
        "Super-midsize",
        "Riyadh"
      ],
      "image": "assets/photos/aviation/jet-midsize.webp",
      "photos": 5,
      "saved": false
    },
    {
      "id": "cj4",
      "title": "Cessna Citation CJ4",
      "price": "$8.2M",
      "unit": "asking",
      "description": "2019 · 1,640 hours, 9 seats, single-pilot certified. Engines on ProParts, Garmin G3000 upgrade.",
      "tags": [
        "Light jet",
        "Doha"
      ],
      "image": "assets/photos/aviation/jet-light.webp",
      "photos": 4,
      "saved": false
    },
    {
      "id": "challenger",
      "title": "Bombardier Challenger 350",
      "price": "$13.2M",
      "unit": "asking",
      "description": "2017 · 2,950 hours, 10 seats, flat-floor cabin refurbished 2024. Smart Parts Plus, no damage history.",
      "tags": [
        "Super-midsize",
        "Muscat"
      ],
      "image": "assets/photos/aviation/jet-cabin.webp",
      "photos": 5,
      "saved": false
    },
    {
      "id": "pc12",
      "title": "Pilatus PC-12 NGX",
      "price": "$5.4M",
      "unit": "asking",
      "description": "2022 · 420 hours, 8 seats, short-field ready. Executive interior, autothrottle, still under factory warranty.",
      "tags": [
        "Turboprop",
        "Abu Dhabi"
      ],
      "image": "assets/photos/aviation/turboprop.webp",
      "photos": 4,
      "saved": false
    },
    {
      "id": "h145",
      "title": "Airbus H145",
      "price": "$7.9M",
      "unit": "asking",
      "description": "2018 · 1,930 hours, 8 seats, five-blade rotor. VIP configuration, Helionix avionics, hoist-ready.",
      "tags": [
        "Helicopter",
        "Jeddah"
      ],
      "image": "assets/photos/aviation/helicopter.webp",
      "photos": 3,
      "saved": false
    }
  ],
  "hangarTiles": [
    {
      "title": "Dubai South",
      "image": "assets/photos/aviation/hangar-large.webp",
      "price": "from $2,400 / mo",
      "duration": "12 hangars",
      "dates": "Heavy jets welcome",
      "badge": "Popular"
    },
    {
      "title": "Riyadh",
      "image": "assets/photos/aviation/hangar-small.webp",
      "price": "from $1,850 / mo",
      "duration": "9 hangars",
      "dates": "Shared and private"
    },
    {
      "title": "Doha",
      "image": "assets/photos/aviation/hangar-exterior.webp",
      "price": "from $3,100 / mo",
      "duration": "4 hangars",
      "dates": "Lounge and crew rest"
    }
  ]
};
