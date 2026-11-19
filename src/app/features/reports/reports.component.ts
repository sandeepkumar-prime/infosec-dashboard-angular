import { Component, OnDestroy, OnInit } from '@angular/core';
import { ActivatedRoute, NavigationEnd, ParamMap, Router } from '@angular/router';
import { BehaviorSubject, combineLatest, Observable, Subject } from 'rxjs';
import { filter, map, startWith, takeUntil } from 'rxjs/operators';

import {
  Finding,
  FINDING_STATUSES,
  FindingFilter,
  FindingStatus,
  Severity,
  SEVERITIES,
  SortColumn,
  SortState
} from '../../core/models/security.models';
import { CsvExportService } from '../../core/services/csv-export.service';
import { DEFAULT_FILTER, DEFAULT_SORT, FindingQueryService } from '../../core/services/finding-query.service';
import { NotificationService } from '../../core/services/notification.service';
import { SecurityDataService } from '../../core/services/security-data.service';

interface ReportView {
  rows: Finding[];
  total: number;
}

/** Page 2 - Security Reports (container component). */
@Component({
  selector: 'app-reports',
  templateUrl: './reports.component.html',
  styleUrls: ['./reports.component.css']
})
export class ReportsComponent implements OnInit, OnDestroy {
  readonly filter$ = new BehaviorSubject<FindingFilter>({ ...DEFAULT_FILTER });
  readonly sort$ = new BehaviorSubject<SortState>({ ...DEFAULT_SORT });
  readonly view$: Observable<ReportView>;

  selectedId: string | null = null;
  private currentRows: Finding[] = [];
  private readonly destroy$ = new Subject<void>();

  constructor(
    private dataService: SecurityDataService,
    private queryService: FindingQueryService,
    private csvService: CsvExportService,
    private notifications: NotificationService,
    private route: ActivatedRoute,
    private router: Router
  ) {
    this.view$ = combineLatest([dataService.findings$, this.filter$, this.sort$]).pipe(
      map(([findings, f, s]) => ({ rows: queryService.apply(findings, f, s), total: findings.length }))
    );
  }

  ngOnInit(): void {
    // Keep a reference to the visible rows for CSV export.
    this.view$.pipe(takeUntil(this.destroy$)).subscribe(view => (this.currentRows = view.rows));

    // Query params (e.g. from dashboard drill-down) pre-set the filters.
    this.route.queryParamMap
      .pipe(takeUntil(this.destroy$))
      .subscribe(params => this.applyQueryParams(params));

    // Track which finding is open in the child route (/reports/:id).
    this.router.events
      .pipe(
        filter(e => e instanceof NavigationEnd),
        startWith(null),
        takeUntil(this.destroy$)
      )
      .subscribe(() => {
        const child = this.route.firstChild;
        this.selectedId = child ? child.snapshot.paramMap.get('id') : null;
      });
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }

  get filter(): FindingFilter {
    return this.filter$.value;
  }

  get sort(): SortState {
    return this.sort$.value;
  }

  onFilterChange(next: FindingFilter): void {
    this.filter$.next({ ...next });
  }

  onResetFilters(): void {
    this.filter$.next({ ...DEFAULT_FILTER });
    // Drop drill-down query params so the URL matches the cleared filters.
    this.router.navigate([], { relativeTo: this.route.firstChild || this.route, queryParams: {} });
  }

  onSortChange(column: SortColumn): void {
    this.sort$.next(this.queryService.nextSort(this.sort$.value, column));
  }

  onSelect(finding: Finding): void {
    this.router.navigate([finding.id], { relativeTo: this.route, queryParamsHandling: 'preserve' });
  }

  exportCsv(): void {
    if (!this.currentRows.length) {
      this.notifications.show('No findings to export', 'error');
      return;
    }
    const fileName = this.csvService.download(this.currentRows);
    this.notifications.show(`Exported ${this.currentRows.length} findings to ${fileName}`, 'success');
  }

  /** Query params fully define the initial filter; no params means default filters. */
  private applyQueryParams(params: ParamMap): void {
    const severity = params.get('severity') as Severity;
    const status = params.get('status') as FindingStatus;
    this.filter$.next({
      ...DEFAULT_FILTER,
      severity: SEVERITIES.indexOf(severity) !== -1 ? severity : 'All',
      status: FINDING_STATUSES.indexOf(status) !== -1 ? status : 'All',
      overdueOnly: params.get('overdue') === 'true'
    });
  }
}
