// Types and sample data for the Home page. Generated from docs/pages/flight-home/page.spec.json.
// Sources: destinations <- GET /api/destinations/featured (six, ranked by bookings this season); marketplaces <- Static: the three Airiona marketplaces with live counts from GET /api/marketplace/summary.

export type Destination = {
  title: string;
  region: string;
  location: string;
  rating: string;
  image: string;
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

export interface FlightHomePageData {
  destinations: Destination[];
  marketplaces: Tile[];
}

export const FLIGHTHOME_SAMPLE: FlightHomePageData = {
  "destinations": [
    {
      "title": "Maldives",
      "region": "Malé",
      "location": "from $18,400",
      "rating": "4.9",
      "image": "assets/photos/destinations/maldives.webp",
      "saved": true
    },
    {
      "title": "Amalfi Coast",
      "region": "Naples",
      "location": "from $9,800",
      "rating": "4.8",
      "image": "assets/photos/destinations/amalfi.webp",
      "saved": false
    },
    {
      "title": "St. Moritz",
      "region": "Samedan",
      "location": "from $11,200",
      "rating": "4.9",
      "image": "assets/photos/destinations/st-moritz.webp",
      "saved": false
    },
    {
      "title": "Kyoto",
      "region": "Osaka Kansai",
      "location": "from $32,600",
      "rating": "4.8",
      "image": "assets/photos/destinations/kyoto.webp",
      "saved": false
    },
    {
      "title": "Marrakech",
      "region": "Menara",
      "location": "from $8,900",
      "rating": "4.7",
      "image": "assets/photos/destinations/marrakech.webp",
      "saved": false
    },
    {
      "title": "Aspen",
      "region": "Aspen–Pitkin",
      "location": "from $41,300",
      "rating": "4.9",
      "image": "assets/photos/destinations/aspen.webp",
      "saved": false
    }
  ],
  "marketplaces": [
    {
      "title": "Aircraft for sale",
      "image": "assets/photos/aviation/jet-midsize.webp",
      "price": "from $2.4M",
      "duration": "1,240 listed",
      "dates": "Jets, turboprops, helicopters",
      "badge": "New"
    },
    {
      "title": "Hangar space",
      "image": "assets/photos/aviation/hangar-large.webp",
      "price": "from $1,850 / mo",
      "duration": "140 airports",
      "dates": "Nightly, monthly or yearly"
    },
    {
      "title": "Empty legs",
      "image": "assets/photos/aviation/promo-jet.webp",
      "price": "up to 40% off",
      "duration": "64 this week",
      "dates": "One-way repositioning flights"
    }
  ]
};
