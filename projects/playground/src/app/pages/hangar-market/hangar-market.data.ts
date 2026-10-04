// Types and sample data for the Hangars page. Generated from docs/pages/hangar-market/page.spec.json.
// Sources: hangars <- GET /api/hangars?size&sort&q&near (24 per page); aircraftTiles <- GET /api/featured (three tiles from the other marketplace).

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

export interface HangarMarketPageData {
  hangars: Listing[];
  aircraftTiles: Tile[];
}

export const HANGARMARKET_SAMPLE: HangarMarketPageData = {
  "hangars": [
    {
      "id": "dwc-4",
      "title": "Hangar 4 · Dubai South (DWC)",
      "price": "$2,400",
      "unit": "/ month",
      "description": "38 m door, 11 m clear height, 2,900 m². Climate controlled, fits up to a Global 7500, FBO next door.",
      "tags": [
        "Heavy jets",
        "Climate"
      ],
      "image": "assets/photos/aviation/hangar-large.webp",
      "photos": 5,
      "saved": true
    },
    {
      "id": "ruh-b2",
      "title": "Bay B2 · Riyadh King Khalid (RUH)",
      "price": "$1,850",
      "unit": "/ month",
      "description": "24 m door, 8 m height, shared hangar with 24/7 security and line maintenance on call.",
      "tags": [
        "Midsize jets",
        "Shared"
      ],
      "image": "assets/photos/aviation/hangar-small.webp",
      "photos": 4,
      "saved": false
    },
    {
      "id": "doh-exec",
      "title": "Executive hangar · Doha (DOH)",
      "price": "$3,100",
      "unit": "/ month",
      "description": "Private hangar with lounge and crew rest, 42 m door, de-icing pad and fuel on the apron.",
      "tags": [
        "Heavy jets",
        "Private"
      ],
      "image": "assets/photos/aviation/hangar-exterior.webp",
      "photos": 5,
      "saved": false
    },
    {
      "id": "auh-h1",
      "title": "Heli deck H1 · Abu Dhabi (AUH)",
      "price": "$900",
      "unit": "/ month",
      "description": "Covered helicopter bay, 18 m door, charging for ground power, two minutes from the terminal.",
      "tags": [
        "Helicopters",
        "Covered"
      ],
      "image": "assets/photos/aviation/helicopter.webp",
      "photos": 3,
      "saved": false
    },
    {
      "id": "mct-3",
      "title": "Hangar 3 · Muscat (MCT)",
      "price": "$1,600",
      "unit": "/ month",
      "description": "30 m door, 9 m height, nightly or monthly. Towing and cleaning included in monthly leases.",
      "tags": [
        "Midsize jets",
        "Nightly"
      ],
      "image": "assets/photos/aviation/hangar-large.webp",
      "photos": 4,
      "saved": false
    },
    {
      "id": "bah-fbo",
      "title": "FBO hangar · Bahrain (BAH)",
      "price": "$420",
      "unit": "/ night",
      "description": "Overnight space beside the FBO, 36 m door, crew transport and customs on site.",
      "tags": [
        "Heavy jets",
        "Overnight"
      ],
      "image": "assets/photos/aviation/hangar-exterior.webp",
      "photos": 4,
      "saved": false
    }
  ],
  "aircraftTiles": [
    {
      "title": "Heavy jets",
      "image": "assets/photos/aviation/jet-heavy.webp",
      "price": "from $18M",
      "duration": "41 listed",
      "dates": "G550, Global 6000, Falcon 7X",
      "badge": "New"
    },
    {
      "title": "Light jets",
      "image": "assets/photos/aviation/jet-light.webp",
      "price": "from $3.1M",
      "duration": "64 listed",
      "dates": "CJ4, Phenom 300"
    },
    {
      "title": "Helicopters",
      "image": "assets/photos/aviation/helicopter.webp",
      "price": "from $2.2M",
      "duration": "28 listed",
      "dates": "H145, AW139"
    }
  ]
};
