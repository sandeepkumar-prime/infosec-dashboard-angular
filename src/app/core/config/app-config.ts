import { InjectionToken } from '@angular/core';

/**
 * Application-wide configuration, provided through an InjectionToken
 * (exercises non-class dependency injection).
 */
export interface AppConfig {
  appName: string;
  organization: string;
  currentUser: string;
  /**
   * Fixed "now" used for relative times and overdue calculations so that the
   * baseline application and the migrated application render identical output.
   */
  referenceDate: string;
}

export const APP_CONFIG = new InjectionToken<AppConfig>('app.config');

export const DEFAULT_APP_CONFIG: AppConfig = {
  appName: 'SecureScope 360',
  organization: 'Northwind Global Services',
  currentUser: 'Security Analyst',
  referenceDate: '2026-11-18T09:00:00Z'
};
