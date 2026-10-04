// Types and sample data for the Stay checkout page. Generated from docs/pages/stay-checkout/page.spec.json.
// Sources: stay <- GET /api/stays/:id/quote?checkIn&checkOut&adults&children; countries <- static list (ISO 3166), most used first.

export type PriceLine = {
  label: string;
  value: string;
};

export type Stay = {
  id: string;
  name: string;
  region: string;
  location: string;
  rating: string;
  image: string;
  nights: number;
  total: string;
  cancellation: string;
  priceLines: PriceLine[];
};

export type Country = {
  value: string;
  label: string;
};

export interface StayCheckoutPageData {
  stay: Stay;
  countries: Country[];
}

export const STAYCHECKOUT_SAMPLE: StayCheckoutPageData = {
  "stay": {
    "id": "nordic-pine-lodge",
    "name": "Nordic Pine Lodge",
    "region": "Bavaria",
    "location": "Nuremberg, Germany",
    "rating": "4.8",
    "image": "assets/photos/forest-cabin.webp",
    "nights": 4,
    "total": "$1,284",
    "cancellation": "Free cancellation until 12 Oct",
    "priceLines": [
      {
        "label": "$296 × 4 nights",
        "value": "$1,184"
      },
      {
        "label": "Cleaning fee",
        "value": "$60"
      },
      {
        "label": "Service fee",
        "value": "$40"
      },
      {
        "label": "Total (USD)",
        "value": "$1,284"
      }
    ]
  },
  "countries": [
    {
      "value": "DE",
      "label": "Germany"
    },
    {
      "value": "AE",
      "label": "United Arab Emirates"
    },
    {
      "value": "GB",
      "label": "United Kingdom"
    },
    {
      "value": "US",
      "label": "United States"
    },
    {
      "value": "FR",
      "label": "France"
    },
    {
      "value": "JP",
      "label": "Japan"
    }
  ]
};
