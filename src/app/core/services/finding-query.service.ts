import { Injectable } from '@angular/core';

import {
  Finding,
  FindingFilter,
  SEVERITY_RANK,
  SortColumn,
  SortState
} from '../models/security.models';
import { SecurityDataService } from './security-data.service';

export const DEFAULT_FILTER: FindingFilter = {
  search: '',
  severity: 'All',
  status: 'All',
  overdueOnly: false
};

export const DEFAULT_SORT: SortState = { column: 'severity', direction: 'desc' };

/**
 * Stateless search / filter / sort logic for the findings table.
 * Kept free of UI concerns so that it can be unit tested and migrated as-is.
 */
@Injectable({ providedIn: 'root' })
export class FindingQueryService {
  constructor(private dataService: SecurityDataService) {}

  /** Case-insensitive match against id, title, asset, owner and domain. */
  matchesSearch(finding: Finding, search: string): boolean {
    const term = (search || '').trim().toLowerCase();
    if (!term) {
      return true;
    }
    return [finding.id, finding.title, finding.asset, finding.owner, finding.domain]
      .some(value => value.toLowerCase().indexOf(term) !== -1);
  }

  filter(findings: Finding[], filter: FindingFilter): Finding[] {
    return findings.filter(f =>
      this.matchesSearch(f, filter.search) &&
      (filter.severity === 'All' || f.severity === filter.severity) &&
      (filter.status === 'All' || f.status === filter.status) &&
      (!filter.overdueOnly || this.dataService.isOverdue(f))
    );
  }

  /** Returns a new sorted array. Ties are always broken by id ascending. */
  sort(findings: Finding[], sort: SortState): Finding[] {
    const factor = sort.direction === 'asc' ? 1 : -1;
    return [...findings].sort((a, b) => {
      const result = this.compare(a, b, sort.column);
      return result !== 0 ? result * factor : a.id.localeCompare(b.id);
    });
  }

  apply(findings: Finding[], filter: FindingFilter, sort: SortState): Finding[] {
    return this.sort(this.filter(findings, filter), sort);
  }

  /** Clicking the active column toggles direction; a new column starts ascending. */
  nextSort(current: SortState, column: SortColumn): SortState {
    if (current.column === column) {
      return { column, direction: current.direction === 'asc' ? 'desc' : 'asc' };
    }
    return { column, direction: 'asc' };
  }

  private compare(a: Finding, b: Finding, column: SortColumn): number {
    switch (column) {
      case 'severity':
        return SEVERITY_RANK[a.severity] - SEVERITY_RANK[b.severity];
      case 'cvssScore':
        return a.cvssScore - b.cvssScore;
      default:
        return String(a[column]).localeCompare(String(b[column]));
    }
  }
}
