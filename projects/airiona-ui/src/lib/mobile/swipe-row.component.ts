import { ChangeDetectionStrategy, Component, computed, inject, input, output, signal } from '@angular/core';
import { ArIcon } from '../core/icon.component';
import { ArPlatform } from '../core/platform';

export interface ArSwipeAction {
  label: string;
  icon: string;
  tone?: 'neutral' | 'brand' | 'danger';
}

/**
 * Wraps any row so a left swipe reveals up to three actions. Horizontal intent locks after 6px, so vertical
 * scrolling is never hijacked. Past half the action width it opens; less snaps back. A screen-reader button
 * toggles the actions without swiping.
 *
 * ```html
 * <ar-swipe-row [actions]="[{ label: 'Delete', icon: 'trash', tone: 'danger' }]" (action)="remove($event)">
 *   <ar-checklist-row text="Swipe this row left" />
 * </ar-swipe-row>
 * ```
 */
@Component({
  selector: 'ar-swipe-row',
  imports: [ArIcon],
  changeDetection: ChangeDetectionStrategy.OnPush,
  host: { class: 'm-swipe' },
  template: `
    <div class="m-swipe__actions" [style.width.px]="width()">
      @for (a of actions(); track a.label) {
        <button type="button" [class]="'m-swipe__btn is-' + (a.tone || 'neutral')" (click)="choose(a)">
          <ar-icon [name]="a.icon" [size]="20" />
          <span>{{ a.label }}</span>
        </button>
      }
    </div>
    <div
      [class]="dragging() ? 'm-swipe__content is-dragging' : 'm-swipe__content'"
      [style.transform]="'translateX(' + x() + 'px)'"
      (pointerdown)="down($event)"
      (pointermove)="move($event)"
      (pointerup)="up()"
      (pointercancel)="up()"
    >
      <ng-content />
      @if (actions().length) {
        <button type="button" class="ar-sr" (click)="toggle()">{{ x() ? 'Hide actions' : 'Show actions' }}</button>
      }
    </div>
  `,
})
export class ArSwipeRow {
  private readonly platform = inject(ArPlatform);

  /** Up to three actions; destructive last, in `danger`. */
  readonly actions = input<ArSwipeAction[]>([]);
  /** An action button was pressed (the row closes first). */
  readonly action = output<ArSwipeAction>();

  protected readonly width = computed(() => this.actions().length * 76);
  protected readonly x = signal(0);
  /** Mirrors React's `start.current` at render time: true while a locked horizontal drag is moving the row. */
  protected readonly dragging = signal(false);
  private start: { x: number; y: number; locked: boolean | null } | null = null;
  private base = 0;
  private cur = 0;

  private setX(v: number): void {
    this.cur = v;
    this.x.set(v);
  }

  protected down(e: PointerEvent): void {
    if ((e.target as Element | null)?.closest?.('.m-swipe__actions')) return;
    this.start = { x: e.clientX, y: e.clientY, locked: null };
    this.base = this.cur;
  }

  protected move(e: PointerEvent): void {
    const s = this.start;
    if (!s) return;
    const dx = e.clientX - s.x;
    const dy = e.clientY - s.y;
    if (s.locked === null && (Math.abs(dx) > 6 || Math.abs(dy) > 6)) {
      s.locked = Math.abs(dx) > Math.abs(dy);
      if (s.locked) {
        try {
          (e.currentTarget as Element).setPointerCapture(e.pointerId);
        } catch {
          /* capture is optional */
        }
      }
    }
    if (s.locked) {
      this.dragging.set(true);
      this.setX(Math.max(-this.width() - 24, Math.min(0, this.base + dx)));
    }
  }

  protected up(): void {
    const s = this.start;
    this.start = null;
    this.dragging.set(false);
    if (!s || !s.locked) return;
    const open = this.cur < -this.width() / 2;
    this.setX(open ? -this.width() : 0);
    if (open) this.platform.haptic();
  }

  protected toggle(): void {
    this.setX(this.cur ? 0 : -this.width());
  }

  protected choose(a: ArSwipeAction): void {
    this.platform.haptic();
    this.setX(0);
    this.action.emit(a);
  }
}
