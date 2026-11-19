import { Injectable } from '@angular/core';

import { Finding } from '../models/security.models';

export const CSV_COLUMNS: { header: string; value: (f: Finding) => string | number }[] = [
  { header: 'ID', value: f => f.id },
  { header: 'Title', value: f => f.title },
  { header: 'Severity', value: f => f.severity },
  { header: 'Status', value: f => f.status },
  { header: 'Domain', value: f => f.domain },
  { header: 'Asset', value: f => f.asset },
  { header: 'Owner', value: f => f.owner },
  { header: 'CVSS', value: f => f.cvssScore.toFixed(1) },
  { header: 'Discovered On', value: f => f.discoveredOn },
  { header: 'Due Date', value: f => f.dueDate }
];

/** Builds and downloads CSV files in the browser (no backend). */
@Injectable({ providedIn: 'root' })
export class CsvExportService {

  /** Escapes a value per RFC 4180: wrap in quotes when it contains a comma, quote or newline. */
  escape(value: string | number): string {
    const text = String(value);
    if (/[",\n\r]/.test(text)) {
      return '"' + text.replace(/"/g, '""') + '"';
    }
    return text;
  }

  toCsv(findings: Finding[]): string {
    const header = CSV_COLUMNS.map(c => c.header).join(',');
    const rows = findings.map(f => CSV_COLUMNS.map(c => this.escape(c.value(f))).join(','));
    return [header, ...rows].join('\r\n');
  }

  buildFileName(date: Date = new Date()): string {
    return 'security-findings-' + date.toISOString().substring(0, 10) + '.csv';
  }

  download(findings: Finding[]): string {
    const fileName = this.buildFileName();
    const blob = new Blob([this.toCsv(findings)], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = fileName;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
    return fileName;
  }
}
