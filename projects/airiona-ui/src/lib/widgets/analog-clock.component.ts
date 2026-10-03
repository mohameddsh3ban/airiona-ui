import { ChangeDetectionStrategy, Component, booleanAttribute, computed, effect, inject, input, signal } from '@angular/core';
import { rnd } from '../core/chart.utils';
import { ArPlatform } from '../core/platform';
import { ArWidgetTone, widgetClass } from '../core/primitives';
import { pad2 } from '../core/utils';

interface Line {
  x1: number;
  y1: number;
  x2: number;
  y2: number;
}

interface Tick extends Line {
  cls: string;
}

/** Minute ticks, skipping the four quarter positions that carry numerals. */
const TICKS: Tick[] = (() => {
  const out: Tick[] = [];
  for (let i = 0; i < 60; i++) {
    if (i % 15 === 0) continue;
    const a = (i * 6 * Math.PI) / 180;
    const big = i % 5 === 0;
    const r1 = big ? 84 : 88;
    out.push({
      x1: rnd(100 + r1 * Math.sin(a)),
      y1: rnd(100 - r1 * Math.cos(a)),
      x2: rnd(100 + 92 * Math.sin(a)),
      y2: rnd(100 - 92 * Math.cos(a)),
      cls: big ? 'ar-clock__tick is-big' : 'ar-clock__tick',
    });
  }
  return out;
})();

function hand(deg: number, len: number): Line {
  const a = (deg * Math.PI) / 180;
  return {
    x1: rnd(100 - 14 * Math.sin(a)),
    y1: rnd(100 + 14 * Math.cos(a)),
    x2: rnd(100 + len * Math.sin(a)),
    y2: rnd(100 - len * Math.cos(a)),
  };
}

/**
 * Clock face with Roman quarter numerals, minute ticks, ink hands, an Ion Blue second hand and a digital readout pill.
 * Give a fixed `time` ("HH:MM:SS") for a static clock; omit it for a live clock that ticks every second
 * (browser only). `[live]="false"` freezes the live clock at the moment it rendered.
 *
 * ```html
 * <ar-analog-clock time="07:02:46" />
 * <ar-analog-clock />
 * ```
 */
@Component({
  selector: 'ar-analog-clock',
  changeDetection: ChangeDetectionStrategy.OnPush,
  host: { '[class]': 'hostClass()', '[attr.role]': 'ariaLabel() ? "region" : null', '[attr.aria-label]': 'ariaLabel() || null' },
  template: `
    <svg viewBox="0 0 200 200" class="ar-clock" role="img" [attr.aria-label]="'Time ' + label()">
      <circle cx="100" cy="100" r="96" class="ar-clock__face" />
      @for (t of ticks; track $index) {
        <line [attr.x1]="t.x1" [attr.y1]="t.y1" [attr.x2]="t.x2" [attr.y2]="t.y2" [attr.class]="t.cls" />
      }
      <rect x="72" y="136" width="56" height="20" rx="10" class="ar-clock__pill" />
      <text x="100" y="150.5" class="ar-clock__readout" text-anchor="middle">{{ label() }}</text>
      <text x="100" y="34" class="ar-clock__num" text-anchor="middle">XII</text>
      <text x="172" y="106" class="ar-clock__num" text-anchor="middle">III</text>
      <text x="100" y="178" class="ar-clock__num" text-anchor="middle">VI</text>
      <text x="28" y="106" class="ar-clock__num" text-anchor="middle">IX</text>
      @let hr = hourHand();
      <line [attr.x1]="hr.x1" [attr.y1]="hr.y1" [attr.x2]="hr.x2" [attr.y2]="hr.y2" class="ar-clock__hour" stroke-width="6" stroke-linecap="round" />
      @let mn = minuteHand();
      <line [attr.x1]="mn.x1" [attr.y1]="mn.y1" [attr.x2]="mn.x2" [attr.y2]="mn.y2" class="ar-clock__min" stroke-width="4" stroke-linecap="round" />
      @let sc = secondHand();
      <line [attr.x1]="sc.x1" [attr.y1]="sc.y1" [attr.x2]="sc.x2" [attr.y2]="sc.y2" class="ar-clock__sec" stroke-width="1.5" stroke-linecap="round" />
      <circle cx="100" cy="100" r="5" class="ar-clock__pin" />
    </svg>
  `,
})
export class ArAnalogClock {
  private readonly platform = inject(ArPlatform);
  readonly tone = input<ArWidgetTone>('light');
  readonly ariaLabel = input<string>();
  /** "HH:MM:SS" (seconds optional) for a static clock. Omit for a live clock. */
  readonly time = input<string>();
  /** `false` stops the live clock from ticking. */
  readonly live = input(true, { transform: booleanAttribute });

  private readonly now = signal(new Date());
  private readonly parts = computed(() => {
    const t = this.time();
    if (t) {
      const p = t.split(':');
      return { hh: +p[0], mm: +p[1], ss: +(p[2] || 0) };
    }
    const d = this.now();
    return { hh: d.getHours(), mm: d.getMinutes(), ss: d.getSeconds() };
  });

  protected readonly ticks = TICKS;
  protected readonly label = computed(() => pad2(this.parts().hh) + ':' + pad2(this.parts().mm));
  protected readonly hourHand = computed(() => hand((this.parts().hh % 12) * 30 + this.parts().mm / 2, 46));
  protected readonly minuteHand = computed(() => hand(this.parts().mm * 6 + this.parts().ss / 10, 70));
  protected readonly secondHand = computed(() => hand(this.parts().ss * 6, 78));
  protected readonly hostClass = computed(() => widgetClass(this.tone(), 'ar-clockw'));

  constructor() {
    effect((onCleanup) => {
      const win = this.platform.window;
      if (this.time() || !this.live() || !win) return;
      const id = win.setInterval(() => this.now.set(new Date()), 1000);
      onCleanup(() => win.clearInterval(id));
    });
  }
}
