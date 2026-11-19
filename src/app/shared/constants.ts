import { FindingStatus, Severity } from '../core/models/security.models';

/** Colour palette used by badges, charts and legends. */
export const SEVERITY_COLORS: { [key in Severity]: string } = {
  Critical: '#c62828',
  High: '#ef6c00',
  Medium: '#f2b600',
  Low: '#2e7d32'
};

export const STATUS_CLASSES: { [key in FindingStatus]: string } = {
  'Open': 'status-open',
  'In Progress': 'status-progress',
  'Resolved': 'status-resolved',
  'Accepted Risk': 'status-accepted'
};
