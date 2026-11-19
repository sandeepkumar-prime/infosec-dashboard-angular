import { Component, EventEmitter, Input, Output } from '@angular/core';

import { Finding, SortColumn, SortState } from '../../../../core/models/security.models';
import { SecurityDataService } from '../../../../core/services/security-data.service';

interface ColumnDef {
  key: SortColumn;
  label: string;
  cssClass?: string;
}

/** Presentational table: renders rows, emits sort and selection events. */
@Component({
  selector: 'app-findings-table',
  templateUrl: './findings-table.component.html',
  styleUrls: ['./findings-table.component.css']
})
export class FindingsTableComponent {
  @Input() findings: Finding[] = [];
  @Input() sort: SortState;
  @Input() selectedId: string | null = null;

  @Output() sortChange = new EventEmitter<SortColumn>();
  @Output() rowSelect = new EventEmitter<Finding>();

  readonly columns: ColumnDef[] = [
    { key: 'id', label: 'ID', cssClass: 'col-id' },
    { key: 'title', label: 'Finding' },
    { key: 'severity', label: 'Severity' },
    { key: 'status', label: 'Status' },
    { key: 'domain', label: 'Domain' },
    { key: 'cvssScore', label: 'CVSS', cssClass: 'col-num' },
    { key: 'discoveredOn', label: 'Discovered' },
    { key: 'dueDate', label: 'Due Date' }
  ];

  constructor(private dataService: SecurityDataService) {}

  isOverdue(finding: Finding): boolean {
    return this.dataService.isOverdue(finding);
  }

  sortIndicator(column: SortColumn): string {
    if (!this.sort || this.sort.column !== column) {
      return '↕';
    }
    return this.sort.direction === 'asc' ? '▲' : '▼';
  }

  ariaSort(column: SortColumn): string {
    if (!this.sort || this.sort.column !== column) {
      return 'none';
    }
    return this.sort.direction === 'asc' ? 'ascending' : 'descending';
  }

  trackById(index: number, finding: Finding): string {
    return finding.id;
  }
}
