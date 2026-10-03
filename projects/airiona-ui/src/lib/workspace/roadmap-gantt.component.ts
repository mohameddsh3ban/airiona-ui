import { ChangeDetectionStrategy, Component, computed, input, output } from '@angular/core';
import { ArButton } from '../actions/button.component';
import { ArAvatarStack, ArWidgetTone, widgetClass } from '../core/primitives';

export interface ArGanttTask {
  label: string;
  /** Day units from 0; halves allowed. */
  start: number;
  end: number;
  /** 0–1 */
  progress?: number;
  tone?: 'done' | 'muted' | 'brand';
  people?: string[];
}

/**
 * Project roadmap: a title with an "Add task" button, day columns, a today line and task bars with
 * progress and assignees.
 *
 * ```html
 * <ar-roadmap-gantt title="Property launch" [days]="['Mon 12', 'Tue 13']" [today]="1" [tasks]="tasks" (add)="addTask()" />
 * ```
 */
@Component({
  selector: 'ar-roadmap-gantt',
  imports: [ArButton, ArAvatarStack],
  changeDetection: ChangeDetectionStrategy.OnPush,
  host: {
    '[class]': 'hostClass()',
    '[attr.aria-label]': 'ariaLabel() || null',
    '[attr.role]': 'ariaLabel() ? "region" : null',
    '[attr.title]': 'null',
  },
  template: `
    <div class="ar-w__row" style="align-items: flex-start">
      <h3 class="ar-meet__title">{{ title() || 'Project Roadmap' }}</h3>
      <button arButton variant="primary" iconStart="plus" (click)="add.emit()">{{ addLabel() || 'Add task' }}</button>
    </div>
    <div class="ar-gantt__board" [style.--n]="n()">
      @for (d of days(); track $index) {
        <i class="ar-gantt__line" [style.left.%]="(($index + 0.5) / n()) * 100"></i>
      }
      @if (today() !== undefined) {
        <span class="ar-gantt__today" [style.left.%]="((today()! + 0.5) / n()) * 100"></span>
      }
      @for (t of rows(); track t.label) {
        <div class="ar-gantt__row">
          <div [class]="'ar-gantt__bar is-' + t.tone" [style.left.%]="t.left" [style.width.%]="t.width">
            <div class="ar-gantt__done" [style.width.%]="t.progress * 100">
              <span>{{ t.label }}</span><b>{{ t.percent }}%</b>
              @if (t.inside) {
                <span class="ar-gantt__inpeople"><ar-avatar-stack [people]="t.people" size="xs" [max]="3" /></span>
              }
            </div>
            @if (t.outside) {
              <span class="ar-gantt__people"><ar-avatar-stack [people]="t.people" size="xs" [max]="3" /></span>
            }
          </div>
        </div>
      }
    </div>
    <div class="ar-gantt__days" [style.--n]="n()">
      @for (d of days(); track $index) {
        <span [class]="$index === today() ? 'is-today' : ''">{{ d }}</span>
      }
    </div>
  `,
})
export class ArRoadmapGantt {
  readonly tone = input<ArWidgetTone>('light');
  readonly ariaLabel = input<string>();
  /** Default "Project Roadmap". */
  readonly title = input<string>();
  readonly days = input<string[]>([]);
  /** Index of today's column. */
  readonly today = input<number>();
  readonly tasks = input<ArGanttTask[]>([]);
  /** Default "Add task". */
  readonly addLabel = input<string>();
  readonly add = output<void>();

  protected readonly n = computed(() => this.days().length);
  protected readonly rows = computed(() => {
    const n = this.n();
    return this.tasks().map((t) => {
      const progress = t.progress || 0;
      const people = t.people ?? [];
      return {
        label: t.label,
        tone: t.tone || 'muted',
        left: (t.start / n) * 100,
        width: ((t.end - t.start) / n) * 100,
        progress,
        percent: Math.round(progress * 100),
        people,
        inside: people.length > 0 && progress >= 0.95,
        outside: people.length > 0 && progress < 0.95,
      };
    });
  });
  protected readonly hostClass = computed(() => widgetClass(this.tone(), 'ar-gantt'));
}
