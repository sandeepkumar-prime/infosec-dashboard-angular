import {
  AssetCategory,
  Finding,
  FindingStatus,
  MonthlyTrend,
  SecurityAlert,
  SecurityDomain,
  SecurityIncident,
  Severity
} from '../models/security.models';

/**
 * Local mock data. This file is the single source of truth for every number
 * displayed in the application. Do not change values without updating
 * docs/MIGRATION_VALIDATION.md (expected results depend on them).
 */

export const ASSET_CATEGORIES: AssetCategory[] = [
  { category: 'Workstations', count: 2180, monitored: 2104 },
  { category: 'Cloud Workloads', count: 538, monitored: 512 },
  { category: 'Servers', count: 412, monitored: 409 },
  { category: 'Network Devices', count: 146, monitored: 139 },
  { category: 'Applications', count: 87, monitored: 81 },
  { category: 'Databases', count: 64, monitored: 64 }
];

export const SECURITY_DOMAINS: SecurityDomain[] = [
  { name: 'Network Security', score: 82, controlsTotal: 48, controlsPassing: 40, trend: 'up' },
  { name: 'Identity & Access', score: 68, controlsTotal: 36, controlsPassing: 25, trend: 'down' },
  { name: 'Application Security', score: 61, controlsTotal: 42, controlsPassing: 26, trend: 'flat' },
  { name: 'Data Protection', score: 77, controlsTotal: 30, controlsPassing: 23, trend: 'up' },
  { name: 'Endpoint Security', score: 88, controlsTotal: 28, controlsPassing: 25, trend: 'up' },
  { name: 'Cloud Security', score: 72, controlsTotal: 40, controlsPassing: 29, trend: 'down' }
];

export const MONTHLY_TRENDS: MonthlyTrend[] = [
  { month: 'Jun', detected: 42, resolved: 35 },
  { month: 'Jul', detected: 38, resolved: 40 },
  { month: 'Aug', detected: 51, resolved: 39 },
  { month: 'Sep', detected: 46, resolved: 44 },
  { month: 'Oct', detected: 33, resolved: 41 },
  { month: 'Nov', detected: 29, resolved: 24 }
];

export const SECURITY_INCIDENTS: SecurityIncident[] = [
  { id: 'INC-2041', title: 'Credential stuffing against customer portal', severity: 'Critical', status: 'Investigating', openedOn: '2026-11-16' },
  { id: 'INC-2038', title: 'Malware detected on finance workstation', severity: 'High', status: 'Contained', openedOn: '2026-11-12' },
  { id: 'INC-2036', title: 'Suspicious outbound traffic from build server', severity: 'High', status: 'Open', openedOn: '2026-11-10' },
  { id: 'INC-2033', title: 'Phishing campaign targeting HR mailbox', severity: 'Medium', status: 'Open', openedOn: '2026-11-07' },
  { id: 'INC-2029', title: 'Unauthorized USB device connected', severity: 'Low', status: 'Closed', openedOn: '2026-11-02' },
  { id: 'INC-2027', title: 'Public S3 bucket exposure', severity: 'High', status: 'Closed', openedOn: '2026-10-29' },
  { id: 'INC-2024', title: 'Brute-force attempts on VPN gateway', severity: 'Medium', status: 'Investigating', openedOn: '2026-10-25' }
];

export const SECURITY_ALERTS: SecurityAlert[] = [
  { id: 'ALT-9921', title: 'Multiple failed admin logins detected', severity: 'Critical', source: 'Identity Provider', asset: 'idp-prod-01', timestamp: '2026-11-18T08:42:00Z', acknowledged: false },
  { id: 'ALT-9919', title: 'Ransomware signature matched in email attachment', severity: 'Critical', source: 'Email Gateway', asset: 'mail-gw-02', timestamp: '2026-11-18T07:15:00Z', acknowledged: false },
  { id: 'ALT-9914', title: 'Port scan from external IP 203.0.113.45', severity: 'High', source: 'Perimeter Firewall', asset: 'fw-edge-01', timestamp: '2026-11-18T03:30:00Z', acknowledged: false },
  { id: 'ALT-9908', title: 'Privilege escalation attempt on Linux host', severity: 'High', source: 'EDR Agent', asset: 'app-srv-114', timestamp: '2026-11-17T21:05:00Z', acknowledged: true },
  { id: 'ALT-9902', title: 'Expired TLS certificate on internal service', severity: 'Medium', source: 'Certificate Monitor', asset: 'hr-portal.internal', timestamp: '2026-11-17T14:20:00Z', acknowledged: false },
  { id: 'ALT-9897', title: 'Anomalous data download volume', severity: 'High', source: 'DLP Engine', asset: 'fileshare-03', timestamp: '2026-11-16T22:48:00Z', acknowledged: false },
  { id: 'ALT-9890', title: 'Antivirus definitions out of date', severity: 'Low', source: 'Endpoint Manager', asset: 'wks-fin-0231', timestamp: '2026-11-16T10:00:00Z', acknowledged: true },
  { id: 'ALT-9884', title: 'New admin account created outside change window', severity: 'Medium', source: 'Active Directory', asset: 'dc-01', timestamp: '2026-11-15T19:37:00Z', acknowledged: false }
];

/** Helper used to keep the finding definitions compact. */
function finding(
  id: string,
  title: string,
  severity: Severity,
  status: FindingStatus,
  domain: string,
  asset: string,
  owner: string,
  cvssScore: number,
  discoveredOn: string,
  dueDate: string,
  description: string,
  remediation: string
): Finding {
  const history = [
    { date: discoveredOn + 'T10:00:00Z', status: 'Open' as FindingStatus, comment: 'Finding identified during scheduled assessment.', updatedBy: 'Automated Scanner' }
  ];
  if (status !== 'Open') {
    history.push({ date: discoveredOn + 'T16:30:00Z', status, comment: 'Status updated by asset owner.', updatedBy: owner });
  }
  return {
    id, title, severity, status, domain, asset, owner, cvssScore, discoveredOn, dueDate,
    lastUpdated: history[history.length - 1].date,
    description, remediation, history
  };
}

export const SECURITY_FINDINGS: Finding[] = [
  finding('F-1001', 'Remote code execution in Apache Struts', 'Critical', 'Open', 'Application Security', 'web-app-07', 'Priya Sharma', 9.8, '2026-10-28', '2026-11-11',
    'Outdated Struts library exposes the application to remote code execution via crafted Content-Type headers.',
    'Upgrade Apache Struts to the latest patched release and redeploy the application.'),
  finding('F-1002', 'Domain admin password never expires', 'Critical', 'In Progress', 'Identity & Access', 'dc-01', 'Michael Chen', 9.1, '2026-11-02', '2026-11-20',
    'Two domain administrator accounts are configured with non-expiring passwords.',
    'Enforce password expiry policy and rotate credentials for privileged accounts.'),
  finding('F-1003', 'Unencrypted customer PII in backup storage', 'Critical', 'Open', 'Data Protection', 'backup-nas-02', 'Aisha Khan', 9.0, '2026-11-05', '2026-11-19',
    'Nightly database backups containing customer PII are stored without encryption at rest.',
    'Enable AES-256 encryption for the backup volume and re-run the backup job.'),
  finding('F-1004', 'Publicly accessible storage bucket', 'Critical', 'Resolved', 'Cloud Security', 's3-marketing-assets', 'David Miller', 8.6, '2026-10-20', '2026-10-27',
    'Storage bucket allowed anonymous list and read access.',
    'Apply bucket policy to block public access and enable access logging.'),
  finding('F-1005', 'SQL injection in order search API', 'Critical', 'In Progress', 'Application Security', 'orders-api', 'Priya Sharma', 9.4, '2026-11-08', '2026-11-22',
    'The order search endpoint concatenates user input into SQL queries.',
    'Use parameterised queries and add input validation on the search endpoint.'),
  finding('F-1006', 'Outdated firmware on core switch', 'High', 'Open', 'Network Security', 'sw-core-01', 'Robert Brown', 7.8, '2026-10-15', '2026-11-14',
    'Core switch firmware is three releases behind and affected by a known DoS vulnerability.',
    'Schedule maintenance window and upgrade switch firmware.'),
  finding('F-1007', 'MFA not enforced for VPN users', 'High', 'In Progress', 'Identity & Access', 'vpn-gw-01', 'Michael Chen', 8.1, '2026-10-30', '2026-11-29',
    '27% of VPN users can authenticate with password only.',
    'Enforce MFA for all VPN connection profiles.'),
  finding('F-1008', 'Weak TLS cipher suites enabled', 'High', 'Open', 'Network Security', 'lb-ext-02', 'Robert Brown', 7.4, '2026-11-01', '2026-12-01',
    'External load balancer accepts TLS 1.0 and RC4 cipher suites.',
    'Disable legacy protocols and restrict to TLS 1.2+ strong ciphers.'),
  finding('F-1009', 'Excessive IAM permissions on service role', 'High', 'Open', 'Cloud Security', 'iam-role-etl', 'David Miller', 7.9, '2026-11-03', '2026-12-03',
    'ETL service role has wildcard administrative permissions.',
    'Apply least-privilege policy scoped to required resources only.'),
  finding('F-1010', 'EDR agent missing on servers', 'High', 'Resolved', 'Endpoint Security', 'app-srv-cluster-b', 'Linda Garcia', 7.2, '2026-10-10', '2026-10-31',
    'Twelve production servers do not have the EDR agent installed.',
    'Deploy EDR agent through configuration management and verify check-in.'),
  finding('F-1011', 'Cross-site scripting in feedback form', 'High', 'Open', 'Application Security', 'web-app-03', 'Priya Sharma', 7.1, '2026-11-06', '2026-12-06',
    'Reflected XSS possible through the "comment" parameter.',
    'Apply output encoding and implement a Content Security Policy.'),
  finding('F-1012', 'Sensitive data shared via public links', 'High', 'Accepted Risk', 'Data Protection', 'collab-suite', 'Aisha Khan', 7.0, '2026-10-18', '2026-11-17',
    'Documents labelled confidential are shared through anyone-with-link URLs.',
    'Restrict external sharing and apply DLP policies to confidential labels.'),
  finding('F-1013', 'Unpatched OS on database servers', 'High', 'Open', 'Endpoint Security', 'db-srv-04', 'Linda Garcia', 8.0, '2026-10-22', '2026-11-12',
    'Database servers are missing the last two cumulative security updates.',
    'Apply OS patches during the next maintenance window.'),
  finding('F-1014', 'Security group allows SSH from anywhere', 'High', 'Resolved', 'Cloud Security', 'sg-bastion', 'David Miller', 7.5, '2026-10-12', '2026-10-19',
    'Security group permits inbound port 22 from 0.0.0.0/0.',
    'Restrict SSH ingress to corporate IP ranges.'),
  finding('F-1015', 'Stale accounts of former employees', 'Medium', 'Open', 'Identity & Access', 'ad-directory', 'Michael Chen', 6.5, '2026-10-25', '2026-11-24',
    '43 accounts belonging to former employees remain enabled.',
    'Disable stale accounts and automate joiner-mover-leaver process.'),
  finding('F-1016', 'Missing HTTP security headers', 'Medium', 'Open', 'Application Security', 'web-app-05', 'Priya Sharma', 5.3, '2026-11-04', '2026-12-04',
    'X-Frame-Options and Strict-Transport-Security headers are not set.',
    'Configure security headers at the web server level.'),
  finding('F-1017', 'Firewall rules without owner', 'Medium', 'In Progress', 'Network Security', 'fw-int-01', 'Robert Brown', 5.0, '2026-10-19', '2026-11-18',
    '64 firewall rules have no documented business owner.',
    'Review and recertify firewall rules; remove unused entries.'),
  finding('F-1018', 'Logging disabled on cloud audit trail', 'Medium', 'Resolved', 'Cloud Security', 'cloudtrail-eu', 'David Miller', 6.1, '2026-10-05', '2026-10-20',
    'Audit logging was disabled in one region.',
    'Enable audit trail in all regions and alert on configuration change.'),
  finding('F-1019', 'Local admin rights on workstations', 'Medium', 'Open', 'Endpoint Security', 'wks-fleet', 'Linda Garcia', 5.9, '2026-10-29', '2026-11-28',
    '18% of workstations grant local administrator rights to end users.',
    'Remove local admin rights and deploy privilege management tooling.'),
  finding('F-1020', 'Data retention policy not enforced', 'Medium', 'Open', 'Data Protection', 'crm-db', 'Aisha Khan', 4.8, '2026-10-14', '2026-11-13',
    'Customer records older than seven years are not purged.',
    'Implement automated retention job aligned with policy.'),
  finding('F-1021', 'Verbose error messages in API', 'Medium', 'Accepted Risk', 'Application Security', 'billing-api', 'Priya Sharma', 4.3, '2026-10-08', '2026-11-07',
    'Stack traces are returned to clients on unhandled exceptions.',
    'Return generic error responses and log details server-side.'),
  finding('F-1022', 'Shared service account credentials', 'Medium', 'In Progress', 'Identity & Access', 'svc-reporting', 'Michael Chen', 6.0, '2026-11-09', '2026-12-09',
    'Reporting service account password is shared across three teams.',
    'Move credentials to a secrets vault and issue per-team identities.'),
  finding('F-1023', 'Unrestricted outbound internet from DMZ', 'Medium', 'Open', 'Network Security', 'dmz-segment', 'Robert Brown', 5.6, '2026-11-10', '2026-12-10',
    'Hosts in the DMZ can initiate connections to any internet destination.',
    'Introduce egress filtering through the proxy.'),
  finding('F-1024', 'Disk encryption not enabled on laptops', 'Medium', 'Resolved', 'Endpoint Security', 'laptop-fleet', 'Linda Garcia', 5.5, '2026-09-28', '2026-10-28',
    'Seven laptops were found without full-disk encryption.',
    'Enforce disk encryption via device management policy.'),
  finding('F-1025', 'Default SNMP community string', 'Low', 'Open', 'Network Security', 'printer-floor3', 'Robert Brown', 3.7, '2026-11-11', '2026-12-11',
    'Network printers use the default "public" SNMP community.',
    'Change SNMP community strings or migrate to SNMPv3.'),
  finding('F-1026', 'Password policy allows 8 characters', 'Low', 'Open', 'Identity & Access', 'ad-directory', 'Michael Chen', 3.1, '2026-11-12', '2026-12-12',
    'Minimum password length is below the 12-character standard.',
    'Update domain password policy to require 12 characters.'),
  finding('F-1027', 'Unused cloud access keys', 'Low', 'Resolved', 'Cloud Security', 'iam-users', 'David Miller', 2.9, '2026-10-02', '2026-11-01',
    'Five access keys have not been used in more than 90 days.',
    'Deactivate and delete unused access keys.'),
  finding('F-1028', 'Screen lock timeout too long', 'Low', 'Accepted Risk', 'Endpoint Security', 'wks-fleet', 'Linda Garcia', 2.4, '2026-10-16', '2026-11-15',
    'Workstation screen lock activates after 30 minutes of inactivity.',
    'Reduce screen lock timeout to 10 minutes.'),
  finding('F-1029', 'Cookie missing Secure flag', 'Low', 'Open', 'Application Security', 'web-app-05', 'Priya Sharma', 3.4, '2026-11-13', '2026-12-13',
    'Session cookie is transmitted without the Secure attribute.',
    'Set Secure and HttpOnly flags on all session cookies.'),
  finding('F-1030', 'Data classification labels missing', 'Low', 'In Progress', 'Data Protection', 'sharepoint-legal', 'Aisha Khan', 2.7, '2026-11-14', '2026-12-14',
    'Legal department documents lack classification labels.',
    'Apply default labels and train users on classification.')
];
