import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { Observable } from 'rxjs';

import {
  AssetCategory,
  DashboardSummary,
  DomainSummary,
  MonthlyTrend,
  SecurityAlert,
  SecurityIncident,
  Severity,
  SeverityCount
} from '../../core/models/security.models';
import { NotificationService } from '../../core/services/notification.service';
import { SecurityDataService } from '../../core/services/security-data.service';

/** Page 1 - Security Dashboard (container component). */
@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.css']
})
export class DashboardComponent {
  static readonly RECENT_ALERT_LIMIT = 6;

  readonly summary$: Observable<DashboardSummary>;
  readonly distribution$: Observable<SeverityCount[]>;
  readonly domains$: Observable<DomainSummary[]>;
  readonly alerts$: Observable<SecurityAlert[]>;
  readonly trends: MonthlyTrend[];
  readonly assetCategories: AssetCategory[];
  readonly activeIncidents: SecurityIncident[];

  constructor(
    private dataService: SecurityDataService,
    private notifications: NotificationService,
    private router: Router
  ) {
    this.summary$ = dataService.getDashboardSummary();
    this.distribution$ = dataService.getSeverityDistribution();
    this.domains$ = dataService.getDomainSummaries();
    this.alerts$ = dataService.getRecentAlerts(DashboardComponent.RECENT_ALERT_LIMIT);
    this.trends = dataService.getMonthlyTrends();
    this.assetCategories = dataService.getAssetCategories();
    this.activeIncidents = dataService.getIncidents().filter(i => i.status !== 'Closed');
  }

  /** KPI drill-down: open the Reports page pre-filtered by severity. */
  viewSeverity(severity: Severity): void {
    this.router.navigate(['/reports'], { queryParams: { severity } });
  }

  viewResolved(): void {
    this.router.navigate(['/reports'], { queryParams: { status: 'Resolved' } });
  }

  viewOverdue(): void {
    this.router.navigate(['/reports'], { queryParams: { overdue: 'true' } });
  }

  onAcknowledge(alert: SecurityAlert): void {
    this.dataService.acknowledgeAlert(alert.id);
    this.notifications.show(`Alert ${alert.id} acknowledged`, 'info');
  }

  trackByIncident(index: number, incident: SecurityIncident): string {
    return incident.id;
  }
}
