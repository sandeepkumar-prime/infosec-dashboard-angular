import { Component, EventEmitter, Input, Output } from '@angular/core';

import { Severity, SeverityCount } from '../../../../core/models/security.models';
import { ChartSegment } from '../../../../shared/components/donut-chart/donut-chart.component';
import { SEVERITY_COLORS } from '../../../../shared/constants';

@Component({
  selector: 'app-risk-distribution',
  templateUrl: './risk-distribution.component.html',
  styleUrls: ['./risk-distribution.component.css']
})
export class RiskDistributionComponent {
  @Input() distribution: SeverityCount[] = [];
  @Input() total = 0;
  @Output() severitySelect = new EventEmitter<Severity>();

  readonly colors = SEVERITY_COLORS;

  get segments(): ChartSegment[] {
    return (this.distribution || []).map(d => ({
      label: d.severity,
      value: d.count,
      color: SEVERITY_COLORS[d.severity]
    }));
  }
}
