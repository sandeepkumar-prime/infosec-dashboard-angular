import { Inject, Pipe, PipeTransform } from '@angular/core';

import { APP_CONFIG, AppConfig } from '../../core/config/app-config';

/**
 * Formats an ISO timestamp relative to the configured reference date,
 * e.g. "Just now", "18 min ago", "5 h ago", "2 d ago".
 */
@Pipe({ name: 'relativeTime' })
export class RelativeTimePipe implements PipeTransform {
  constructor(@Inject(APP_CONFIG) private config: AppConfig) {}

  transform(value: string, reference?: string): string {
    if (!value) {
      return '';
    }
    const now = new Date(reference || this.config.referenceDate).getTime();
    const minutes = Math.floor((now - new Date(value).getTime()) / 60000);
    if (minutes < 1) {
      return 'Just now';
    }
    if (minutes < 60) {
      return minutes + ' min ago';
    }
    const hours = Math.floor(minutes / 60);
    if (hours < 24) {
      return hours + ' h ago';
    }
    return Math.floor(hours / 24) + ' d ago';
  }
}
