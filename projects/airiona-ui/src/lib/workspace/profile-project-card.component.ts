import { ChangeDetectionStrategy, Component, booleanAttribute, computed, input, model, output } from '@angular/core';
import { ArIconButton } from '../actions/icon-button.component';
import { ArAvatar, ArWidgetTone, widgetClass } from '../core/primitives';
import { clamp } from '../core/utils';
import { ArSelect, ArSelectOption } from '../forms/select.component';
import { ArNotch } from './notch.component';

export interface ArProfilePerson {
  name: string;
  role?: string;
  avatar?: string;
}

/**
 * Brand card with a person, the project they own, its progress, a report picker and a send button,
 * with notification and info buttons sitting in a notch cut from the top-right corner.
 *
 * ```html
 * <ar-profile-project-card [person]="{ name: 'Lina Park', role: 'Revenue manager' }" project="Nordic Pine Lodge"
 *   meta="Boutique cabins" [progress]="0.34" [reports]="reports" [(report)]="report" (send)="sendReport()" />
 * ```
 */
@Component({
  selector: 'ar-profile-project-card',
  imports: [ArAvatar, ArIconButton, ArNotch, ArSelect],
  changeDetection: ChangeDetectionStrategy.OnPush,
  host: { '[class]': 'hostClass()', '[attr.role]': 'ariaLabel() ? "region" : null', '[attr.aria-label]': 'ariaLabel() || null' },
  template: `
    <div class="ar-profile__person">
      <ar-avatar [name]="person().name" [src]="person().avatar" size="lg" />
      <div class="ar-w__titles"><b>{{ person().name }}</b><span>{{ person().role }}</span></div>
    </div>
    <ar-notch corner="tr">
      <button arIconButton icon="bell" variant="white" label="Notifications" [badge]="unread()" (click)="notifications.emit()"></button>
      <button arIconButton icon="information-circle" variant="white" label="Project details" (click)="details.emit()"></button>
    </ar-notch>
    <b class="ar-profile__project">{{ project() }}</b>
    <span class="ar-profile__meta">{{ metaLabel() }}: <b>{{ meta() }}</b></span>
    <div class="ar-profile__progress">
      <div class="ar-profile__track" role="progressbar" [attr.aria-valuenow]="percent()" aria-valuemin="0" aria-valuemax="100" [attr.aria-label]="progressLabel()">
        <i [style.width.%]="percent()"></i>
      </div>
      <div class="ar-w__row"><span>{{ progressLabel() }}</span><b>{{ percent() }}%</b></div>
    </div>
    <div class="ar-profile__actions">
      <ar-select class="ar-profile__select" size="sm" iconStart="document-text" [placeholder]="reportPlaceholder()" [options]="reports()" [(value)]="report" />
      <button arIconButton icon="paper-airplane" variant="ink" size="lg" [label]="sendLabel()" (click)="send.emit(report())"></button>
    </div>
  `,
})
export class ArProfileProjectCard {
  readonly tone = input<ArWidgetTone>('brand');
  readonly ariaLabel = input<string>();
  readonly person = input<ArProfilePerson>({ name: '' });
  readonly project = input<string>();
  readonly meta = input<string>();
  readonly metaLabel = input('Industry');
  /** 0–1 */
  readonly progress = input(0);
  readonly progressLabel = input('Project progress');
  readonly reports = input<Array<string | ArSelectOption>>([]);
  readonly reportPlaceholder = input('Select a report');
  readonly sendLabel = input('Send report');
  readonly unread = input(false, { transform: booleanAttribute });
  /** The chosen report. */
  readonly report = model<string | null>(null);
  readonly send = output<string | null>();
  readonly notifications = output<void>();
  readonly details = output<void>();

  protected readonly percent = computed(() => Math.round(clamp(this.progress() || 0, 0, 1) * 100));
  protected readonly hostClass = computed(() => widgetClass(this.tone(), 'ar-profile'));
}
