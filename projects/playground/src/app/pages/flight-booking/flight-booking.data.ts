// Types and sample data for the Book a flight page. Generated from docs/pages/flight-booking/page.spec.json.
// Sources: airports <- GET /api/airports?query= (searchable, nearest first); aircraftCards <- GET /api/charter/offers?from&to&date&pax (aircraft that can fly the route that day, all-in prices); quote <- POST /api/charter/quote { offerId, passengers } (recomputed when the aircraft or passengers change).

export type Airport = {
  value: string;
  label: string;
  meta: string;
};

export type Endpoint = {
  code: string;
  city: string;
  time: string;
};

export type Fact = {
  label: string;
  value: string;
};

export type Offer = {
  id: string;
  aircraft: string;
  category: string;
  operator: string;
  image: string;
  from: Endpoint;
  to: Endpoint;
  duration: string;
  details: Fact[];
};

export type AircraftOption = {
  value: string;
  label: string;
  description: string;
  meta: string;
};

export type RouteEnd = {
  code: string;
  city: string;
};

export type Quote = {
  from: RouteEnd;
  to: RouteEnd;
  summary: string;
  priceLines: Fact[];
  total: string;
};

export type AircraftCard = {
  value: string;
  title: string;
  meta: string;
  price: string;
  note: string;
  image: string;
  badge?: string;
};

export interface FlightBookingPageData {
  airports: Airport[];
  aircraftCards: AircraftCard[];
  quote: Quote;
}

export const FLIGHTBOOKING_SAMPLE: FlightBookingPageData = {
  "airports": [
    {
      "value": "DXB",
      "label": "Dubai International",
      "meta": "DXB"
    },
    {
      "value": "DWC",
      "label": "Dubai Al Maktoum",
      "meta": "DWC"
    },
    {
      "value": "LTN",
      "label": "London Luton",
      "meta": "LTN"
    },
    {
      "value": "FAB",
      "label": "Farnborough",
      "meta": "FAB"
    },
    {
      "value": "NCE",
      "label": "Nice Côte d'Azur",
      "meta": "NCE"
    },
    {
      "value": "GVA",
      "label": "Geneva",
      "meta": "GVA"
    },
    {
      "value": "RUH",
      "label": "Riyadh King Khalid",
      "meta": "RUH"
    },
    {
      "value": "MLE",
      "label": "Malé Velana",
      "meta": "MLE"
    }
  ],
  "aircraftCards": [
    {
      "value": "o-light",
      "title": "Phenom 300E",
      "meta": "6 seats · 8 h 20 m",
      "price": "$32,900",
      "note": "all-in",
      "image": "assets/photos/aviation/jet-light.webp",
      "badge": "1 stop · ATH"
    },
    {
      "value": "o-mid",
      "title": "Citation Latitude",
      "meta": "9 seats · 7 h 25 m",
      "price": "$48,400",
      "note": "all-in",
      "image": "assets/photos/aviation/jet-midsize.webp",
      "badge": "Best value"
    },
    {
      "value": "o-heavy",
      "title": "Global 6500",
      "meta": "14 seats · 7 h 10 m",
      "price": "$86,500",
      "note": "all-in",
      "image": "assets/photos/aviation/jet-heavy.webp"
    }
  ],
  "quote": {
    "from": {
      "code": "DXB",
      "city": "Dubai"
    },
    "to": {
      "code": "LTN",
      "city": "London"
    },
    "summary": "Thu, 15 Oct · 4 passengers",
    "priceLines": [
      {
        "label": "Flight, Citation Latitude",
        "value": "$44,200"
      },
      {
        "label": "Airport and handling fees",
        "value": "$2,650"
      },
      {
        "label": "Catering for 4",
        "value": "$560"
      },
      {
        "label": "VAT",
        "value": "$990"
      },
      {
        "label": "Total (USD)",
        "value": "$48,400"
      }
    ],
    "total": "$48,400"
  }
};
