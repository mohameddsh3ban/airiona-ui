// Types and sample data for the Operator dashboard page. Generated from docs/pages/operator-dashboard/page.spec.json.
// Sources: kpis <- GET /api/operator/summary?month=2026-10; bookings <- GET /api/operator/bookings?status=all&limit=8.

export type Kpi = {
  label: string;
  value: string;
  icon: string;
  delta: string;
  caption: string;
  tone: 'surface' | 'ink' | 'brand';
};

export type Booking = {
  id: string;
  client: string;
  route: string;
  aircraft: string;
  date: string;
  status: string;
  total: string;
};

export interface OperatorDashboardPageData {
  kpis: Kpi[];
  bookings: Booking[];
}

export const OPERATORDASHBOARD_SAMPLE: OperatorDashboardPageData = {
  "kpis": [
    {
      "label": "Revenue this month",
      "value": "$1.28M",
      "icon": "banknotes",
      "delta": "+18%",
      "caption": "vs September",
      "tone": "ink"
    },
    {
      "label": "Flights flown",
      "value": "46",
      "icon": "paper-airplane",
      "delta": "+6",
      "caption": "vs September",
      "tone": "surface"
    },
    {
      "label": "Open requests",
      "value": "9",
      "icon": "inbox",
      "delta": "+3",
      "caption": "since yesterday",
      "tone": "surface"
    },
    {
      "label": "Hangar occupancy",
      "value": "87%",
      "icon": "building-office-2",
      "delta": "-4%",
      "caption": "vs September",
      "tone": "surface"
    }
  ],
  "bookings": [
    {
      "id": "AR-58213",
      "client": "Omar Saleh",
      "route": "DXB → LTN",
      "aircraft": "Citation Latitude",
      "date": "15 Oct",
      "status": "Awaiting you",
      "total": "$48,400"
    },
    {
      "id": "AR-58190",
      "client": "Layla Haddad",
      "route": "RUH → NCE",
      "aircraft": "Praetor 600",
      "date": "14 Oct",
      "status": "Confirmed",
      "total": "$62,900"
    },
    {
      "id": "AR-58177",
      "client": "Hamad Al-Thani",
      "route": "DOH → GVA",
      "aircraft": "G550",
      "date": "12 Oct",
      "status": "Confirmed",
      "total": "$94,300"
    },
    {
      "id": "AR-58164",
      "client": "Sara Kim",
      "route": "AUH → MLE",
      "aircraft": "Challenger 350",
      "date": "11 Oct",
      "status": "Paid",
      "total": "$41,750"
    },
    {
      "id": "AR-58151",
      "client": "Yusuf Demir",
      "route": "IST → DXB",
      "aircraft": "Citation CJ4",
      "date": "09 Oct",
      "status": "Flown",
      "total": "$28,600"
    },
    {
      "id": "AR-58139",
      "client": "Nadia Farouk",
      "route": "JED → CAI",
      "aircraft": "H145",
      "date": "07 Oct",
      "status": "Flown",
      "total": "$9,800"
    }
  ]
};
