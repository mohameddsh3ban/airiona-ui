// Types and sample data for the Book a flight page. Generated from docs/pages/flight-booking/page.spec.json.
// Sources: airports <- GET /api/airports?query= (searchable, nearest first); offers <- GET /api/charter/offers?from&to&date&passengers; aircraftOptions <- derived from offers; quote <- POST /api/charter/quote { offerId, passengers } (recomputed when the aircraft or passengers change).

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

export interface FlightBookingPageData {
  airports: Airport[];
  offers: Offer[];
  aircraftOptions: AircraftOption[];
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
  "offers": [
    {
      "id": "o-light",
      "aircraft": "Phenom 300E",
      "category": "Light jet",
      "operator": "Skyline Executive",
      "image": "assets/photos/aviation/jet-light.webp",
      "from": {
        "code": "DXB",
        "city": "Dubai",
        "time": "09:30"
      },
      "to": {
        "code": "LTN",
        "city": "London",
        "time": "14:50"
      },
      "duration": "1 stop · ATH · 8 h 20 m",
      "details": [
        {
          "label": "Seats",
          "value": "6"
        },
        {
          "label": "Bags",
          "value": "6"
        },
        {
          "label": "Price",
          "value": "$32,900"
        }
      ]
    },
    {
      "id": "o-mid",
      "aircraft": "Citation Latitude",
      "category": "Midsize jet",
      "operator": "Gulf Air Charter",
      "image": "assets/photos/aviation/jet-midsize.webp",
      "from": {
        "code": "DXB",
        "city": "Dubai",
        "time": "09:30"
      },
      "to": {
        "code": "LTN",
        "city": "London",
        "time": "13:55"
      },
      "duration": "Non-stop · 7 h 25 m",
      "details": [
        {
          "label": "Seats",
          "value": "9"
        },
        {
          "label": "Bags",
          "value": "10"
        },
        {
          "label": "Price",
          "value": "$48,400"
        }
      ]
    },
    {
      "id": "o-heavy",
      "aircraft": "Global 6500",
      "category": "Long-range jet",
      "operator": "Meridian Private",
      "image": "assets/photos/aviation/jet-heavy.webp",
      "from": {
        "code": "DXB",
        "city": "Dubai",
        "time": "09:30"
      },
      "to": {
        "code": "LTN",
        "city": "London",
        "time": "13:40"
      },
      "duration": "Non-stop · 7 h 10 m",
      "details": [
        {
          "label": "Seats",
          "value": "14"
        },
        {
          "label": "Bags",
          "value": "18"
        },
        {
          "label": "Price",
          "value": "$86,500"
        }
      ]
    }
  ],
  "aircraftOptions": [
    {
      "value": "o-light",
      "label": "Phenom 300E · Light jet",
      "description": "1 stop · 8 h 20 m · 6 seats",
      "meta": "$32,900"
    },
    {
      "value": "o-mid",
      "label": "Citation Latitude · Midsize jet",
      "description": "Non-stop · 7 h 25 m · 9 seats",
      "meta": "$48,400"
    },
    {
      "value": "o-heavy",
      "label": "Global 6500 · Long-range jet",
      "description": "Non-stop · 7 h 10 m · 14 seats",
      "meta": "$86,500"
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
