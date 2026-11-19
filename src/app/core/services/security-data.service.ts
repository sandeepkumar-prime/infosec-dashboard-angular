import { Inject, Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import { map } from 'rxjs/operators';

import { APP_CONFIG, AppConfig } from '../config/app-config';
import {
  ASSET_CATEGORIES,
  MONTHLY_TRENDS,
  SECURITY_ALERTS,
  SECURITY_DOMAINS,
  SECURITY_FINDINGS,
  SECURITY_INCIDENTS
} from '../data/mock-security-data';
import {
  AssetCategory,
  DashboardSummary,
  DomainSummary,
  Finding,
  FindingStatus,
  MonthlyTrend,
  SecurityAlert,
  SecurityIncident,
  SEVERITIES,
  SeverityCount
} from '../models/security.models';

/** Statuses that count as an "open risk". */
export const OPEN_STATUSES: FindingStatus[] = ['Open', 'In Progress'];

/**
 * Central store for all security data. Holds mutable state (findings and
 * alerts) in BehaviorSubjects so that changes made on the Reports page
 * (status updates) are reflected on the Dashboard immediately.
 */
@Injectable({ providedIn: 'root' })
export class SecurityDataService {
  private readonly findingsSubject: BehaviorSubject<Finding[]>;
  private readonly alertsSubject: BehaviorSubject<SecurityAlert[]>;

  readonly findings$: Observable<Finding[]>;
  readonly alerts$: Observable<SecurityAlert[]>;

  constructor(@Inject(APP_CONFIG) private config: AppConfig) {
    // Deep copy so the mock constants are never mutated.
    this.findingsSubject = new BehaviorSubject<Finding[]>(JSON.parse(JSON.stringify(SECURITY_FINDINGS)));
    this.alertsSubject = new BehaviorSubject<SecurityAlert[]>(JSON.parse(JSON.stringify(SECURITY_ALERTS)));
    this.findings$ = this.findingsSubject.asObservable();
    this.alerts$ = this.alertsSubject.asObservable();
  }

  // ---------------------------------------------------------------- findings

  getFindingsSnapshot(): Finding[] {
    return this.findingsSubject.value;
  }

  getFindingById(id: string): Observable<Finding | undefined> {
    return this.findings$.pipe(map(list => list.find(f => f.id === id)));
  }

  isOpen(finding: Finding): boolean {
    return OPEN_STATUSES.indexOf(finding.status) !== -1;
  }

  /** A finding is overdue when it is still open and its due date is before the reference date. */
  isOverdue(finding: Finding): boolean {
    const today = this.config.referenceDate.substring(0, 10);
    return this.isOpen(finding) && finding.dueDate < today;
  }

  /**
   * Updates the status of a finding and appends an entry to its history.
   * Returns the updated finding, or undefined if the id is unknown.
   */
  updateFindingStatus(id: string, status: FindingStatus, comment: string): Finding | undefined {
    let updated: Finding | undefined;
    const now = new Date().toISOString();
    const next = this.findingsSubject.value.map(f => {
      if (f.id !== id) {
        return f;
      }
      updated = {
        ...f,
        status,
        lastUpdated: now,
        history: [...f.history, { date: now, status, comment: comment.trim(), updatedBy: this.config.currentUser }]
      };
      return updated;
    });
    this.findingsSubject.next(next);
    return updated;
  }

  // ------------------------------------------------------------------ alerts

  getRecentAlerts(limit: number): Observable<SecurityAlert[]> {
    return this.alerts$.pipe(
      map(alerts => [...alerts]
        .sort((a, b) => b.timestamp.localeCompare(a.timestamp))
        .slice(0, limit))
    );
  }

  acknowledgeAlert(id: string): void {
    this.alertsSubject.next(
      this.alertsSubject.value.map(a => (a.id === id ? { ...a, acknowledged: true } : a))
    );
  }

  // ------------------------------------------------------------ static data

  getIncidents(): SecurityIncident[] {
    return SECURITY_INCIDENTS;
  }

  getAssetCategories(): AssetCategory[] {
    return ASSET_CATEGORIES;
  }

  getMonthlyTrends(): MonthlyTrend[] {
    return MONTHLY_TRENDS;
  }

  // ------------------------------------------------------- derived (dashboard)

  getDashboardSummary(): Observable<DashboardSummary> {
    return this.findings$.pipe(
      map(findings => {
        const open = findings.filter(f => this.isOpen(f));
        const openBySeverity = { Critical: 0, High: 0, Medium: 0, Low: 0 };
        open.forEach(f => openBySeverity[f.severity]++);

        const totalAssets = ASSET_CATEGORIES.reduce((sum, c) => sum + c.count, 0);
        const monitoredAssets = ASSET_CATEGORIES.reduce((sum, c) => sum + c.monitored, 0);
        const postureScore = Math.round(
          SECURITY_DOMAINS.reduce((sum, d) => sum + d.score, 0) / SECURITY_DOMAINS.length
        );

        return {
          totalAssets,
          monitoredAssets,
          coverage: monitoredAssets / totalAssets,
          openBySeverity,
          openFindings: open.length,
          openIncidents: SECURITY_INCIDENTS.filter(i => i.status !== 'Closed').length,
          resolvedIssues: findings.filter(f => f.status === 'Resolved').length,
          overdueFindings: open.filter(f => this.isOverdue(f)).length,
          postureScore
        };
      })
    );
  }

  /** Distribution of OPEN findings by severity. */
  getSeverityDistribution(): Observable<SeverityCount[]> {
    return this.findings$.pipe(
      map(findings => {
        const open = findings.filter(f => this.isOpen(f));
        const total = open.length;
        return SEVERITIES.map(severity => {
          const count = open.filter(f => f.severity === severity).length;
          return { severity, count, percent: total ? count / total : 0 };
        });
      })
    );
  }

  getDomainSummaries(): Observable<DomainSummary[]> {
    return this.findings$.pipe(
      map(findings => SECURITY_DOMAINS.map(d => ({
        ...d,
        openFindings: findings.filter(f => f.domain === d.name && this.isOpen(f)).length
      })))
    );
  }
}
