import { DEFAULT_APP_CONFIG } from '../../core/config/app-config';
import { DueStatusPipe } from './due-status.pipe';
import { RelativeTimePipe } from './relative-time.pipe';
import { TruncatePipe } from './truncate.pipe';

describe('Pipes', () => {
  describe('RelativeTimePipe', () => {
    const pipe = new RelativeTimePipe(DEFAULT_APP_CONFIG); // reference 2026-11-18T09:00:00Z

    it('formats minutes, hours and days', () => {
      expect(pipe.transform('2026-11-18T09:00:00Z')).toBe('Just now');
      expect(pipe.transform('2026-11-18T08:42:00Z')).toBe('18 min ago');
      expect(pipe.transform('2026-11-18T03:30:00Z')).toBe('5 h ago');
      expect(pipe.transform('2026-11-16T22:48:00Z')).toBe('1 d ago');
    });
  });

  describe('TruncatePipe', () => {
    const pipe = new TruncatePipe();

    it('truncates long text and keeps short text', () => {
      expect(pipe.transform('Short text', 20)).toBe('Short text');
      expect(pipe.transform('Remote code execution in Apache Struts', 20)).toBe('Remote code executio…');
    });
  });

  describe('DueStatusPipe', () => {
    const pipe = new DueStatusPipe(DEFAULT_APP_CONFIG); // today = 2026-11-18

    it('describes overdue, today and future due dates', () => {
      expect(pipe.transform('2026-11-11')).toBe('Overdue by 7 days');
      expect(pipe.transform('2026-11-17')).toBe('Overdue by 1 day');
      expect(pipe.transform('2026-11-18')).toBe('Due today');
      expect(pipe.transform('2026-11-19')).toBe('Due in 1 day');
      expect(pipe.transform('2026-12-01')).toBe('Due in 13 days');
    });
  });
});
