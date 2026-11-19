/**
 * Domain models for the SecureScope 360 dashboard.
 * All data is local mock data - there is no backend.
 */

export type Severity = 'Critical' | 'High' | 'Medium' | 'Low';

export type FindingStatus = 'Open' | 'In Progress' | 'Resolved' | 'Accepted Risk';

export type IncidentStatus = 'Open' | 'Investigating' | 'Contained' | 'Closed';

export type Trend = 'up' | 'down' | 'flat';

export const SEVERITIES: Severity[] = ['Critical', 'High', 'Medium', 'Low'];

export const FINDING_STATUSES: FindingStatus[] = ['Open', 'In Progress', 'Resolved', 'Accepted Risk'];

/** Numeric rank used for severity sorting (higher = more severe). */
export const SEVERITY_RANK: { [key in Severity]: number } = {
  Critical: 4,
  High: 3,
  Medium: 2,
  Low: 1
};

export interface StatusHistoryEntry {
  date: string;          // ISO date-time
  status: FindingStatus;
  comment: string;
  updatedBy: string;
}

export interface Finding {
  id: string;
  title: string;
  description: string;
  severity: Severity;
  status: FindingStatus;
  domain: string;
  asset: string;
  owner: string;
  cvssScore: number;
  discoveredOn: string;  // ISO date
  dueDate: string;       // ISO date
  lastUpdated: string;   // ISO date-time
  remediation: string;
  history: StatusHistoryEntry[];
}

export interface SecurityAlert {
  id: string;
  title: string;
  severity: Severity;
  source: string;
  asset: string;
  timestamp: string;     // ISO date-time
  acknowledged: boolean;
}

export interface SecurityIncident {
  id: string;
  title: string;
  severity: Severity;
  status: IncidentStatus;
  openedOn: string;
}

export interface AssetCategory {
  category: string;
  count: number;
  monitored: number;
}

export interface SecurityDomain {
  name: string;
  score: number;          // 0 - 100
  controlsTotal: number;
  controlsPassing: number;
  trend: Trend;
}

export interface MonthlyTrend {
  month: string;
  detected: number;
  resolved: number;
}

/** Derived view of a domain, enriched with live finding counts. */
export interface DomainSummary extends SecurityDomain {
  openFindings: number;
}

export interface SeverityCount {
  severity: Severity;
  count: number;
  percent: number;        // 0 - 1
}

export interface DashboardSummary {
  totalAssets: number;
  monitoredAssets: number;
  coverage: number;       // 0 - 1
  openBySeverity: { [key in Severity]: number };
  openFindings: number;
  openIncidents: number;
  resolvedIssues: number;
  overdueFindings: number;
  postureScore: number;   // 0 - 100
}

export interface FindingFilter {
  search: string;
  severity: Severity | 'All';
  status: FindingStatus | 'All';
  overdueOnly: boolean;
}

export type SortColumn =
  | 'id'
  | 'title'
  | 'severity'
  | 'status'
  | 'domain'
  | 'cvssScore'
  | 'discoveredOn'
  | 'dueDate';

export type SortDirection = 'asc' | 'desc';

export interface SortState {
  column: SortColumn;
  direction: SortDirection;
}
