import { Component, Input } from '@angular/core';

import { MonthlyTrend } from '../../../../core/models/security.models';
import { BarGroup, BarSeries } from '../../../../shared/components/bar-chart/bar-chart.component';

@Component({
  selector: 'app-incident-trend',
  template: `
    <app-bar-chart [series]="series" [groups]="groups"></app-bar-chart>
    <p class="trend-summary">
      Net change over period:
      <strong [class.text-good]="netChange <= 0" [class.text-bad]="netChange > 0">
        {{ netChange > 0 ? '+' : '' }}{{ netChange }} findings
      </strong>
    </p>`,
  styles: [`
    .trend-summary { margin: 12px 0 0; font-size: 13px; color: var(--text-muted); }
    .text-good { color: var(--success); }
    .text-bad { color: var(--sev-critical); }
  `]
})
export class IncidentTrendComponent {
  @Input() trends: MonthlyTrend[] = [];

  readonly series: BarSeries[] = [
    { name: 'Detected', color: '#3f6fb5' },
    { name: 'Resolved', color: '#2ec4b6' }
  ];

  get groups(): BarGroup[] {
    return this.trends.map(t => ({ label: t.month, values: [t.detected, t.resolved] }));
  }

  /** Detected minus resolved across all months (positive = backlog growing). */
  get netChange(): number {
    return this.trends.reduce((sum, t) => sum + t.detected - t.resolved, 0);
  }
}
