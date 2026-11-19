import { Component, Input } from '@angular/core';

export interface ChartSegment {
  label: string;
  value: number;
  color: string;
}

/** Pure-CSS donut chart built with a conic-gradient. */
@Component({
  selector: 'app-donut-chart',
  templateUrl: './donut-chart.component.html',
  styleUrls: ['./donut-chart.component.css']
})
export class DonutChartComponent {
  @Input() segments: ChartSegment[] = [];
  @Input() centerValue: string | number;
  @Input() centerLabel: string;
  @Input() size = 160;

  get total(): number {
    return this.segments.reduce((sum, s) => sum + s.value, 0);
  }

  /** Builds e.g. "conic-gradient(#c62828 0% 25%, #ef6c00 25% 60%, ...)". */
  get gradient(): string {
    const total = this.total;
    if (!total) {
      return 'conic-gradient(var(--track) 0% 100%)';
    }
    let start = 0;
    const stops = this.segments.map(s => {
      const end = start + (s.value / total) * 100;
      const stop = `${s.color} ${start.toFixed(2)}% ${end.toFixed(2)}%`;
      start = end;
      return stop;
    });
    return `conic-gradient(${stops.join(', ')})`;
  }
}
