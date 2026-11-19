import { TestBed } from '@angular/core/testing';
import { take } from 'rxjs/operators';

import { APP_CONFIG, DEFAULT_APP_CONFIG } from '../config/app-config';
import { DashboardSummary, SeverityCount } from '../models/security.models';
import { SecurityDataService } from './security-data.service';

describe('SecurityDataService', () => {
  let service: SecurityDataService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [{ provide: APP_CONFIG, useValue: DEFAULT_APP_CONFIG }]
    });
    service = TestBed.inject(SecurityDataService);
  });

  function summary(): DashboardSummary {
    let result: DashboardSummary;
    service.getDashboardSummary().pipe(take(1)).subscribe(s => (result = s));
    return result;
  }

  it('loads 30 findings from mock data', () => {
    expect(service.getFindingsSnapshot().length).toBe(30);
  });

  it('computes dashboard KPIs from mock data', () => {
    const s = summary();
    expect(s.totalAssets).toBe(3427);
    expect(s.monitoredAssets).toBe(3309);
    expect(s.openBySeverity).toEqual({ Critical: 4, High: 6, Medium: 7, Low: 4 });
    expect(s.openFindings).toBe(21);
    expect(s.openIncidents).toBe(5);
    expect(s.resolvedIssues).toBe(6);
    expect(s.overdueFindings).toBe(4);
    expect(s.postureScore).toBe(75);
  });

  it('computes severity distribution of open findings', () => {
    let dist: SeverityCount[];
    service.getSeverityDistribution().pipe(take(1)).subscribe(d => (dist = d));
    expect(dist.map(d => d.count)).toEqual([4, 6, 7, 4]);
    expect(dist[2].percent).toBeCloseTo(7 / 21, 5);
  });

  it('flags overdue findings relative to the reference date', () => {
    const overdue = service.getFindingsSnapshot().filter(f => service.isOverdue(f)).map(f => f.id);
    expect(overdue).toEqual(['F-1001', 'F-1006', 'F-1013', 'F-1020']);
  });

  it('updates finding status, appends history and refreshes KPIs', () => {
    const updated = service.updateFindingStatus('F-1001', 'Resolved', 'Patched Struts to latest');
    expect(updated.status).toBe('Resolved');
    expect(updated.history.length).toBe(2);
    expect(updated.history[1].comment).toBe('Patched Struts to latest');

    const s = summary();
    expect(s.openBySeverity.Critical).toBe(3);
    expect(s.resolvedIssues).toBe(7);
    expect(s.overdueFindings).toBe(3);
  });

  it('returns undefined when updating an unknown finding', () => {
    expect(service.updateFindingStatus('F-9999', 'Resolved', 'nothing here')).toBeUndefined();
  });

  it('returns the 6 most recent alerts and acknowledges one', () => {
    let ids: string[];
    service.getRecentAlerts(6).pipe(take(1)).subscribe(a => (ids = a.map(x => x.id)));
    expect(ids).toEqual(['ALT-9921', 'ALT-9919', 'ALT-9914', 'ALT-9908', 'ALT-9902', 'ALT-9897']);

    service.acknowledgeAlert('ALT-9921');
    let acked: boolean;
    service.getRecentAlerts(1).pipe(take(1)).subscribe(a => (acked = a[0].acknowledged));
    expect(acked).toBe(true);
  });
});
