// `suggest`: rank components for what an element does. `describe`: print one component's card.
import { component, manifest, nearestNames } from './core.mjs';

/** Words people use for page elements, mapped to the components that serve them. */
const SYNONYMS = {
  'date|dates|check-in|checkin|check-out|checkout|departure|return|calendar|stay dates|travel dates|range': ['DatePicker', 'Calendar', 'CalendarCard', 'WeekStrip', 'FieldTile'],
  'guests|travellers|travelers|passengers|adults|children|rooms|count|quantity|bags|seats': ['QuantityStepper', 'FieldTile', 'PeoplePicker'],
  'search|find|look up|query': ['SearchField', 'BookingSearch', 'FlightSearchSheet', 'HeroHeader'],
  'flight search|search flights|from to|origin destination': ['BookingSearch', 'FlightSearchSheet'],
  'filter|filters|refine|category|categories|tags': ['ChipScroller', 'Chip', 'SegmentedControl', 'BottomSheet'],
  'sort|order by|dropdown|choose one|pick one|select|cabin|class|currency|country': ['Select', 'MobileSegmented', 'SegmentedControl', 'ActionSheet'],
  'toggle|on off|setting|preference|notifications': ['Switch', 'ToggleTile', 'Checkbox'],
  'agree|terms|consent|accept|opt in|tick': ['Checkbox', 'Switch'],
  'name|email|phone|address|passport|text|input|field|postcode|zip|city|password|show password|reveal': ['TextField', 'FieldTile'],
  'cta|primary action|book|reserve|pay|checkout button|continue|confirm button|submit': ['Button', 'StickyActionBar', 'BookingBar', 'Fab'],
  'sticky|bottom bar|price bar|total|footer bar': ['StickyActionBar', 'BookingBar'],
  'bottom nav|tab bar|tabs bar|app navigation|navigation bar': ['TabBar', 'SideNav', 'TopNav'],
  'header|top bar|app bar|navbar|back button|title bar': ['AppBar', 'TopNav', 'PageHeader', 'GreetingBar', 'HeroHeader'],
  'hero|banner|welcome|greeting|headline|hero banner': ['HeroHeader', 'GreetingBar', 'PlaceHero', 'RouteHeader', 'ProfileHeader'],
  'tabs|sections|switch view|segments': ['Tabs', 'SegmentedControl', 'MobileSegmented'],
  'listing|property|hotel|stay|room|villa|cabin card|place': ['StayCard', 'PlaceCard', 'DestinationCard', 'MiniDestination', 'PlaceHero'],
  'destination|city|explore|inspiration|deal|offer': ['DestinationCard', 'MiniDestination', 'PlaceCard', 'SnapCarousel'],
  'flight|ticket|flight result|flight results|itinerary|fare': ['FlightTicket', 'TicketCard', 'TripRow', 'RouteHeader', 'BoardingPass'],
  'boarding pass|qr|scan|e-ticket|check in pass': ['BoardingPass', 'QRCode'],
  'carousel|slider|horizontal|horizontally|swipe cards|swipeable': ['SnapCarousel', 'ChipScroller'],
  'row of cards|scrolling row of|scrolling cards|card carousel|cards that scroll': ['SnapCarousel'],
  'row of chips|scrolling chips|chip row': ['ChipScroller'],
  'airport|origin|from airport|to airport|departure airport|arrival airport|destination airport|origin and destination': ['Select', 'FieldTile', 'FlightSearchSheet', 'BookingSearch'],
  'one way|round trip|trip type|multi-city|multi city': ['MobileSegmented', 'SegmentedControl', 'FlightSearchSheet'],
  'list|rows|items|history|upcoming trips': ['TripRow', 'LetterRow', 'ActivityFeed', 'DetailList', 'SwipeRow'],
  'details|facts|summary|price breakdown|receipt|key value': ['DetailList', 'InfoStatRow', 'AmenityList', 'Badge'],
  'amenities|facilities|features': ['AmenityList', 'InfoStatRow'],
  'description|about|long text|read more': ['ExpandableText'],
  'rating|reviews|stars|score': ['Rating', 'RatingBreakdown', 'Leaderboard'],
  'status|label|tag|pill|badge': ['Badge', 'Chip'],
  'progress|steps|stepper|checkout steps|wizard': ['BookingSteps', 'PlanList', 'Timeline'],
  'timeline|schedule|agenda|itinerary day|plan': ['Timeline', 'AgendaCard', 'PlanList', 'WeekStrip'],
  'success|confirmation|done|booked|thank you': ['SuccessBurst', 'Toast', 'Dialog'],
  'error|notice|message|alert|snackbar|toast': ['Toast', 'Dialog', 'IllustrationCallout'],
  'empty|no results|nothing here|illustration|tip|help': ['IllustrationCallout'],
  'loading|placeholder|skeleton|spinner': ['Skeleton'],
  'modal|popup|confirm|dialog|are you sure': ['Dialog', 'BottomSheet', 'ActionSheet'],
  'sheet|drawer|panel from bottom': ['BottomSheet', 'ActionSheet', 'FlightSearchSheet'],
  'menu|more|overflow|kebab|actions list': ['Menu', 'ActionSheet', 'SwipeRow'],
  'tooltip|hint|info icon': ['Tooltip'],
  'avatar|profile|user|account|people|members': ['Avatar', 'AvatarStack', 'ProfileHeader', 'MemberPicker', 'PeoplePicker'],
  'table|records|admin|operator|bookings list|payouts': ['DataTable'],
  'kpi|metric|stat|number|figure|revenue': ['StatCard', 'MetricTile', 'MiniStatCard', 'CountUp'],
  'chart|graph|trend|bars|analytics': ['BalanceChart', 'PillBarChart', 'EfficiencyChart', 'SparkBars', 'ChannelCard', 'SegmentGauge'],
  'onboarding|intro|first run|welcome slides': ['OnboardingFlow'],
  'transition|page change|route animation': ['RouteTransition', 'ScreenStack'],
  'icon|glyph': ['Icon', 'IconButton'],
  'image|photo|picture|photograph': ['PlaceHero', 'StayCard', 'Scene'],
  '3d|art|illustration|3d art': ['HeroHeader', 'PromptCard', 'IllustrationCallout', 'RouteHeader'],
  'section title|section heading|view all|see all': ['SectionHeader'],
  'floating button|add|create|new': ['Fab', 'IconButton', 'Button'],
  'map|route|from to arc': ['RouteHeader', 'HeroHeader'],
  'transfer|taxi|ride|car': ['RideTile', 'TripSummaryTile'],
};

export function suggest(query, limit = 6) {
  const q = query.toLowerCase();
  const STOP = new Set(['and', 'the', 'with', 'for', 'from', 'into', 'that', 'this', 'your', 'our', 'their', 'when', 'where', 'what', 'which', 'shows', 'show', 'user', 'users', 'page', 'button', 'card', 'cards', 'list']);
  const words = q.split(/[^a-z0-9-]+/).filter((w) => w.length > 2 && !STOP.has(w));
  const scores = new Map();
  const add = (name, s, why) => {
    const cur = scores.get(name) || { s: 0, why: new Set() };
    cur.s += s; if (why) cur.why.add(why);
    scores.set(name, cur);
  };
  const isPhrase = (k) => k.includes(' ') || k.includes('-');
  const wordHit = (k) => words.some((w) => w === k || w === `${k}s` || w === `${k}es` || (w.length > 4 && k.startsWith(w)));
  // Phrases the query contains ("destination airport") outrank the single words inside them ("destination"):
  // a word covered by a matched phrase neither triggers its own synonym entry nor the name bonus.
  const phrases = Object.keys(SYNONYMS).flatMap((k) => k.split('|')).filter((k) => isPhrase(k) && q.includes(k));
  const covered = (w) => phrases.some((p) => p.split(/[ -]+/).some((x) => x === w || `${x}s` === w));
  for (const [keys, names] of Object.entries(SYNONYMS)) {
    const hit = keys.split('|').sort((a, b) => b.length - a.length).find((k) => (isPhrase(k) ? q.includes(k) : wordHit(k) && !covered(k)));
    if (hit) names.forEach((n, i) => add(n, 10 - i * 2 + (isPhrase(hit) ? 6 : 0), `"${hit}"`));
  }
  for (const c of manifest().components) {
    const name = c.name.toLowerCase();
    const text = `${c.summary} ${c.notes.join(' ')} ${c.provides}`.toLowerCase();
    for (const w of words) {
      if (w.length >= 4 && name.includes(w) && !covered(w)) add(c.name, 8, `name has "${w}"`);
      else if (text.includes(w)) add(c.name, 1);
    }
  }
  return [...scores.entries()].sort((a, b) => b[1].s - a[1].s).slice(0, limit).map(([name, v]) => {
    const c = component(name);
    return { name, score: Math.round(v.s), why: [...v.why].slice(0, 3), summary: c.summary, selector: c.angular?.selector, formControl: !!c.angular?.formControl, group: c.group };
  });
}

export function describe(name, fw = 'angular') {
  const c = component(name);
  if (!c) return `Unknown component "${name}". Did you mean: ${nearestNames(name).join(', ')}?`;
  const out = [`# ${c.name}  (${c.group})`, '', c.summary, ''];
  if (c.notes.length) out.push('Guidance:', ...c.notes.map((n) => `- ${n}`), '');
  if (fw === 'angular' && c.angular) {
    const a = c.angular;
    out.push(`Angular: ${a.import}`, `Selector: ${a.selector}${a.formControl ? '   (form control: formControlName / ngModel / [(value)])' : ''}`, '', 'Inputs:');
    for (const i of a.inputs) out.push(`  ${i.name}${i.kind === 'model' ? ' (two-way)' : i.kind === 'required' ? ' (required)' : ''}: ${i.type || 'inferred'}${i.default !== undefined ? ` = ${i.default}` : ''}${i.doc ? `  // ${i.doc}` : ''}`);
    if (a.outputs.length) out.push('', 'Outputs:', ...a.outputs.map((o) => `  (${o.name}): ${o.type}${o.doc ? `  // ${o.doc}` : ''}`));
    if (a.slots.length) out.push('', `Slots: ${a.slots.join(', ')}`);
    if (a.helpers.length) out.push('', `Companions: ${a.helpers.map((h) => `${h.className} ${h.selector}`).join('; ')}`);
    out.push('', 'Example:', a.code || '(none)');
  } else {
    out.push(`React: ${c.react.import}`, '', 'Props:');
    for (const p of c.react.props) out.push(`  ${p.name}${p.optional ? '?' : ''}: ${p.type}${p.doc ? `  // ${p.doc}` : ''}`);
    out.push('', 'Example:', c.react.code || '(none)');
  }
  if (c.motion.length) out.push('', 'Motion:', ...c.motion.map((m) => `  ${m.moment}: ${m.behaviour}`));
  return out.join('\n');
}
