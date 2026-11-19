import { TestBed } from '@angular/core/testing';

import { APP_CONFIG, DEFAULT_APP_CONFIG } from '../config/app-config';
import { SECURITY_FINDINGS } from '../data/mock-security-data';
import { DEFAULT_FILTER, DEFAULT_SORT, FindingQueryService } from './finding-query.service';

describe('FindingQueryService', () => {
  let service: FindingQueryService;
  const all = SECURITY_FINDINGS;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [{ provide: APP_CONFIG, useValue: DEFAULT_APP_CONFIG }]
    });
    service = TestBed.inject(FindingQueryService);
  });

  const ids = (list: { id: string }[]) => list.map(f => f.id);

  it('returns everything with the default filter', () => {
    expect(service.filter(all, DEFAULT_FILTER).length).toBe(30);
  });

  it('searches case-insensitively across id, title, asset, owner and domain', () => {
    expect(ids(service.filter(all, { ...DEFAULT_FILTER, search: 'SQL' }))).toEqual(['F-1005']);
    expect(service.filter(all, { ...DEFAULT_FILTER, search: 'priya' }).length).toBe(6);
    expect(ids(service.filter(all, { ...DEFAULT_FILTER, search: 'web-app' })))
      .toEqual(['F-1001', 'F-1011', 'F-1016', 'F-1029']);
    expect(service.filter(all, { ...DEFAULT_FILTER, search: '  f-1010 ' }).length).toBe(1);
  });

  it('filters by severity and status', () => {
    expect(service.filter(all, { ...DEFAULT_FILTER, severity: 'Critical' }).length).toBe(5);
    expect(service.filter(all, { ...DEFAULT_FILTER, status: 'Open' }).length).toBe(15);
    expect(ids(service.filter(all, { ...DEFAULT_FILTER, severity: 'Critical', status: 'Open' })))
      .toEqual(['F-1001', 'F-1003']);
  });

  it('filters overdue only', () => {
    expect(ids(service.filter(all, { ...DEFAULT_FILTER, overdueOnly: true, severity: 'High' })))
      .toEqual(['F-1006', 'F-1013']);
  });

  it('default sort is severity descending with id tie-break', () => {
    const sorted = service.sort(all, DEFAULT_SORT);
    expect(sorted[0].id).toBe('F-1001');
    expect(sorted[sorted.length - 1].id).toBe('F-1030');
    expect(sorted[0].severity).toBe('Critical');
  });

  it('sorts by CVSS descending', () => {
    const sorted = service.sort(all, { column: 'cvssScore', direction: 'desc' });
    expect(ids(sorted.slice(0, 3))).toEqual(['F-1001', 'F-1005', 'F-1002']);
  });

  it('toggles direction on the same column and resets to asc on a new column', () => {
    expect(service.nextSort({ column: 'title', direction: 'asc' }, 'title').direction).toBe('desc');
    expect(service.nextSort({ column: 'title', direction: 'desc' }, 'dueDate'))
      .toEqual({ column: 'dueDate', direction: 'asc' });
  });
});
