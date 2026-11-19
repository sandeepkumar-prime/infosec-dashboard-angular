import { Inject, Pipe, PipeTransform } from '@angular/core';

import { APP_CONFIG, AppConfig } from '../../core/config/app-config';

const DAY_MS = 24 * 60 * 60 * 1000;

/**
 * Describes a due date relative to the reference date:
 * "Overdue by N days", "Due today", "Due in N days".
 */
@Pipe({ name: 'dueStatus' })
export class DueStatusPipe implements PipeTransform {
  constructor(@Inject(APP_CONFIG) private config: AppConfig) {}

  transform(dueDate: string): string {
    if (!dueDate) {
      return '';
    }
    const today = Date.parse(this.config.referenceDate.substring(0, 10));
    const days = Math.round((Date.parse(dueDate) - today) / DAY_MS);
    if (days < 0) {
      return 'Overdue by ' + Math.abs(days) + (days === -1 ? ' day' : ' days');
    }
    if (days === 0) {
      return 'Due today';
    }
    return 'Due in ' + days + (days === 1 ? ' day' : ' days');
  }
}
