import { Component, Input } from '@angular/core';

import { FindingStatus } from '../../../core/models/security.models';
import { STATUS_CLASSES } from '../../constants';

@Component({
  selector: 'app-status-badge',
  template: `<span class="status" [ngClass]="cssClass"><span class="dot"></span>{{ status }}</span>`,
  styleUrls: ['./status-badge.component.css']
})
export class StatusBadgeComponent {
  @Input() status: FindingStatus;

  get cssClass(): string {
    return STATUS_CLASSES[this.status] || '';
  }
}
