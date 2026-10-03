import { DOCUMENT } from '@angular/common';
import {
  ChangeDetectionStrategy,
  Component,
  DestroyRef,
  ElementRef,
  booleanAttribute,
  computed,
  effect,
  OnInit,
  inject,
  input,
  model,
  output,
  signal,
  viewChild,
} from '@angular/core';
import { ArIconButton } from '../actions/icon-button.component';
import { ArIcon } from '../core/icon.component';
import { ArPlatform, arPresence } from '../core/platform';
import { cx, uid } from '../core/utils';

export type ArDialogTone = 'default' | 'danger' | 'success' | 'brand';
export type ArDialogSize = 'sm' | 'md' | 'lg';

const FOCUSABLE =
  'button:not([disabled]), [href], input:not([disabled]), select:not([disabled]), textarea:not([disabled]), [tabindex]:not([tabindex="-1"])';
const DIALOG_ICON: Record<ArDialogTone, string> = {
  default: 'information-circle',
  danger: 'exclamation-triangle',
  success: 'check-circle',
  brand: 'plane',
};

/**
 * Modal panel for one decision or one short task, over a blurred scrim (a bottom sheet on phones).
 * Moves itself to `document.body`, locks page scroll, traps Tab, closes on Escape and scrim click,
 * and returns focus to the element that opened it. `inline` renders in place (docs, previews).
 *
 * Slots: default content is the body, `[arFooter]` the buttons (primary last), `[arMedia]` a scene or image on top.
 * Put `data-autofocus` on the control that should take focus first.
 *
 * ```html
 * <ar-dialog [(open)]="confirm" tone="danger" title="Cancel this booking?" description="15–19 Oct · 2 guests">
 *   <div class="ar-plate">…</div>
 *   <button arButton arFooter variant="secondary" (click)="confirm.set(false)">Keep booking</button>
 *   <button arButton arFooter variant="danger">Cancel and refund $512</button>
 * </ar-dialog>
 * ```
 */
@Component({
  selector: 'ar-dialog',
  imports: [ArIcon, ArIconButton],
  changeDetection: ChangeDetectionStrategy.OnPush,
  host: { style: 'display: contents', '[attr.title]': 'null' },
  template: `
    @if (presence.mounted()) {
      <div #root [class]="rootClass()" (mousedown)="onScrim($event)">
        <div
          #panel
          [attr.role]="currentTone() === 'danger' ? 'alertdialog' : 'dialog'"
          [attr.aria-modal]="inline() ? null : 'true'"
          [attr.aria-labelledby]="dlgId() + '-t'"
          [attr.aria-describedby]="description() ? dlgId() + '-d' : null"
          [class]="panelClass()"
        >
          <div class="ar-dialog__media"><ng-content select="[arMedia]" /></div>
          <div class="ar-dialog__head">
            @if (iconName()) {
              <span class="ar-dialog__icon"><ar-icon [name]="iconName()!" [size]="20" [strokeWidth]="2" /></span>
            }
            <div class="ar-dialog__titles">
              <h2 class="ar-dialog__title" [id]="dlgId() + '-t'">{{ title() }}</h2>
              @if (description()) {
                <p class="ar-dialog__desc" [id]="dlgId() + '-d'">{{ description() }}</p>
              }
            </div>
            @if (dismissible()) {
              <button arIconButton icon="x-mark" size="sm" variant="soft" label="Close" class="ar-dialog__close" (click)="close()"></button>
            }
          </div>
          <div class="ar-dialog__body"><ng-content /></div>
          <div class="ar-dialog__foot"><ng-content select="[arFooter]" /></div>
        </div>
      </div>
    }
  `,
})
export class ArDialog implements OnInit {
  private readonly platform = inject(ArPlatform);
  private readonly doc = inject(DOCUMENT);

  /** Two-way: `[(open)]`. Closing (Escape, scrim, close button) sets it to false and emits `closed`. */
  readonly open = model(true);
  readonly title = input<string>('');
  readonly description = input<string>();
  /** Omit for a neutral dialog without an icon; set to get the tone colour and its icon. */
  readonly tone = input<ArDialogTone>();
  /** Icon name, or `false` to hide the tone icon. */
  readonly icon = input<string | false>();
  readonly size = input<ArDialogSize>('md');
  readonly dismissible = input(true, { transform: booleanAttribute });
  /** Render in place without scrim behaviour (no portal, no focus trap, no scroll lock). */
  readonly inline = input(false, { transform: booleanAttribute });
  readonly id = input<string>();
  readonly closed = output<void>();

  private readonly autoId = uid('ar-dlg');
  protected readonly dlgId = computed(() => this.id() || this.autoId);
  /** False until inputs are bound, so a dialog bound closed never mounts (and fades out) on first render. */
  private readonly ready = signal(false);
  protected readonly presence = arPresence(
    computed(() => this.ready() && this.open()),
    200,
  );
  protected readonly currentTone = computed<ArDialogTone>(() => this.tone() ?? 'default');
  protected readonly iconName = computed(() => {
    const i = this.icon();
    if (i === false) return null;
    return i || (this.tone() ? DIALOG_ICON[this.currentTone()] : null);
  });
  protected readonly rootClass = computed(() =>
    cx('ar', 'ar-dialog', this.inline() && 'ar-dialog--inline', this.presence.leaving() && 'is-leaving'),
  );
  protected readonly panelClass = computed(() =>
    cx('ar-dialog__panel', `ar-dialog__panel--${this.size()}`, `ar-dialog__panel--${this.currentTone()}`),
  );

  private readonly root = viewChild<ElementRef<HTMLElement>>('root');
  private readonly panel = viewChild<ElementRef<HTMLElement>>('panel');

  constructor() {
    // Portal: fixed overlays escape transformed or clipping ancestors, like React's createPortal.
    effect(() => {
      const el = this.root()?.nativeElement;
      if (!el || this.inline() || !this.platform.isBrowser) return;
      if (el.parentNode !== this.doc.body) this.doc.body.appendChild(el);
    });
    inject(DestroyRef).onDestroy(() => {
      const el = this.root()?.nativeElement;
      if (el && el.parentNode === this.doc.body) el.remove();
    });

    // Scroll lock, initial focus, Escape, focus trap, focus restore.
    effect((onCleanup) => {
      if (!this.open() || this.inline() || !this.platform.isBrowser) return;
      const doc = this.doc;
      const prev = doc.activeElement as HTMLElement | null;
      const body = doc.body;
      const overflow = body.style.overflow;
      body.style.overflow = 'hidden';
      const t = setTimeout(() => {
        const p = this.panel()?.nativeElement;
        const el = p && ((p.querySelector('[data-autofocus]') || p.querySelector(FOCUSABLE)) as HTMLElement | null);
        el?.focus();
      }, 30);
      const onKey = (ev: KeyboardEvent) => {
        if (ev.key === 'Escape' && this.dismissible()) {
          ev.stopPropagation();
          this.close();
        }
        const p = this.panel()?.nativeElement;
        if (ev.key === 'Tab' && p) {
          const f = p.querySelectorAll<HTMLElement>(FOCUSABLE);
          if (!f.length) return;
          const first = f[0];
          const last = f[f.length - 1];
          if (ev.shiftKey && doc.activeElement === first) {
            ev.preventDefault();
            last.focus();
          } else if (!ev.shiftKey && doc.activeElement === last) {
            ev.preventDefault();
            first.focus();
          }
        }
      };
      doc.addEventListener('keydown', onKey);
      onCleanup(() => {
        clearTimeout(t);
        body.style.overflow = overflow;
        doc.removeEventListener('keydown', onKey);
        prev?.focus?.();
      });
    });
  }

  ngOnInit(): void {
    this.ready.set(true);
  }

  close(): void {
    this.open.set(false);
    this.closed.emit();
  }

  protected onScrim(ev: MouseEvent): void {
    if (ev.target === ev.currentTarget && this.dismissible()) this.close();
  }
}
