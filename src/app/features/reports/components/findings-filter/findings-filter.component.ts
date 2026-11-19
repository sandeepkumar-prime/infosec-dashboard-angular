import {
  Component,
  ElementRef,
  EventEmitter,
  HostListener,
  Input,
  OnChanges,
  Output,
  ViewChild
} from '@angular/core';

import {
  FINDING_STATUSES,
  FindingFilter,
  SEVERITIES
} from '../../../../core/models/security.models';

/**
 * Template-driven filter form (ngModel). Works on a local copy of the filter
 * and emits the whole filter object on every change.
 */
@Component({
  selector: 'app-findings-filter',
  templateUrl: './findings-filter.component.html',
  styleUrls: ['./findings-filter.component.css']
})
export class FindingsFilterComponent implements OnChanges {
  @Input() filter: FindingFilter;
  @Output() filterChange = new EventEmitter<FindingFilter>();
  @Output() reset = new EventEmitter<void>();

  @ViewChild('searchInput', { static: true }) searchInput: ElementRef<HTMLInputElement>;

  model: FindingFilter;
  readonly severities = SEVERITIES;
  readonly statuses = FINDING_STATUSES;

  ngOnChanges(): void {
    this.model = { ...this.filter };
  }

  get hasActiveFilters(): boolean {
    return !!this.model.search || this.model.severity !== 'All' ||
      this.model.status !== 'All' || this.model.overdueOnly;
  }

  emitChange(): void {
    this.filterChange.emit({ ...this.model });
  }

  clearSearch(): void {
    this.model.search = '';
    this.emitChange();
    this.searchInput.nativeElement.focus();
  }

  /** Keyboard shortcut: "/" focuses the search box (unless already typing). */
  @HostListener('document:keydown', ['$event'])
  onKeydown(event: KeyboardEvent): void {
    const target = event.target as HTMLElement;
    const typing = target && ['INPUT', 'TEXTAREA', 'SELECT'].indexOf(target.tagName) !== -1;
    if (event.key === '/' && !typing) {
      event.preventDefault();
      this.searchInput.nativeElement.focus();
    }
  }
}
