import { DOCUMENT } from '@angular/common';
import {
  ChangeDetectionStrategy,
  Component,
  ElementRef,
  booleanAttribute,
  computed,
  effect,
  inject,
  input,
  model,
  output,
  signal,
  untracked,
  viewChild,
} from '@angular/core';
import { ArPlatform, arPresence } from '../core/platform';
import { cx, uid } from '../core/utils';

const FOCUSABLE =
  'button:not([disabled]), [href], input:not([disabled]), select:not([disabled]), textarea:not([disabled]), [tabindex]:not([tabindex="-1"])';

/**
 * A panel that slides up over a scrim. Drag the handle down to dismiss: more than 110px, or a flick faster than
 * 0.6px/ms over at least 48px, closes it; anything less springs back. Escape and the scrim also close it.
 *
 * Slots: `arLeading` / `arTrailing` (round buttons in the bar under the handle), `arFooter` (sticky CTA), default content.
 *
 * ```html
 * <ar-bottom-sheet [(open)]="datesOpen" title="Choose your dates">
 *   <button arLeading arIconButton icon="x-mark" label="Close" variant="soft" (click)="datesOpen.set(false)"></button>
 *   <ar-week-strip [days]="days" />
 *   <button arFooter arButton size="lg" block>Continue</button>
 * </ar-bottom-sheet>
 * ```
 */
@Component({
  selector: 'ar-bottom-sheet',
  changeDetection: ChangeDetectionStrategy.OnPush,
  host: { '[attr.title]': 'null', style: 'display: contents' },
  template: `
    @if (presence.mounted()) {
      <div [class]="rootClass()">
        <div class="m-sheet__scrim" aria-hidden="true" (click)="dismissible() && close()"></div>
        <div
          #panel
          [class]="drag() ? 'm-sheet__panel is-dragging' : 'm-sheet__panel'"
          role="dialog"
          aria-modal="true"
          [attr.aria-labelledby]="title() ? sheetId() + '-t' : null"
          [attr.aria-label]="title() ? null : label() || null"
          [style.transform]="drag() ? 'translateY(' + drag() + 'px)' : null"
          [style.max-height]="cssMaxHeight()"
        >
          <div class="m-sheet__grip" (pointerdown)="down($event)" (pointermove)="move($event)" (pointerup)="up($event)" (pointercancel)="up($event)">
            <span class="m-sheet__handle" aria-hidden="true"></span>
            <div class="m-sheet__bar"><span><ng-content select="[arLeading]" /></span><span><ng-content select="[arTrailing]" /></span></div>
          </div>
          @if (title()) {
            <h2 class="m-sheet__title" [id]="sheetId() + '-t'">{{ title() }}</h2>
          }
          <div class="m-sheet__body"><ng-content /></div>
          <div class="m-sheet__foot"><ng-content select="[arFooter]" /></div>
        </div>
      </div>
    }
  `,
})
export class ArBottomSheet {
  private readonly platform = inject(ArPlatform);
  private readonly doc = inject(DOCUMENT);

  /** Two-way: `[(open)]`. Defaults to open, like the React sheet. */
  readonly open = model(true);
  readonly title = input<string>();
  /** Accessible name when there is no title. */
  readonly label = input<string>();
  /** Escape, the scrim and drag-down close it (default true). Escape always closes. */
  readonly dismissible = input(true, { transform: booleanAttribute });
  /** Positions inside the nearest positioned parent instead of the viewport (docs). Skips autofocus. */
  readonly contained = input(false, { transform: booleanAttribute });
  /** Number (px) or CSS length; default 92% from the stylesheet. */
  readonly maxHeight = input<number | string>();
  readonly id = input<string>();
  /** Extra classes on the `.m-sheet` root (ActionSheet passes `m-actions`). */
  readonly sheetClass = input<string>('');
  /** Fires after the sheet asks to close (it also sets `open` to false). */
  readonly closed = output<void>();

  protected readonly presence = arPresence(this.open, 260);
  protected readonly drag = signal(0);
  private dragging: { y: number; t: number } | null = null;
  private readonly panel = viewChild<ElementRef<HTMLElement>>('panel');
  private readonly autoId = uid('m-sheet');

  protected readonly sheetId = computed(() => this.id() || this.autoId);
  protected readonly cssMaxHeight = computed(() => {
    const m = this.maxHeight();
    return m === undefined || m === null || m === '' ? null : typeof m === 'number' ? `${m}px` : m;
  });
  protected readonly rootClass = computed(() =>
    cx('m-sheet', this.contained() && 'm-sheet--contained', this.presence.leaving() && 'is-leaving', this.sheetClass()),
  );

  constructor() {
    effect((onCleanup) => {
      if (!this.open() || !this.platform.isBrowser) return;
      const contained = untracked(this.contained);
      const onKey = (e: KeyboardEvent) => {
        if (e.key === 'Escape') this.close();
      };
      this.doc.addEventListener('keydown', onKey);
      const t = setTimeout(() => {
        const el = this.panel()?.nativeElement.querySelector<HTMLElement>(FOCUSABLE);
        if (el && !contained) el.focus();
      }, 60);
      onCleanup(() => {
        this.doc.removeEventListener('keydown', onKey);
        clearTimeout(t);
      });
    });
  }

  /** Haptic tick, then closes. */
  close(): void {
    this.platform.haptic();
    this.open.set(false);
    this.closed.emit();
  }

  protected down(e: PointerEvent): void {
    this.dragging = { y: e.clientY, t: Date.now() };
    try {
      (e.currentTarget as Element).setPointerCapture(e.pointerId);
    } catch {
      /* capture is optional */
    }
  }

  protected move(e: PointerEvent): void {
    if (!this.dragging) return;
    this.drag.set(Math.max(0, e.clientY - this.dragging.y));
  }

  protected up(e: PointerEvent): void {
    if (!this.dragging) return;
    const dy = e.clientY - this.dragging.y;
    const v = dy / Math.max(1, Date.now() - this.dragging.t);
    this.dragging = null;
    this.drag.set(0);
    if (this.dismissible() && (dy > 110 || (dy > 48 && v > 0.6))) this.close();
  }
}
