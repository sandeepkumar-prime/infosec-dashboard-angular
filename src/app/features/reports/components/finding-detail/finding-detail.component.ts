import { Component, HostListener, OnDestroy, OnInit } from '@angular/core';
import {
  AbstractControl,
  FormBuilder,
  FormGroup,
  ValidationErrors,
  ValidatorFn,
  Validators
} from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { Subject } from 'rxjs';
import { map, switchMap, takeUntil } from 'rxjs/operators';

import { Finding, FINDING_STATUSES, FindingStatus } from '../../../../core/models/security.models';
import { NotificationService } from '../../../../core/services/notification.service';
import { SecurityDataService } from '../../../../core/services/security-data.service';

export const COMMENT_MIN_LENGTH = 10;
export const COMMENT_MAX_LENGTH = 300;

/** Form-level validator: the selected status must differ from the current one. */
export function statusChangedValidator(getCurrent: () => FindingStatus | undefined): ValidatorFn {
  return (group: AbstractControl): ValidationErrors | null => {
    const status = group.get('status');
    return status && status.value === getCurrent() ? { statusUnchanged: true } : null;
  };
}

/**
 * Detail drawer for one finding (route: /reports/:id).
 * Contains a reactive form for basic status updates.
 */
@Component({
  selector: 'app-finding-detail',
  templateUrl: './finding-detail.component.html',
  styleUrls: ['./finding-detail.component.css']
})
export class FindingDetailComponent implements OnInit, OnDestroy {
  finding: Finding | undefined;
  notFoundId: string | null = null;
  readonly statuses = FINDING_STATUSES;
  readonly commentMax = COMMENT_MAX_LENGTH;
  readonly commentMin = COMMENT_MIN_LENGTH;

  readonly form: FormGroup;
  private readonly destroy$ = new Subject<void>();

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private dataService: SecurityDataService,
    private notifications: NotificationService,
    fb: FormBuilder
  ) {
    this.form = fb.group(
      {
        status: ['', Validators.required],
        comment: ['', [
          Validators.required,
          Validators.minLength(COMMENT_MIN_LENGTH),
          Validators.maxLength(COMMENT_MAX_LENGTH)
        ]]
      },
      { validators: statusChangedValidator(() => (this.finding ? this.finding.status : undefined)) }
    );
  }

  ngOnInit(): void {
    this.route.paramMap
      .pipe(
        map(params => params.get('id')),
        switchMap(id => this.dataService.getFindingById(id).pipe(map(finding => ({ id, finding })))),
        takeUntil(this.destroy$)
      )
      .subscribe(({ id, finding }) => {
        const changedFinding = !this.finding || !finding || this.finding.id !== finding.id;
        this.finding = finding;
        this.notFoundId = finding ? null : id;
        if (finding && changedFinding) {
          this.form.reset({ status: finding.status, comment: '' });
        }
        this.form.updateValueAndValidity();
      });
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }

  get commentLength(): number {
    return (this.form.get('comment').value || '').length;
  }

  isOverdue(): boolean {
    return !!this.finding && this.dataService.isOverdue(this.finding);
  }

  showError(controlName: string): boolean {
    const control = this.form.get(controlName);
    return control.invalid && (control.dirty || control.touched);
  }

  submit(): void {
    if (!this.finding || this.form.invalid) {
      this.form.markAllAsTouched();
      return;
    }
    const { status, comment } = this.form.value;
    const updated = this.dataService.updateFindingStatus(this.finding.id, status, comment);
    if (updated) {
      this.notifications.show(`Finding ${updated.id} updated to "${updated.status}"`, 'success');
      this.form.reset({ status: updated.status, comment: '' });
    }
  }

  @HostListener('document:keydown.escape')
  close(): void {
    this.router.navigate(['../'], { relativeTo: this.route, queryParamsHandling: 'preserve' });
  }

  trackByIndex(index: number): number {
    return index;
  }
}
