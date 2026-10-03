// Types and sample data for the Flight home page. Generated from docs/pages/flight-home/page.spec.json.
// Sources: airports <- GET /api/airports?popular=1 (the 12 most-booked airports; the Select is searchable so the full list can stream in later); deals <- GET /api/promotions?placement=home-deals (first item is the featured deal); airlines <- GET /api/airlines/popular?from=<home airport> (sorted by bookings in the last 30 days, max 8); hotels <- GET /api/stays/featured?city=<home city>&limit=3.

export interface Airport {
  value: string;
  label: string;
  meta: string;
}

export interface Deal {
  code: string;
  title: string;
  text: string;
  tone: 'dark' | 'light';
}

export interface Airline {
  title: string;
  image: string;
  price: string;
  duration: string;
  dates: string;
  badge?: string;
}

export interface Hotel {
  name: string;
  rating: number;
  distance: string;
  image: string;
  saved: boolean;
}

export interface FlightHomePageData {
  airports: Airport[];
  deals: Deal[];
  airlines: Airline[];
  hotels: Hotel[];
}

export const FLIGHTHOME_SAMPLE: FlightHomePageData = {
  "airports": [
    {
      "value": "HND",
      "label": "Tokyo Haneda",
      "meta": "HND"
    },
    {
      "value": "BER",
      "label": "Berlin Brandenburg",
      "meta": "BER"
    },
    {
      "value": "DXB",
      "label": "Dubai International",
      "meta": "DXB"
    },
    {
      "value": "LIS",
      "label": "Lisbon Humberto Delgado",
      "meta": "LIS"
    },
    {
      "value": "IST",
      "label": "Istanbul",
      "meta": "IST"
    },
    {
      "value": "DOH",
      "label": "Doha Hamad",
      "meta": "DOH"
    },
    {
      "value": "JFK",
      "label": "New York JFK",
      "meta": "JFK"
    },
    {
      "value": "LHR",
      "label": "London Heathrow",
      "meta": "LHR"
    }
  ],
  "deals": [
    {
      "code": "DTOUR2026",
      "title": "Luxury travel and airlines",
      "text": "Business-class fares with lounge access on Emirates, Qatar and Turkish, 18% off until 31 Oct.",
      "tone": "dark"
    }
  ],
  "airlines": [
    {
      "title": "Turkish Airlines",
      "image": "assets/photos/jet-clouds.webp",
      "price": "from $412",
      "duration": "to 120+ cities",
      "dates": "Oct – Dec",
      "badge": "Top rated"
    },
    {
      "title": "Emirates",
      "image": "assets/photos/jet-clouds.webp",
      "price": "from $486",
      "duration": "to 98 cities",
      "dates": "Oct – Dec"
    },
    {
      "title": "Qatar Airways",
      "image": "assets/photos/jet-clouds.webp",
      "price": "from $455",
      "duration": "to 104 cities",
      "dates": "Oct – Dec"
    }
  ],
  "hotels": [
    {
      "name": "Moxy NYC Downtown",
      "rating": 4.5,
      "distance": "0.8 km from City Hall",
      "image": "assets/photos/white-hotel.webp",
      "saved": false
    },
    {
      "name": "Hotel Tropical Daisy",
      "rating": 4.7,
      "distance": "1.22 km from City Centre",
      "image": "assets/photos/cliff-villa.webp",
      "saved": true
    },
    {
      "name": "Villa Tropical Daisy",
      "rating": 4.8,
      "distance": "2.4 km from the beach",
      "image": "assets/photos/tokyo-penthouse.webp",
      "saved": false
    }
  ]
};
