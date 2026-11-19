import { Component, EventEmitter, Input, Output } from '@angular/core';

import { SecurityAlert } from '../../../../core/models/security.models';

@Component({
  selector: 'app-recent-alerts',
  templateUrl: './recent-alerts.component.html',
  styleUrls: ['./recent-alerts.component.css']
})
export class RecentAlertsComponent {
  @Input() alerts: SecurityAlert[] = [];
  @Output() acknowledge = new EventEmitter<SecurityAlert>();

  /** Local UI state bound to a checkbox via [checked] + (change) (no ngModel). */
  unacknowledgedOnly = false;

  get visibleAlerts(): SecurityAlert[] {
    const list = this.alerts || [];
    return this.unacknowledgedOnly ? list.filter(a => !a.acknowledged) : list;
  }

  get pendingCount(): number {
    return (this.alerts || []).filter(a => !a.acknowledged).length;
  }

  toggleFilter(checked: boolean): void {
    this.unacknowledgedOnly = checked;
  }

  trackById(index: number, alert: SecurityAlert): string {
    return alert.id;
  }
}
