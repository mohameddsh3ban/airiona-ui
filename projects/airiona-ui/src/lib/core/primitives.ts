import { ChangeDetectionStrategy, Component, booleanAttribute, computed, input, numberAttribute, output } from '@angular/core';
import { ArIcon } from './icon.component';
import { arAssetUrl } from './scene.component';
import { clamp, cx, initials, nameHue } from './utils';

export type ArBadgeTone = 'neutral' | 'success' | 'warning' | 'danger' | 'brand' | 'ink' | 'outline' | 'glass';

/** Status or label pill. Always pair a status colour with a word. */
@Component({
  selector: 'ar-badge',
  imports: [ArIcon],
  changeDetection: ChangeDetectionStrategy.OnPush,
  host: { '[class]': 'hostClass()' },
  template: `
    @if (dot()) {
      <span class="ar-badge__dot" aria-hidden="true"></span>
    }
    @if (icon()) {
      <ar-icon [name]="icon()!" [size]="13" [strokeWidth]="2.25" />
    }
    <ng-content />
  `,
})
export class ArBadge {
  readonly tone = input<ArBadgeTone>('neutral');
  readonly size = input<'sm' | 'md'>('md');
  readonly dot = input(false, { transform: booleanAttribute });
  readonly icon = input<string>();
  protected readonly hostClass = computed(() => cx('ar-badge', `ar-badge--${this.tone()}`, this.size() === 'sm' && 'ar-badge--sm'));
}

export type ArAvatarSize = 'xs' | 'sm' | 'md' | 'lg';

/** Photo or initials on a tint derived from the name. */
@Component({
  selector: 'ar-avatar',
  changeDetection: ChangeDetectionStrategy.OnPush,
  host: {
    '[class]': 'hostClass()',
    '[attr.data-hue]': 'hue()',
    '[attr.title]': 'name()',
    role: 'img',
    '[attr.aria-label]': 'name()',
  },
  template: `
    @if (url()) {
      <img [src]="url()" alt="" />
    } @else {
      {{ letters() }}
    }
  `,
})
export class ArAvatar {
  private readonly asset = arAssetUrl();
  readonly name = input<string>('');
  readonly src = input<string | null>();
  readonly size = input<ArAvatarSize>('md');
  protected readonly url = computed(() => this.asset(this.src()));
  protected readonly letters = computed(() => initials(this.name()));
  protected readonly hue = computed(() => nameHue(this.name()));
  protected readonly hostClass = computed(() => cx('ar-avatar', this.size() !== 'md' && `ar-avatar--${this.size()}`));
}

export interface ArPerson {
  name: string;
  src?: string;
  avatar?: string;
}

/**
 * Overlapping faces with a "+N" counter and an optional caption.
 * Use `caption` for plain text, or project rich content: `<ar-avatar-stack [people]="p"><b>10k+</b> travellers</ar-avatar-stack>`.
 */
@Component({
  selector: 'ar-avatar-stack',
  imports: [ArAvatar],
  changeDetection: ChangeDetectionStrategy.OnPush,
  host: { class: 'ar-avatars' },
  template: `
    <span class="ar-avatars__stack">
      @for (p of shown(); track p.name) {
        <ar-avatar [name]="p.name" [src]="p.src || p.avatar" [size]="size()" />
      }
      @if (extraCount() > 0) {
        <span [class]="'ar-avatar ar-avatars__more ar-avatar--' + size()">+{{ extraCount() }}</span>
      }
    </span>
    <span class="ar-avatars__text">@if (caption()) {{{ caption() }}}<ng-content /></span>
  `,
})
export class ArAvatarStack {
  readonly people = input<Array<ArPerson | string>>([]);
  readonly max = input(4, { transform: numberAttribute });
  /** Added to the hidden count, for totals you do not render. */
  readonly extra = input(0, { transform: numberAttribute });
  readonly size = input<ArAvatarSize>('sm');
  readonly caption = input<string>();
  private readonly list = computed<ArPerson[]>(() => this.people().map((p) => (typeof p === 'string' ? { name: p } : p)));
  protected readonly shown = computed(() => this.list().slice(0, this.max()));
  protected readonly extraCount = computed(() => this.extra() + Math.max(0, this.list().length - this.max()));
}

/** Circular progress with content in the middle. `value` is 0–1. */
@Component({
  selector: 'ar-ring',
  changeDetection: ChangeDetectionStrategy.OnPush,
  host: {
    class: 'ar-ring',
    '[style.width.px]': 'size()',
    '[style.height.px]': 'size()',
    role: 'img',
    '[attr.aria-label]': 'ariaLabel() || percent() + "%"',
  },
  template: `
    <svg [attr.width]="size()" [attr.height]="size()" [attr.viewBox]="'0 0 ' + size() + ' ' + size()" aria-hidden="true">
      <circle [attr.cx]="half()" [attr.cy]="half()" [attr.r]="r()" class="ar-ring__track" [attr.stroke-width]="stroke()" fill="none" />
      <circle
        [attr.cx]="half()" [attr.cy]="half()" [attr.r]="r()" class="ar-ring__bar" [attr.stroke-width]="stroke()" fill="none"
        [attr.stroke-dasharray]="c()" [attr.stroke-dashoffset]="c() * (1 - v())" stroke-linecap="round"
        [attr.transform]="'rotate(-90 ' + half() + ' ' + half() + ')'" [style.--c]="c()"
      />
    </svg>
    <span class="ar-ring__label"><ng-content /></span>
  `,
})
export class ArRing {
  readonly value = input(0, { transform: numberAttribute });
  readonly size = input(64, { transform: numberAttribute });
  readonly stroke = input(3, { transform: numberAttribute });
  readonly ariaLabel = input<string>();
  protected readonly v = computed(() => clamp(this.value() || 0, 0, 1));
  protected readonly half = computed(() => this.size() / 2);
  protected readonly r = computed(() => (this.size() - this.stroke()) / 2);
  protected readonly c = computed(() => 2 * Math.PI * this.r());
  protected readonly percent = computed(() => Math.round(this.v() * 100));
}

/** Plain-type wordmark until a real logo exists. */
@Component({
  selector: 'ar-wordmark',
  changeDetection: ChangeDetectionStrategy.OnPush,
  host: { class: 'ar-wordmark', 'aria-label': 'Airiona' },
  template: `airiona<i>.</i>`,
})
export class ArWordmark {}

/**
 * The eyebrow + title header used by every dashboard widget, with an optional round "open" button.
 * Project extra actions with `<ng-content>`.
 */
@Component({
  selector: 'ar-card-head',
  imports: [ArIcon],
  changeDetection: ChangeDetectionStrategy.OnPush,
  host: { class: 'ar-w__head', '[attr.title]': 'null' },
  template: `
    <div class="ar-w__titles">
      @if (eyebrow()) {
        <span class="ar-w__eyebrow">{{ eyebrow() }}</span>
      }
      @if (title()) {
        <h3 class="ar-w__title">{{ title() }}</h3>
      }
    </div>
    @if (openable()) {
      <button type="button" class="ar-iconbtn ar-iconbtn--surface ar-iconbtn--sm" [attr.aria-label]="'Open ' + (title() || eyebrow() || '')" (click)="open.emit()">
        <ar-icon name="chevron-right" [size]="16" />
      </button>
    }
    <ng-content />
  `,
})
export class ArCardHead {
  readonly eyebrow = input<string>();
  readonly title = input<string>();
  /** Shows the round chevron button that emits (open). */
  readonly openable = input(false, { transform: booleanAttribute });
  readonly open = output<void>();
}

/** Host classes for a dashboard widget: `ar-w ar-w--{tone} {block}`. */
export type ArWidgetTone = 'light' | 'dark' | 'brand' | 'sky' | 'sunken';
export function widgetClass(tone: ArWidgetTone, block: string): string {
  return cx('ar-w', `ar-w--${tone}`, block);
}
