import { Component, Input } from '@angular/core';

import { Severity } from '../../../core/models/security.models';

@Component({
  selector: 'app-severity-badge',
  template: `<span class="badge" [ngClass]="'badge-' + (severity | lowercase)">{{ severity }}</span>`,
  styleUrls: ['./severity-badge.component.css']
})
export class SeverityBadgeComponent {
  @Input() severity: Severity;
}
