import { Component, Input } from '@angular/core';

import { DomainSummary } from '../../../../core/models/security.models';
import { SCORE_COLORS, scoreLevel } from '../../../../shared/directives/score-color.directive';

@Component({
  selector: 'app-domain-overview',
  templateUrl: './domain-overview.component.html',
  styleUrls: ['./domain-overview.component.css']
})
export class DomainOverviewComponent {
  @Input() domains: DomainSummary[] = [];

  barColor(score: number): string {
    return SCORE_COLORS[scoreLevel(score)];
  }

  trackByName(index: number, domain: DomainSummary): string {
    return domain.name;
  }
}
