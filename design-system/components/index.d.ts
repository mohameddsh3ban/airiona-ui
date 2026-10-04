import type * as React from 'react';

/** Every Heroicons v2.2 name (outline and solid share names). */
export type HeroiconName =
  | 'academic-cap' | 'adjustments-horizontal' | 'adjustments-vertical' | 'archive-box' | 'archive-box-arrow-down'
  | 'archive-box-x-mark' | 'arrow-down' | 'arrow-down-circle' | 'arrow-down-left' | 'arrow-down-on-square'
  | 'arrow-down-on-square-stack' | 'arrow-down-right' | 'arrow-down-tray' | 'arrow-left' | 'arrow-left-circle'
  | 'arrow-left-end-on-rectangle' | 'arrow-left-on-rectangle' | 'arrow-left-start-on-rectangle' | 'arrow-long-down'
  | 'arrow-long-left' | 'arrow-long-right' | 'arrow-long-up' | 'arrow-path' | 'arrow-path-rounded-square'
  | 'arrow-right' | 'arrow-right-circle' | 'arrow-right-end-on-rectangle' | 'arrow-right-on-rectangle'
  | 'arrow-right-start-on-rectangle' | 'arrow-small-down' | 'arrow-small-left' | 'arrow-small-right'
  | 'arrow-small-up' | 'arrow-top-right-on-square' | 'arrow-trending-down' | 'arrow-trending-up'
  | 'arrow-turn-down-left' | 'arrow-turn-down-right' | 'arrow-turn-left-down' | 'arrow-turn-left-up'
  | 'arrow-turn-right-down' | 'arrow-turn-right-up' | 'arrow-turn-up-left' | 'arrow-turn-up-right' | 'arrow-up'
  | 'arrow-up-circle' | 'arrow-up-left' | 'arrow-up-on-square' | 'arrow-up-on-square-stack' | 'arrow-up-right'
  | 'arrow-up-tray' | 'arrow-uturn-down' | 'arrow-uturn-left' | 'arrow-uturn-right' | 'arrow-uturn-up'
  | 'arrows-pointing-in' | 'arrows-pointing-out' | 'arrows-right-left' | 'arrows-up-down' | 'at-symbol'
  | 'backspace' | 'backward' | 'banknotes' | 'bars-2' | 'bars-3' | 'bars-3-bottom-left' | 'bars-3-bottom-right'
  | 'bars-3-center-left' | 'bars-4' | 'bars-arrow-down' | 'bars-arrow-up' | 'battery-0' | 'battery-100'
  | 'battery-50' | 'beaker' | 'bell' | 'bell-alert' | 'bell-slash' | 'bell-snooze' | 'bold' | 'bolt' | 'bolt-slash'
  | 'book-open' | 'bookmark' | 'bookmark-slash' | 'bookmark-square' | 'briefcase' | 'bug-ant' | 'building-library'
  | 'building-office' | 'building-office-2' | 'building-storefront' | 'cake' | 'calculator' | 'calendar'
  | 'calendar-date-range' | 'calendar-days' | 'camera' | 'chart-bar' | 'chart-bar-square' | 'chart-pie'
  | 'chat-bubble-bottom-center' | 'chat-bubble-bottom-center-text' | 'chat-bubble-left'
  | 'chat-bubble-left-ellipsis' | 'chat-bubble-left-right' | 'chat-bubble-oval-left'
  | 'chat-bubble-oval-left-ellipsis' | 'check' | 'check-badge' | 'check-circle' | 'chevron-double-down'
  | 'chevron-double-left' | 'chevron-double-right' | 'chevron-double-up' | 'chevron-down' | 'chevron-left'
  | 'chevron-right' | 'chevron-up' | 'chevron-up-down' | 'circle-stack' | 'clipboard' | 'clipboard-document'
  | 'clipboard-document-check' | 'clipboard-document-list' | 'clock' | 'cloud' | 'cloud-arrow-down'
  | 'cloud-arrow-up' | 'code-bracket' | 'code-bracket-square' | 'cog' | 'cog-6-tooth' | 'cog-8-tooth'
  | 'command-line' | 'computer-desktop' | 'cpu-chip' | 'credit-card' | 'cube' | 'cube-transparent'
  | 'currency-bangladeshi' | 'currency-dollar' | 'currency-euro' | 'currency-pound' | 'currency-rupee'
  | 'currency-yen' | 'cursor-arrow-rays' | 'cursor-arrow-ripple' | 'device-phone-mobile' | 'device-tablet'
  | 'divide' | 'document' | 'document-arrow-down' | 'document-arrow-up' | 'document-chart-bar' | 'document-check'
  | 'document-currency-bangladeshi' | 'document-currency-dollar' | 'document-currency-euro'
  | 'document-currency-pound' | 'document-currency-rupee' | 'document-currency-yen' | 'document-duplicate'
  | 'document-magnifying-glass' | 'document-minus' | 'document-plus' | 'document-text' | 'ellipsis-horizontal'
  | 'ellipsis-horizontal-circle' | 'ellipsis-vertical' | 'envelope' | 'envelope-open' | 'equals'
  | 'exclamation-circle' | 'exclamation-triangle' | 'eye' | 'eye-dropper' | 'eye-slash' | 'face-frown'
  | 'face-smile' | 'film' | 'finger-print' | 'fire' | 'flag' | 'folder' | 'folder-arrow-down' | 'folder-minus'
  | 'folder-open' | 'folder-plus' | 'forward' | 'funnel' | 'gif' | 'gift' | 'gift-top' | 'globe-alt'
  | 'globe-americas' | 'globe-asia-australia' | 'globe-europe-africa' | 'h1' | 'h2' | 'h3' | 'hand-raised'
  | 'hand-thumb-down' | 'hand-thumb-up' | 'hashtag' | 'heart' | 'home' | 'home-modern' | 'identification' | 'inbox'
  | 'inbox-arrow-down' | 'inbox-stack' | 'information-circle' | 'italic' | 'key' | 'language' | 'lifebuoy'
  | 'light-bulb' | 'link' | 'link-slash' | 'list-bullet' | 'lock-closed' | 'lock-open' | 'magnifying-glass'
  | 'magnifying-glass-circle' | 'magnifying-glass-minus' | 'magnifying-glass-plus' | 'map' | 'map-pin'
  | 'megaphone' | 'microphone' | 'minus' | 'minus-circle' | 'minus-small' | 'moon' | 'musical-note' | 'newspaper'
  | 'no-symbol' | 'numbered-list' | 'paint-brush' | 'paper-airplane' | 'paper-clip' | 'pause' | 'pause-circle'
  | 'pencil' | 'pencil-square' | 'percent-badge' | 'phone' | 'phone-arrow-down-left' | 'phone-arrow-up-right'
  | 'phone-x-mark' | 'photo' | 'play' | 'play-circle' | 'play-pause' | 'plus' | 'plus-circle' | 'plus-small'
  | 'power' | 'presentation-chart-bar' | 'presentation-chart-line' | 'printer' | 'puzzle-piece' | 'qr-code'
  | 'question-mark-circle' | 'queue-list' | 'radio' | 'receipt-percent' | 'receipt-refund' | 'rectangle-group'
  | 'rectangle-stack' | 'rocket-launch' | 'rss' | 'scale' | 'scissors' | 'server' | 'server-stack' | 'share'
  | 'shield-check' | 'shield-exclamation' | 'shopping-bag' | 'shopping-cart' | 'signal' | 'signal-slash' | 'slash'
  | 'sparkles' | 'speaker-wave' | 'speaker-x-mark' | 'square-2-stack' | 'square-3-stack-3d' | 'squares-2x2'
  | 'squares-plus' | 'star' | 'stop' | 'stop-circle' | 'strikethrough' | 'sun' | 'swatch' | 'table-cells' | 'tag'
  | 'ticket' | 'trash' | 'trophy' | 'truck' | 'tv' | 'underline' | 'user' | 'user-circle' | 'user-group'
  | 'user-minus' | 'user-plus' | 'users' | 'variable' | 'video-camera' | 'video-camera-slash' | 'view-columns'
  | 'viewfinder-circle' | 'wallet' | 'wifi' | 'window' | 'wrench' | 'wrench-screwdriver' | 'x-circle' | 'x-mark';

/** Travel glyphs Heroicons does not have, drawn on the same grid. */
export type AirionaIconName = 'plane' | 'bed' | 'bath' | 'utensils' | 'car';

/** v1.0 short names, still accepted. Prefer the Heroicons name. */
export type LegacyIconName = 'search' | 'swap' | 'x' | 'sliders' | 'eye-off' | 'grid' | 'hotel' | 'chart' | 'card' | 'info' | 'alert' | 'settings' | 'menu' | 'more' | 'luggage';

export type IconName = HeroiconName | AirionaIconName | LegacyIconName;

export type SceneVariant = 'sky' | 'alpine' | 'coast' | 'dusk' | 'forest';

/** Heroicons v2.2: 24px outline at 1.5 stroke, or solid. */
export interface IconProps { name: IconName; variant?: 'outline' | 'solid'; size?: number; strokeWidth?: number; /** Same as variant="solid". */ filled?: boolean; label?: string; className?: string; style?: React.CSSProperties }
export declare function Icon(props: IconProps): React.ReactElement;

/** Drawn landscape that stands in for photography. */
export interface SceneProps { variant?: SceneVariant; label?: string; className?: string }
export declare function Scene(props: SceneProps): React.ReactElement;

export interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'brand' | 'secondary' | 'soft' | 'ghost' | 'glass' | 'white' | 'danger';
  size?: 'sm' | 'md' | 'lg';
  iconStart?: IconName; iconEnd?: IconName;
  /** true = arrow-up-right disc; or name another icon for the disc. */
  arrow?: boolean | IconName;
  loading?: boolean; block?: boolean; href?: string; as?: React.ElementType;
}
export declare function Button(props: ButtonProps): React.ReactElement;

export interface IconButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  icon: IconName; label: string;
  variant?: 'surface' | 'soft' | 'outline' | 'ink' | 'brand' | 'glass' | 'white' | 'ghost';
  size?: 'sm' | 'md' | 'lg'; badge?: boolean;
}
export declare function IconButton(props: IconButtonProps): React.ReactElement;

export interface SegmentOption { value: string; label: React.ReactNode; icon?: IconName; count?: number }
export interface SegmentedControlProps {
  options: Array<string | SegmentOption>; value?: string; defaultValue?: string; onChange?: (value: string) => void;
  tone?: 'ink' | 'brand' | 'surface'; variant?: 'track' | 'pills'; size?: 'sm' | 'md' | 'lg'; label?: string; className?: string;
}
export declare function SegmentedControl(props: SegmentedControlProps): React.ReactElement;

export interface ChipProps { children: React.ReactNode; selected?: boolean; defaultSelected?: boolean; onChange?: (selected: boolean) => void; icon?: IconName; count?: number; className?: string }
export declare function Chip(props: ChipProps): React.ReactElement;

export interface TextFieldProps extends Omit<React.InputHTMLAttributes<HTMLInputElement>, 'size'> {
  label: string; hint?: string; error?: string; iconStart?: IconName; variant?: 'outline' | 'sunken';
}
export declare function TextField(props: TextFieldProps): React.ReactElement;

export interface CheckboxProps extends React.InputHTMLAttributes<HTMLInputElement> { label: React.ReactNode }
export declare function Checkbox(props: CheckboxProps): React.ReactElement;

export interface SwitchProps extends React.InputHTMLAttributes<HTMLInputElement> { label: React.ReactNode; description?: React.ReactNode }
export declare function Switch(props: SwitchProps): React.ReactElement;

export interface QuantityStepperProps { label: string; description?: string; value?: number; defaultValue?: number; onChange?: (value: number) => void; min?: number; max?: number; className?: string }
export declare function QuantityStepper(props: QuantityStepperProps): React.ReactElement;

export interface CalendarProps {
  year?: number; /** 0–11 */ month?: number;
  range?: [number | null, number | null]; defaultRange?: [number | null, number | null]; onRangeChange?: (range: [number | null, number | null]) => void;
  unavailable?: number[]; prices?: Record<number, string>; lowPrices?: number[]; today?: number; legend?: boolean; className?: string;
}
export declare function Calendar(props: CalendarProps): React.ReactElement;

export interface Place { city: string; code: string }
export interface BookingSearchProps {
  from?: Place; to?: Place; trip?: 'one' | 'round' | 'multi'; depart?: string; ret?: string; travellers?: string;
  activeField?: 'from' | 'to' | 'dep' | 'ret' | 'pax'; extra?: React.ReactNode;
  onSearch?: (query: { from: Place; to: Place; trip: string }) => void; className?: string;
}
export declare function BookingSearch(props: BookingSearchProps): React.ReactElement;

export interface BadgeProps { children: React.ReactNode; tone?: 'neutral' | 'brand' | 'success' | 'warning' | 'danger' | 'ink' | 'glass' | 'outline'; dot?: boolean; icon?: IconName; size?: 'sm' | 'md'; className?: string }
export declare function Badge(props: BadgeProps): React.ReactElement;

export interface RatingProps { value: number; count?: string; size?: number; compact?: boolean; className?: string }
export declare function Rating(props: RatingProps): React.ReactElement;

export interface ToastProps { title: React.ReactNode; children?: React.ReactNode; tone?: 'info' | 'success' | 'warning' | 'danger'; icon?: IconName; time?: string; action?: string; onAction?: () => void; onClose?: () => void; className?: string; /** ms; shows a timer bar and calls onClose when it ends. Hover pauses it. */ duration?: number }
export declare function Toast(props: ToastProps): React.ReactElement;

export interface BookingStepsProps { steps?: string[]; /** 0-based */ current?: number; className?: string }
export declare function BookingSteps(props: BookingStepsProps): React.ReactElement;

export interface AvatarProps { name: string; src?: string; size?: 'xs' | 'sm' | 'md' | 'lg'; className?: string }
export declare function Avatar(props: AvatarProps): React.ReactElement;

export interface AvatarStackProps { people: Array<string | { name: string; src?: string }>; max?: number; extra?: number; caption?: React.ReactNode; size?: 'xs' | 'sm' | 'md' | 'lg'; className?: string }
export declare function AvatarStack(props: AvatarStackProps): React.ReactElement;

export interface Endpoint { code: string; city: string; time: string }
export interface FlightTicketProps {
  from: Endpoint; to: Endpoint; flight: string; duration: string;
  airline?: string; cabin?: string; details?: Array<{ label: string; value: React.ReactNode }>;
  image?: string; scene?: SceneVariant; hideMedia?: boolean; className?: string;
}
export declare function FlightTicket(props: FlightTicketProps): React.ReactElement;

export interface StayCardProps {
  title: string; price: string; unit?: string; description?: string; tags?: string[];
  image?: string; scene?: SceneVariant; /** Dark colour the photo fades into; white text must reach 4.5:1 on it. */ tint?: string;
  photos?: number; saved?: boolean; cta?: string; onReserve?: () => void; className?: string;
}
export declare function StayCard(props: StayCardProps): React.ReactElement;

export interface DestinationCardProps { title: string; rating?: number; meta?: React.ReactNode; image?: string; scene?: SceneVariant; saved?: boolean; cta?: string; onBook?: () => void; className?: string }
export declare function DestinationCard(props: DestinationCardProps): React.ReactElement;

export interface BookingBarProps { price: string; unit?: string; was?: string; dates?: React.ReactNode; cta?: string; ctaVariant?: ButtonProps['variant']; arrow?: ButtonProps['arrow']; floating?: boolean; onAction?: () => void; className?: string }
export declare function BookingBar(props: BookingBarProps): React.ReactElement;

export interface AmenityListProps { items: Array<{ icon: IconName; label: string }>; plain?: boolean; className?: string }
export declare function AmenityList(props: AmenityListProps): React.ReactElement;

export interface StatBars { values: number[]; highlight?: number; flag?: string; axis?: string[]; inkIndex?: number; label?: string }
export interface StatCardProps { label: string; value: React.ReactNode; icon?: IconName; delta?: string; caption?: React.ReactNode; tone?: 'surface' | 'ink' | 'brand'; onOpen?: () => void; bars?: StatBars; className?: string }
export declare function StatCard(props: StatCardProps): React.ReactElement;

export interface NavItem { value: string; label: string; icon: IconName; count?: number }
export interface SideNavProps { sections: Array<{ title?: string; items: NavItem[] }>; value?: string; defaultValue?: string; onChange?: (value: string) => void; label?: string; className?: string }
export declare function SideNav(props: SideNavProps): React.ReactElement;

export interface TopNavProps {
  /** underline = the pilot dashboard header: icon links with an ink underline. */ variant?: 'pill' | 'underline';
  links: Array<{ value: string; label: string; icon?: IconName }>; value?: string; defaultValue?: string; onChange?: (value: string) => void;
  user?: { name: string; email?: string; avatar?: string }; actions?: React.ReactNode; brand?: React.ReactNode; className?: string;
}
export declare function TopNav(props: TopNavProps): React.ReactElement;

export interface DialogProps {
  title: React.ReactNode;
  /** Defaults to true. Set false to unmount. */ open?: boolean;
  onClose?: () => void;
  description?: React.ReactNode;
  /** Body content, e.g. a refund breakdown in .ar-plate. */ children?: React.ReactNode;
  /** Buttons, primary last. */ footer?: React.ReactNode;
  tone?: 'default' | 'danger' | 'success' | 'brand';
  /** Icon in the header disc; false hides it. */ icon?: IconName | false;
  size?: 'sm' | 'md' | 'lg';
  /** A Scene or image shown above the header. */ media?: React.ReactNode;
  /** Escape and scrim click close it. Default true. */ dismissible?: boolean;
  /** Render in place without portal, scroll lock or focus trap (docs and previews). */ inline?: boolean;
  id?: string; className?: string;
}
export declare function Dialog(props: DialogProps): React.ReactElement | null;

export interface SelectOption { value: string; label: React.ReactNode; description?: string; icon?: IconName; meta?: string; disabled?: boolean }
export interface SelectProps {
  options: Array<string | SelectOption>;
  value?: string | null; defaultValue?: string | null; onChange?: (value: string) => void;
  label?: string; placeholder?: string; hint?: string; error?: string;
  /** Adds a filter field at the top of the list. */ searchable?: boolean; searchPlaceholder?: string; emptyText?: string;
  variant?: 'outline' | 'sunken';
  /** md = 52px field, sm = 40px pill for toolbars. */ size?: 'md' | 'sm';
  /** Opens right-aligned to the trigger. */ align?: 'start' | 'end';
  iconStart?: IconName; hideMeta?: boolean; disabled?: boolean; defaultOpen?: boolean; id?: string; className?: string;
}
export declare function Select(props: SelectProps): React.ReactElement;

export type MenuItem =
  | { label: string; icon?: IconName; onSelect?: () => void; tone?: 'default' | 'danger'; shortcut?: string; disabled?: boolean }
  | { divider: true };
export interface MenuProps {
  items: MenuItem[];
  /** Element that opens the menu. Defaults to a ghost "more" IconButton. */ trigger?: React.ReactElement;
  /** Accessible name for the menu and the default trigger. */ label?: string;
  heading?: string; align?: 'start' | 'end'; defaultOpen?: boolean; id?: string; className?: string;
}
export declare function Menu(props: MenuProps): React.ReactElement;

export interface DataTableColumn<Row = any> {
  key: string; header: React.ReactNode;
  render?: (row: Row) => React.ReactNode; accessor?: (row: Row) => unknown;
  sortable?: boolean; sortValue?: (row: Row) => string | number; defaultDir?: 'asc' | 'desc';
  /** Text the search box matches against. Defaults to the raw value. */ searchValue?: (row: Row) => string;
  align?: 'left' | 'right' | 'center'; width?: number | string;
  mono?: boolean; numeric?: boolean; muted?: boolean;
}
export interface DataTableProps<Row = any> {
  columns: DataTableColumn<Row>[]; rows: Row[];
  /** Field that identifies a row. Default "id". */ rowKey?: string;
  title?: string; caption?: string;
  searchable?: boolean; searchPlaceholder?: string;
  /** Toolbar nodes on the right: selects, buttons. */ actions?: React.ReactNode;
  /** Chip row in the toolbar. */ filters?: React.ReactNode;
  selectable?: boolean; selected?: Array<string | number>; onSelectionChange?: (keys: Array<string | number>) => void;
  /** Rendered in the ink bulk bar while rows are selected. */ bulkActions?: (keys: Array<string | number>) => React.ReactNode;
  pageSize?: number; defaultSort?: { key: string; dir: 'asc' | 'desc' };
  onRowClick?: (row: Row) => void; density?: 'comfortable' | 'compact';
  emptyTitle?: string; emptyText?: string; className?: string;
}
export declare function DataTable<Row = any>(props: DataTableProps<Row>): React.ReactElement;

export interface TabItem { value: string; label: React.ReactNode; icon?: IconName; count?: number; disabled?: boolean; content?: React.ReactNode }
export interface TabsProps {
  tabs: TabItem[];
  value?: string; defaultValue?: string; onChange?: (value: string) => void;
  /** Accessible name of the tab list. */ label?: string;
  /** line = hairline + sliding blue bar; card = folder tabs opening into a white panel. */ variant?: 'line' | 'card';
  size?: 'md' | 'sm';
  /** Tabs share the full width. */ fitted?: boolean;
  /** Node at the right end of the tab bar. */ extra?: React.ReactNode;
  id?: string; className?: string;
}
export declare function Tabs(props: TabsProps): React.ReactElement;

export interface TooltipProps {
  /** One short sentence. */ content: React.ReactNode;
  /** Exactly one focusable element. */ children: React.ReactElement;
  title?: string; shortcut?: string;
  /** Flips to the opposite side when there is no room. */ placement?: 'top' | 'bottom' | 'left' | 'right';
  tone?: 'ink' | 'light';
  /** Hover delay in ms. Default 350; focus shows immediately. */ delay?: number;
  open?: boolean; defaultOpen?: boolean; id?: string; className?: string;
}
export declare function Tooltip(props: TooltipProps): React.ReactElement;

/** An ISO calendar date, "2026-10-15". */
export type ISODate = string;
export interface DatePickerPreset { label: string; value: ISODate | [ISODate, ISODate] }
export interface DatePickerProps {
  mode?: 'single' | 'range';
  /** single: ISODate or null. range: [start, end]. */ value?: ISODate | null | [ISODate | null, ISODate | null];
  defaultValue?: ISODate | null | [ISODate | null, ISODate | null];
  onChange?: (value: any) => void;
  label?: string; placeholder?: string; hint?: string; error?: string;
  /** tiles = Check-in and Check-out tiles (range only). */ variant?: 'field' | 'tiles' | 'sunken';
  min?: ISODate; max?: ISODate;
  /** Booked-out days, hatched and not selectable. */ unavailable?: ISODate[];
  isDateDisabled?: (iso: ISODate) => boolean;
  /** Price under each day, e.g. { "2026-10-15": "$156" }. */ prices?: Record<ISODate, string>;
  lowPrices?: ISODate[];
  presets?: DatePickerPreset[];
  /** 1 or 2. Range defaults to 2; phones always show 1. */ months?: 1 | 2;
  startLabel?: string; endLabel?: string;
  /** Word after the count in the summary. Default night or nights. */ unit?: string;
  maxNights?: number;
  /** Count both ends: 28 Sep to 4 Oct is 7 days. Use with unit="days"; leave off for nights. */ inclusive?: boolean;
  /** Treat this ISO date as today (tests, demos). */ today?: ISODate;
  align?: 'start' | 'end'; disabled?: boolean; defaultOpen?: boolean; id?: string; className?: string;
}
export declare function DatePicker(props: DatePickerProps): React.ReactElement;

/* ---------- v1.3: analytics, widgets, workspace, pilot dashboard ---------- */
/** A colour token name used as a tone, e.g. "blue-500", "success", "action". */
export type ToneToken = string;
export interface WidgetBaseProps { /** light (white), dark (midnight), brand (Ion Blue), sky, sunken. */ tone?: 'light' | 'dark' | 'brand' | 'sky' | 'sunken'; className?: string; style?: React.CSSProperties }

export interface RingProps { /** 0–1 */ value: number; size?: number; stroke?: number; children?: React.ReactNode; ariaLabel?: string; className?: string }
export declare function Ring(props: RingProps): React.ReactElement;

export interface MetricTileProps extends WidgetBaseProps {
  label: string; value: React.ReactNode; caption?: string; icon?: IconName;
  /** Starts with + or -. Ignored when split is given. */ delta?: string;
  /** Up to two side figures, e.g. Confirmed / Pending. */ split?: Array<{ value: React.ReactNode; label: string; tone?: ToneToken }>;
}
export declare function MetricTile(props: MetricTileProps): React.ReactElement;

export interface PillBarChartProps extends WidgetBaseProps {
  data: Array<{ label: string; value: number }>; eyebrow?: string; title?: string;
  /** Word after the tooltip value. */ unit?: string; highlight?: number; max?: number;
  /** Shows the chevron button. Pass null for a button without a handler. */ onOpen?: (() => void) | null;
}
export declare function PillBarChart(props: PillBarChartProps): React.ReactElement;

export interface SegmentGaugeProps extends WidgetBaseProps {
  segments: Array<{ label: string; value: number; display?: string; tone?: ToneToken }>;
  total: React.ReactNode; totalLabel?: string; eyebrow?: string; title?: string; onOpen?: (() => void) | null;
}
export declare function SegmentGauge(props: SegmentGaugeProps): React.ReactElement;

export interface RatingBreakdownProps extends WidgetBaseProps {
  score: React.ReactNode; scoreLabel?: string; segments: Array<{ label: string; value: number; tone?: ToneToken }>;
  note?: React.ReactNode; eyebrow?: string; title?: string; onOpen?: (() => void) | null;
}
export declare function RatingBreakdown(props: RatingBreakdownProps): React.ReactElement;

export interface LeaderboardItem { name: string; role: string; /** Text-safe token: blue-600, blue-700, success, warning. */ roleTone?: ToneToken; score: React.ReactNode; label: string; avatar?: string; ring?: ToneToken }
export interface LeaderboardProps extends WidgetBaseProps { items: LeaderboardItem[]; eyebrow?: string; title?: string; onOpen?: (() => void) | null }
export declare function Leaderboard(props: LeaderboardProps): React.ReactElement;

export interface StripeGroup { label: string; count: React.ReactNode; /** Number of stripes for this group. */ bars: number; tone?: ToneToken }
export interface StripeDistributionProps { groups: StripeGroup[]; unit?: string; className?: string }
export declare function StripeDistribution(props: StripeDistributionProps): React.ReactElement;

export interface HeatmapProps {
  rows: string[]; cols: string[];
  /** Matrix of levels 0–4: surface-sunken, blue-200, blue-400, blue-600, blue-900. */ values: number[][];
  /** [row, col] drawn in ink. */ highlight?: [number, number]; label?: string; className?: string;
}
export declare function Heatmap(props: HeatmapProps): React.ReactElement;

export interface AbsenceCardProps extends WidgetBaseProps {
  eyebrow?: string; title: string; info?: React.ReactNode; groups: StripeGroup[]; unit?: string;
  heatRows: string[]; heatCols: string[]; heat: number[][]; heatHighlight?: [number, number]; heatLabel?: string;
}
export declare function AbsenceCard(props: AbsenceCardProps): React.ReactElement;

export interface ToggleTileProps extends WidgetBaseProps { title: string; status: string; offStatus?: string; icon?: IconName; checked?: boolean; defaultChecked?: boolean; onChange?: (checked: boolean) => void; onOpen?: () => void }
export declare function ToggleTile(props: ToggleTileProps): React.ReactElement;

export interface ArrivalTileProps extends WidgetBaseProps { eta: string; from: { code: string; city: string; time: string }; to: { code: string; city: string; time: string }; /** 0–1 */ progress?: number; eyebrow?: string }
export declare function ArrivalTile(props: ArrivalTileProps): React.ReactElement;

export interface RingStatCardProps extends WidgetBaseProps {
  value: React.ReactNode; unit?: string; /** Leading icon, e.g. arrow-turn-left-up for navigation. */ icon?: IconName;
  ring?: { value: number; label: string; unit?: string }; stats: Array<{ label: string; value: React.ReactNode }>;
}
export declare function RingStatCard(props: RingStatCardProps): React.ReactElement;

export interface HabitTileProps extends WidgetBaseProps { title: string; caption: string; /** 0–1 */ progress: number; icon?: IconName; eyebrow?: string }
export declare function HabitTile(props: HabitTileProps): React.ReactElement;

export interface GateTileProps extends WidgetBaseProps { code: string; title: string; caption?: string }
export declare function GateTile(props: GateTileProps): React.ReactElement;

export interface VoiceRecorderProps extends WidgetBaseProps { title: string; date?: string; time: string; waveform?: number[]; /** 0–1 */ position?: number; playing?: boolean }
export declare function VoiceRecorder(props: VoiceRecorderProps): React.ReactElement;

export interface BatteryTileProps extends WidgetBaseProps { percent: number; caption?: string; cells?: number; label?: string }
export declare function BatteryTile(props: BatteryTileProps): React.ReactElement;

export interface MediaPlayerProps extends WidgetBaseProps { title: string; artist?: string; art?: React.ReactNode; scene?: SceneVariant; elapsed?: string; remaining?: string; /** 0–1 */ progress?: number; playing?: boolean }
export declare function MediaPlayer(props: MediaPlayerProps): React.ReactElement;

export interface AnalogClockProps extends WidgetBaseProps { /** "HH:MM:SS" for a static clock; omit for live. */ time?: string; live?: boolean }
export declare function AnalogClock(props: AnalogClockProps): React.ReactElement;

export interface RecordingTileProps extends WidgetBaseProps { title: string; status?: string; elapsed?: string; icon?: IconName; recording?: boolean }
export declare function RecordingTile(props: RecordingTileProps): React.ReactElement;

export interface ActivityCalendarProps extends WidgetBaseProps { year?: number; /** 0–11 */ month?: number; days?: Record<number, 'goal' | 'partial' | 'today'>; title?: string; legend?: boolean; showMonthTag?: boolean }
export declare function ActivityCalendar(props: ActivityCalendarProps): React.ReactElement;

export interface WorldClockProps extends WidgetBaseProps { city: string; zone?: string; period?: string; time: string; /** With sign, e.g. "+4H". */ diff?: string; /** 0–1 */ dayProgress?: number }
export declare function WorldClock(props: WorldClockProps): React.ReactElement;

export interface RideTileProps extends WidgetBaseProps { provider: string; eta: React.ReactNode; etaUnit?: string; title: string; vehicle?: string; plate?: string; art?: React.ReactNode; /** 3D art URL (Art group: car-3d). */ image?: string }
export declare function RideTile(props: RideTileProps): React.ReactElement;

export interface ChargingTileProps extends WidgetBaseProps { percent: number; timeLeft: string; status?: string }
export declare function ChargingTile(props: ChargingTileProps): React.ReactElement;

export interface TripSummaryTileProps extends WidgetBaseProps { title: string; date?: string; stats: Array<{ label: string; value: React.ReactNode; unit?: string }>; art?: React.ReactNode; /** 3D art URL (Art group: scooter-3d). */ image?: string; badgeIcon?: IconName }
export declare function TripSummaryTile(props: TripSummaryTileProps): React.ReactElement;

export interface NotchProps { corner?: 'tr' | 'tl'; /** Colour behind the card; default var(--canvas). */ bg?: string; children?: React.ReactNode }
export declare function Notch(props: NotchProps): React.ReactElement;

export interface ProfileProjectCardProps extends WidgetBaseProps {
  person: { name: string; role?: string; avatar?: string }; project: string; metaLabel?: string; meta?: string;
  /** 0–1 */ progress?: number; progressLabel?: string; reports?: SelectProps['options']; reportPlaceholder?: string;
  onSend?: () => void; sendLabel?: string; unread?: boolean; notchBg?: string;
}
export declare function ProfileProjectCard(props: ProfileProjectCardProps): React.ReactElement;

export interface MeetingsStripProps extends WidgetBaseProps {
  title?: string; summary?: string; days: Array<{ date: string; weekday: string; count?: number }>;
  value?: string; defaultValue?: string; onChange?: (date: string) => void; month?: string; months?: SelectProps['options'];
}
export declare function MeetingsStrip(props: MeetingsStripProps): React.ReactElement;

export interface GanttTask { label: string; /** Day units from 0; halves allowed. */ start: number; end: number; /** 0–1 */ progress?: number; tone?: 'done' | 'muted' | 'brand'; people?: string[] }
export interface RoadmapGanttProps extends WidgetBaseProps { title?: string; days: string[]; today?: number; tasks: GanttTask[]; onAdd?: () => void; addLabel?: string }
export declare function RoadmapGantt(props: RoadmapGanttProps): React.ReactElement;

export interface DateChipProps { day: React.ReactNode; weekday: string; month: string; className?: string }
export declare function DateChip(props: DateChipProps): React.ReactElement;

export interface EfficiencyChartProps extends WidgetBaseProps { title?: string; period?: string; delta?: string; data?: number[]; highlight?: number }
export declare function EfficiencyChart(props: EfficiencyChartProps): React.ReactElement;

export interface TotalTimeTileProps extends WidgetBaseProps { icon?: IconName; label: string; value: React.ReactNode; unit?: string }
export declare function TotalTimeTile(props: TotalTimeTileProps): React.ReactElement;

export interface AssistantCardProps extends WidgetBaseProps { onOpen?: () => void; openLabel?: string; art?: React.ReactNode; /** 3D art URL (Art group: ai-orb). */ image?: string; lines?: React.ReactNode; /** @deprecated The notch is cut from the card shape now. */ notchBg?: string }
export declare function AssistantCard(props: AssistantCardProps): React.ReactElement;

export interface PageHeaderProps { title: string; tabs?: SegmentedControlProps['options']; tab?: string; defaultTab?: string; onTab?: (value: string) => void; actions?: React.ReactNode; className?: string }
export declare function PageHeader(props: PageHeaderProps): React.ReactElement;

export interface ChannelChart {
  type: 'line' | 'bars' | 'meter' | 'step';
  data?: number[]; /** Index of the marked point (line, step). */ marker?: number; /** Index of the highlighted bar (bars). */ highlight?: number;
  /** 0–1 fill (meter). */ value?: number; label?: string; date?: string;
}
export interface ChannelCardProps extends WidgetBaseProps { name: string; icon?: IconName; amount: React.ReactNode; delta?: string; updated?: string; chart: ChannelChart }
export declare function ChannelCard(props: ChannelCardProps): React.ReactElement;

export interface PromptCardProps extends WidgetBaseProps { question: string; sources?: Array<{ icon: IconName; label: string }>; onAsk?: () => void; eyebrow?: string; cta?: string; art?: React.ReactNode; /** 3D art URL (Art group: ai-orb). */ image?: string }
export declare function PromptCard(props: PromptCardProps): React.ReactElement;

export interface BalanceChartProps extends WidgetBaseProps {
  label?: string; value: React.ReactNode; bars: number[]; max?: number; yLabels?: string[];
  /** [fromIndex, toIndex] of the highlighted range. */ selection?: [number, number]; tooltip?: { value: string; date: string };
  ranges?: string[]; range?: string; defaultRange?: string; onRange?: (range: string) => void;
}
export declare function BalanceChart(props: BalanceChartProps): React.ReactElement;

export interface HoldingItem { name: string; sub?: string; symbol?: string; icon?: IconName; tone?: 'sky' | 'brand'; value?: React.ReactNode; spark?: number[]; change?: string }
export interface HoldingsPanelProps extends WidgetBaseProps { title?: string; linkLabel?: string; href?: string; onLink?: (e: React.MouseEvent) => void; groups: Array<{ title: string; items: HoldingItem[] }> }
export declare function HoldingsPanel(props: HoldingsPanelProps): React.ReactElement;

export interface SparkBarsProps { values: number[] }
export declare function SparkBars(props: SparkBarsProps): React.ReactElement;

export interface PilotDashboardProps { nav?: Array<{ value: string; label: string; icon?: IconName }>; channels?: ChannelCardProps[]; /** 3D art for the prompt card. */ promptImage?: string; className?: string }
export declare function PilotDashboard(props: PilotDashboardProps): React.ReactElement;

/* ---------- v1.4: mobile native kit ---------- */
export interface PhoneFrameProps { children?: React.ReactNode; /** Status bar text colour: dark on light screens, light on dark headers. */ statusTone?: 'dark' | 'light'; statusBar?: boolean; dark?: boolean; homeTone?: 'dark' | 'light'; width?: number; height?: number; className?: string }
export declare function PhoneFrame(props: PhoneFrameProps): React.ReactElement;

export interface StatusBarProps { tone?: 'dark' | 'light'; time?: string }
export declare function StatusBar(props: StatusBarProps): React.ReactElement;

export interface AppBarProps {
  title: React.ReactNode; /** Large-title layout for a tab's root screen. */ large?: boolean;
  /** Shows the back button; pass null for one without a handler. */ onBack?: (() => void) | null; backLabel?: string;
  actions?: React.ReactNode; eyebrow?: string; subtitle?: React.ReactNode; /** Blue square after the large title. */ accent?: boolean; titleSuffix?: string;
  tone?: 'light' | 'dark'; className?: string;
  /** Large title heading level: 1 (default) on a tab's root screen, 2 when the page has its own h1. */ headingLevel?: 1 | 2;
}
export declare function AppBar(props: AppBarProps): React.ReactElement;

export interface TabBarItem { value: string; label: string; icon: IconName; badge?: boolean }
export interface TabBarProps {
  items: TabBarItem[]; value?: string; defaultValue?: string; onChange?: (value: string) => void;
  /** dot = solid icon + blue dot; fab = centre create button; pill = floating midnight capsule; labels = icons with labels. */ variant?: 'dot' | 'fab' | 'pill' | 'labels';
  onFab?: () => void; fabIcon?: IconName; fabLabel?: string; label?: string; className?: string;
}
export declare function TabBar(props: TabBarProps): React.ReactElement;

export interface BottomSheetProps {
  open?: boolean; onClose?: () => void; children?: React.ReactNode; title?: string; label?: string;
  /** Round buttons in the bar under the handle. */ leading?: React.ReactNode; trailing?: React.ReactNode;
  /** Sticky CTA area. */ footer?: React.ReactNode; maxHeight?: string;
  /** Drag, scrim and Escape close it. Default true. */ dismissible?: boolean;
  /** Position inside a parent instead of the viewport (docs, prototypes). */ contained?: boolean; id?: string; className?: string;
}
export declare function BottomSheet(props: BottomSheetProps): React.ReactElement | null;

export interface ActionSheetProps { open?: boolean; onClose?: () => void; title?: string; actions: Array<{ label: string; icon?: IconName; tone?: 'default' | 'danger'; onPress?: () => void }>; cancelLabel?: string; contained?: boolean }
export declare function ActionSheet(props: ActionSheetProps): React.ReactElement | null;

export interface FabProps { label?: string; icon?: IconName; tone?: 'ink' | 'brand'; ariaLabel?: string; onClick?: () => void; className?: string }
export declare function Fab(props: FabProps): React.ReactElement;

export interface StickyActionBarProps { children: React.ReactNode; summary?: React.ReactNode; className?: string }
export declare function StickyActionBar(props: StickyActionBarProps): React.ReactElement;

export interface HeroHeaderProps {
  /** 3D art URL used as the backdrop instead of the pattern. */ image?: string;
  title?: React.ReactNode; eyebrow?: string; trailing?: React.ReactNode; pattern?: 'map' | 'waves';
  /** Children straddle the bottom edge (search field or search card). */ overlap?: boolean; children?: React.ReactNode;
  art?: React.ReactNode; belowTitle?: React.ReactNode; className?: string;
  /** Heading level of the title: 1 (default) for the page header, 2 or 3 when the hero sits inside a page that has its own h1. */ headingLevel?: 1 | 2 | 3;
}
export declare function HeroHeader(props: HeroHeaderProps): React.ReactElement;

export interface GreetingBarProps { title: React.ReactNode; subtitle?: string; eyebrow?: string; actions?: React.ReactNode; name?: string; avatar?: string; avatarFirst?: boolean; className?: string }
export declare function GreetingBar(props: GreetingBarProps): React.ReactElement;

export interface SearchFieldProps {
  placeholder?: string; value?: string; defaultValue?: string; onChange?: (e: React.ChangeEvent<HTMLInputElement>) => void;
  /** Shows the filter button; pass null for one without a handler. */ onFilter?: (() => void) | null;
  variant?: 'filled' | 'outline'; label?: string; filterLabel?: string; id?: string; className?: string;
}
export declare function SearchField(props: SearchFieldProps): React.ReactElement;

export interface SectionHeaderProps { title: React.ReactNode; action?: string; onAction?: () => void; chevron?: boolean; className?: string }
export declare function SectionHeader(props: SectionHeaderProps): React.ReactElement;

export interface ChipScrollerProps { options: Array<string | { value: string; label: React.ReactNode }>; value?: string; defaultValue?: string; onChange?: (value: string) => void; tone?: 'ink' | 'brand'; onFilter?: (() => void) | null; label?: string; className?: string }
export declare function ChipScroller(props: ChipScrollerProps): React.ReactElement;

export interface SnapCarouselProps { children: React.ReactNode; /** CSS width of each item. Default 78%. */ itemWidth?: string; gap?: number; label?: string; className?: string }
export declare function SnapCarousel(props: SnapCarouselProps): React.ReactElement;

export interface SwipeRowProps { children: React.ReactNode; actions: Array<{ label: string; icon: IconName; tone?: 'neutral' | 'brand' | 'danger'; onPress?: () => void }>; className?: string }
export declare function SwipeRow(props: SwipeRowProps): React.ReactElement;

export interface MobileSegmentedProps { options: Array<string | { value: string; label: React.ReactNode; icon?: IconName }>; value?: string; defaultValue?: string; onChange?: (value: string) => void; tone?: 'brand' | 'ink'; label?: string; className?: string }
export declare function MobileSegmented(props: MobileSegmentedProps): React.ReactElement;

export interface FieldTileProps { label?: string; value?: React.ReactNode; placeholder?: string; icon?: IconName; trailingIcon?: IconName; chevron?: boolean; onPress?: () => void; className?: string }
export declare function FieldTile(props: FieldTileProps): React.ReactElement;

export interface FeatureCardProps { title: string; text?: string; icon?: IconName; tone?: 'dark' | 'light'; onOpen?: (() => void) | null; className?: string }
export declare function FeatureCard(props: FeatureCardProps): React.ReactElement;

export interface CategoryTileProps { icon: IconName; title: string; subtitle?: string; /** 0–1 */ progress?: number; active?: boolean; onPress?: () => void; className?: string }
export declare function CategoryTile(props: CategoryTileProps): React.ReactElement;

export interface ChecklistRowProps { text: React.ReactNode; meta?: string; checked?: boolean; defaultChecked?: boolean; onChange?: (checked: boolean) => void; dot?: boolean; dotTone?: 'brand' | 'warning'; className?: string }
export declare function ChecklistRow(props: ChecklistRowProps): React.ReactElement;

export interface WeekStripProps { days: Array<{ date: string; weekday: string; dot?: boolean }>; value?: string; defaultValue?: string; onChange?: (date: string) => void; label?: string; className?: string }
export declare function WeekStrip(props: WeekStripProps): React.ReactElement;

export interface TimelineProps { items: Array<{ title: string; time?: string; text?: string; people?: string[]; featured?: boolean; done?: boolean }>; className?: string }
export declare function Timeline(props: TimelineProps): React.ReactElement;

export interface CalendarCardProps { year?: number; /** 0–11 */ month?: number; today?: number; marks?: number[]; selected?: number; onSelect?: (day: number) => void; className?: string }
export declare function CalendarCard(props: CalendarCardProps): React.ReactElement;

export interface AgendaCardProps { title: string; subtitle?: string; time?: string; people?: string[]; chips?: string[]; variant?: 'default' | 'done'; onPress?: () => void; onOpen?: () => void; className?: string }
export declare function AgendaCard(props: AgendaCardProps): React.ReactElement;

export interface PeoplePickerProps { people: Array<{ name: string; avatar?: string; short?: string }>; value?: string; defaultValue?: string; onChange?: (name: string) => void; label?: string; className?: string }
export declare function PeoplePicker(props: PeoplePickerProps): React.ReactElement;

export interface PlanListProps { items: Array<{ title: string; time?: string; featured?: boolean; image?: string; scene?: SceneVariant }>; className?: string }
export declare function PlanList(props: PlanListProps): React.ReactElement;

export interface MiniStatCardProps { title: string; subtitle?: string; value: React.ReactNode; /** With sign, e.g. "-3.48%". */ delta?: string; className?: string }
export declare function MiniStatCard(props: MiniStatCardProps): React.ReactElement;

export interface TripRowProps { date?: string; logo: React.ReactNode; logoTone?: ToneToken; from: { time: string; city: string }; to: { time: string; city: string }; duration: string; onPress?: () => void; className?: string }
export declare function TripRow(props: TripRowProps): React.ReactElement;

export interface FlightSearchSheetProps { from?: Place; to?: Place; trip?: 'round' | 'one'; depart?: string; ret?: string; passengers?: string; cabin?: string; onSearch?: (q: { from: Place; to: Place; trip: string }) => void; cta?: string; hideTrip?: boolean; className?: string }
export declare function FlightSearchSheet(props: FlightSearchSheetProps): React.ReactElement;

export interface RouteHeaderProps { from: { code: string; city: string }; to: { code: string; city: string }; title?: string; onBack?: (() => void) | null; actions?: React.ReactNode; meta?: string; /** 3D globe art URL (Art group: globe). */ image?: string; children?: React.ReactNode; className?: string }
export declare function RouteHeader(props: RouteHeaderProps): React.ReactElement;

export interface TicketCardProps { from: { time: string; code: string; city: string }; to: { time: string; code: string; city: string }; duration: string; cabin?: string; price: string; priceUnit?: string; airline?: string; badge?: string; onPress?: () => void; className?: string }
export declare function TicketCard(props: TicketCardProps): React.ReactElement;

export interface BoardingPassProps {
  date: string; time?: string; from: { code: string; city: string; time?: string }; to: { code: string; city: string; time?: string };
  duration?: string; stops?: string; details: Array<{ label: string; value: React.ReactNode }>; passenger?: string;
  flight?: string; seat?: string; zone?: string; seq?: string; facts?: Array<{ label: string; value: React.ReactNode }>;
  carrier?: string; cabin?: string; /** The 3D jet from the Art group (img element). */ art?: React.ReactNode;
  /** String encoded in the QR. Defaults to flight, route, seat, passenger and date; pass the airline's BCBP string in production. */ qr?: string;
  scanLabel?: string; className?: string;
}
export declare function BoardingPass(props: BoardingPassProps): React.ReactElement;

export interface PlaceCardProps { title: string; region?: string; location?: string; rating?: string; image?: string; scene?: SceneVariant; saved?: boolean; onPress?: () => void; className?: string }
export declare function PlaceCard(props: PlaceCardProps): React.ReactElement;

export interface PlaceHeroProps { title: string; location?: string; price?: string; priceLabel?: string; image?: string; scene?: SceneVariant; onBack?: () => void; saved?: boolean; className?: string }
export declare function PlaceHero(props: PlaceHeroProps): React.ReactElement;

export interface InfoStatRowProps { items: Array<{ icon: IconName; label: string }>; className?: string }
export declare function InfoStatRow(props: InfoStatRowProps): React.ReactElement;

export interface ExpandableTextProps { children: React.ReactNode; lines?: number; moreLabel?: string; className?: string }
export declare function ExpandableText(props: ExpandableTextProps): React.ReactElement;

export interface MiniDestinationProps { title: string; price?: string; duration?: string; dates?: string; badge?: string; image?: string; scene?: SceneVariant; onPress?: () => void; className?: string }
export declare function MiniDestination(props: MiniDestinationProps): React.ReactElement;

export interface IllustrationCalloutProps { children: React.ReactNode; image?: string; icon?: IconName; linkLabel?: string; onLink?: () => void; className?: string }
export declare function IllustrationCallout(props: IllustrationCalloutProps): React.ReactElement;

export interface MemberPickerProps { people: Array<string | { name: string; avatar?: string }>; onAdd?: () => void; addLabel?: string; className?: string }
export declare function MemberPicker(props: MemberPickerProps): React.ReactElement;

export interface ActivityFeedProps { items: Array<{ title: string; time?: string; attachments?: SceneVariant[] }>; className?: string }
export declare function ActivityFeed(props: ActivityFeedProps): React.ReactElement;

export interface DetailListProps { items: Array<{ label: string; value: React.ReactNode }>; className?: string }
export declare function DetailList(props: DetailListProps): React.ReactElement;

export interface LetterRowProps { mark?: string; title: string; subtitle?: string; meta?: string; onPress?: () => void; className?: string }
export declare function LetterRow(props: LetterRowProps): React.ReactElement;

export interface ProfileHeaderProps { name: string; avatar?: string; subtitle?: string; stats?: Array<{ value: React.ReactNode; label: string }>; className?: string }
export declare function ProfileHeader(props: ProfileHeaderProps): React.ReactElement;

export interface OnboardingStep { image?: string; art?: React.ReactNode; scene?: SceneVariant; alt?: string; eyebrow?: string; title: string; text: string; cta?: string }
export interface OnboardingFlowProps {
  steps: OnboardingStep[];
  /** Called with 'done' from the last step, 'skip' when Skip is tapped. */ onDone?: (reason: 'done' | 'skip') => void;
  skipLabel?: string; doneLabel?: string; label?: string; className?: string;
}
export declare function OnboardingFlow(props: OnboardingFlowProps): React.ReactElement;

export interface CountUpProps { /** A number or a string containing one: "$84,210", "87%", "4.92". */ value: string | number; /** ms, default 900 (duration-emphasis). */ duration?: number; /** false shows the final value at once. */ animate?: boolean; className?: string }
export declare function CountUp(props: CountUpProps): React.ReactElement;

export interface SuccessBurstProps { title?: React.ReactNode; children?: React.ReactNode; size?: 'md' | 'sm'; /** Change it to play the burst again. */ replayKey?: string | number; className?: string }
export declare function SuccessBurst(props: SuccessBurstProps): React.ReactElement;

export interface SkeletonProps { variant?: 'card' | 'row' | 'text'; lines?: number; /** Announced to screen readers. Default "Loading". */ label?: string; className?: string }
export declare function Skeleton(props: SkeletonProps): React.ReactElement;

export interface RouteTransitionProps { /** The route or page id; a new key plays the transition. */ routeKey: string; variant?: 'fade-through' | 'shared-x' | 'shared-y' | 'scale'; direction?: 'forward' | 'back'; children?: React.ReactNode; className?: string }
export declare function RouteTransition(props: RouteTransitionProps): React.ReactElement;

export interface ScreenStackProps { /** The current screen id. */ screenKey: string; direction?: 'push' | 'pop'; children?: React.ReactNode; className?: string }
export declare function ScreenStack(props: ScreenStackProps): React.ReactElement;

export interface QRCodeProps { value: string; color?: string; background?: string; /** Quiet-zone modules, default 2. */ quiet?: number; size?: number | string; label?: string; className?: string }
/** A real QR code (byte mode, error correction M, versions 1–10). */
export declare function QRCode(props: QRCodeProps): React.ReactElement;

/** Plain-type wordmark until a real logo exists. */
export declare function Wordmark(): React.ReactElement;

declare global {
  interface Window {
    Airiona: {
      Icon: typeof Icon; Scene: typeof Scene; Button: typeof Button; IconButton: typeof IconButton; SegmentedControl: typeof SegmentedControl;
      Chip: typeof Chip; TextField: typeof TextField; Checkbox: typeof Checkbox; Switch: typeof Switch; QuantityStepper: typeof QuantityStepper;
      Calendar: typeof Calendar; BookingSearch: typeof BookingSearch; Badge: typeof Badge; Rating: typeof Rating; Toast: typeof Toast;
      BookingSteps: typeof BookingSteps; Avatar: typeof Avatar; AvatarStack: typeof AvatarStack; FlightTicket: typeof FlightTicket;
      StayCard: typeof StayCard; DestinationCard: typeof DestinationCard; BookingBar: typeof BookingBar; AmenityList: typeof AmenityList;
      StatCard: typeof StatCard; SideNav: typeof SideNav; TopNav: typeof TopNav; Wordmark: typeof Wordmark;
      Dialog: typeof Dialog; Select: typeof Select; Menu: typeof Menu; DataTable: typeof DataTable;
      Tabs: typeof Tabs; Tooltip: typeof Tooltip; DatePicker: typeof DatePicker;
      Ring: typeof Ring; MetricTile: typeof MetricTile; PillBarChart: typeof PillBarChart; SegmentGauge: typeof SegmentGauge; RatingBreakdown: typeof RatingBreakdown; Leaderboard: typeof Leaderboard; StripeDistribution: typeof StripeDistribution; Heatmap: typeof Heatmap; AbsenceCard: typeof AbsenceCard; ToggleTile: typeof ToggleTile; ArrivalTile: typeof ArrivalTile; RingStatCard: typeof RingStatCard; HabitTile: typeof HabitTile; GateTile: typeof GateTile; VoiceRecorder: typeof VoiceRecorder; BatteryTile: typeof BatteryTile; MediaPlayer: typeof MediaPlayer; AnalogClock: typeof AnalogClock; RecordingTile: typeof RecordingTile; ActivityCalendar: typeof ActivityCalendar; WorldClock: typeof WorldClock; RideTile: typeof RideTile; ChargingTile: typeof ChargingTile; TripSummaryTile: typeof TripSummaryTile; Notch: typeof Notch; ProfileProjectCard: typeof ProfileProjectCard; MeetingsStrip: typeof MeetingsStrip; RoadmapGantt: typeof RoadmapGantt; DateChip: typeof DateChip; EfficiencyChart: typeof EfficiencyChart; TotalTimeTile: typeof TotalTimeTile; AssistantCard: typeof AssistantCard; PageHeader: typeof PageHeader; ChannelCard: typeof ChannelCard; PromptCard: typeof PromptCard; BalanceChart: typeof BalanceChart; HoldingsPanel: typeof HoldingsPanel; SparkBars: typeof SparkBars; PilotDashboard: typeof PilotDashboard;
      PhoneFrame: typeof PhoneFrame; StatusBar: typeof StatusBar; AppBar: typeof AppBar; TabBar: typeof TabBar; BottomSheet: typeof BottomSheet; ActionSheet: typeof ActionSheet; Fab: typeof Fab; StickyActionBar: typeof StickyActionBar; HeroHeader: typeof HeroHeader; GreetingBar: typeof GreetingBar; SearchField: typeof SearchField; SectionHeader: typeof SectionHeader; ChipScroller: typeof ChipScroller; SnapCarousel: typeof SnapCarousel; SwipeRow: typeof SwipeRow; MobileSegmented: typeof MobileSegmented; FieldTile: typeof FieldTile; FeatureCard: typeof FeatureCard; CategoryTile: typeof CategoryTile; ChecklistRow: typeof ChecklistRow; WeekStrip: typeof WeekStrip; Timeline: typeof Timeline; CalendarCard: typeof CalendarCard; AgendaCard: typeof AgendaCard; PeoplePicker: typeof PeoplePicker; PlanList: typeof PlanList; MiniStatCard: typeof MiniStatCard; TripRow: typeof TripRow; FlightSearchSheet: typeof FlightSearchSheet; RouteHeader: typeof RouteHeader; TicketCard: typeof TicketCard; BoardingPass: typeof BoardingPass; PlaceCard: typeof PlaceCard; PlaceHero: typeof PlaceHero; InfoStatRow: typeof InfoStatRow; ExpandableText: typeof ExpandableText; MiniDestination: typeof MiniDestination; IllustrationCallout: typeof IllustrationCallout; MemberPicker: typeof MemberPicker; ActivityFeed: typeof ActivityFeed; DetailList: typeof DetailList; LetterRow: typeof LetterRow; ProfileHeader: typeof ProfileHeader; OnboardingFlow: typeof OnboardingFlow;
      CountUp: typeof CountUp; SuccessBurst: typeof SuccessBurst; Skeleton: typeof Skeleton; RouteTransition: typeof RouteTransition; ScreenStack: typeof ScreenStack; QRCode: typeof QRCode;
      AuthShell: typeof AuthShell; LandingHero: typeof LandingHero; SplitHero: typeof SplitHero; PromoBanner: typeof PromoBanner; StatStrip: typeof StatStrip; OptionList: typeof OptionList;
    };
  }
}

export interface AuthHighlight { title: string; text: string }
export interface AuthShellProps {
  /** Still frame for the media panel (also the strip on phones unless stripImage is set). */ poster: string;
  /** Looping muted video for the media panel; plays on wide screens once the page has settled. */ video?: string;
  /** Smaller crop for the phone strip. */ stripImage?: string;
  headline?: string; highlights?: AuthHighlight[];
  /** Form column side on wide screens: left (sign-in) or right (sign-up). */ side?: 'left' | 'right';
  /** Wider form column for long forms. */ wide?: boolean;
  brand?: React.ReactNode; actions?: React.ReactNode; footer?: React.ReactNode; legal?: string;
  /** Milliseconds each highlight stays up. */ interval?: number; mediaLabel?: string;
  children?: React.ReactNode; className?: string;
}
export declare function AuthShell(props: AuthShellProps): React.ReactElement;

export interface LandingStat { value: string; label: string }
export interface LandingHeroProps {
  title: string; eyebrow?: string; lede?: string;
  /** Backdrop photo; also the poster the video fades in over. */ image?: string;
  /** Looping muted video; plays on wide screens (>=1024px) once the page has settled. */ video?: string;
  /** object-position for the photo, so the subject stays in a narrow phone crop (for example "78% 50%"). */ focus?: string;
  stats?: LandingStat[];
  /** Heading level of the title: 1 (default) for the page's own hero. */ headingLevel?: 1 | 2 | 3;
  actions?: React.ReactNode;
  /** Children straddle the bottom edge (a search card). */ docked?: boolean;
  children?: React.ReactNode; className?: string;
}
export declare function LandingHero(props: LandingHeroProps): React.ReactElement;

export interface SplitBadge { title: string; text?: string; /** Short figure in the blue disc, e.g. "28K+". */ value?: string; people?: Array<string | { name: string; src?: string }> }
export interface SplitHeroProps {
  /** First line of the headline. */ title: string;
  /** Second line, in Ion Blue with a hand-drawn underline. */ accent?: string;
  eyebrow?: string; lede?: string;
  /** Photo; also the poster frame the video fades in over. */ image?: string;
  /** Looping muted video that replaces the photo once the page has settled. */ video?: string;
  /** object-position for the photo and video. */ focus?: string;
  /** object-position on phones, where the photo runs full-bleed in portrait. */ phoneFocus?: string;
  /** Phone brand row actions (sign in), shown over the photo below 768px. */ top?: React.ReactNode;
  badge?: SplitBadge;
  /** Label of the ring button; the button shows only when set. */ storyLabel?: string;
  onStory?: () => void;
  headingLevel?: 1 | 2 | 3;
  actions?: React.ReactNode;
  /** Children straddle the bottom edge (the search bar). */ docked?: boolean;
  children?: React.ReactNode; className?: string;
}
export declare function SplitHero(props: SplitHeroProps): React.ReactElement;

export interface PromoBannerProps {
  title: string; /** Part of the title in gold, e.g. "30% off". */ highlight?: string;
  eyebrow?: string; text?: string; image?: string;
  /** Label of the white button; the button shows only when set. */ action?: string; onAction?: () => void;
  className?: string;
}
export declare function PromoBanner(props: PromoBannerProps): React.ReactElement;

export interface StripStat { icon: string; value: string; label: string; tone?: 'blue' | 'green' | 'amber' }
export interface StatStripProps { items?: StripStat[]; /** Accessible name of the list. */ label?: string; className?: string }
export declare function StatStrip(props: StatStripProps): React.ReactElement;

export interface OptionCard { value: string; title: string; /** Short facts under the title. */ meta?: string; /** Formatted price on the right. */ price?: string; /** Line under the price. */ note?: string; image?: string; /** Small pill above the title. */ badge?: string; disabled?: boolean }
export interface OptionListProps {
  options?: OptionCard[]; value?: string | null; defaultValue?: string | null; onChange?: (value: string) => void;
  /** Visible label and accessible name of the group. */ label?: string;
  /** Shows the message in red under the list and marks the group invalid. */ error?: string | null;
  className?: string;
}
export declare function OptionList(props: OptionListProps): React.ReactElement;
