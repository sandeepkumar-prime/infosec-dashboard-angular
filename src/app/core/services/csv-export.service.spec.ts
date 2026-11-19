import { SECURITY_FINDINGS } from '../data/mock-security-data';
import { CsvExportService } from './csv-export.service';

describe('CsvExportService', () => {
  const service = new CsvExportService();

  it('writes a header row plus one row per finding', () => {
    const lines = service.toCsv(SECURITY_FINDINGS.slice(0, 3)).split('\r\n');
    expect(lines.length).toBe(4);
    expect(lines[0]).toBe('ID,Title,Severity,Status,Domain,Asset,Owner,CVSS,Discovered On,Due Date');
    expect(lines[1]).toBe(
      'F-1001,Remote code execution in Apache Struts,Critical,Open,Application Security,web-app-07,Priya Sharma,9.8,2026-10-28,2026-11-11'
    );
  });

  it('escapes commas and quotes', () => {
    expect(service.escape('a,b')).toBe('"a,b"');
    expect(service.escape('say "hi"')).toBe('"say ""hi"""');
    expect(service.escape('plain')).toBe('plain');
  });

  it('builds a dated file name', () => {
    expect(service.buildFileName(new Date('2026-11-18T09:00:00Z'))).toBe('security-findings-2026-11-18.csv');
  });
});
