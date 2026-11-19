import { Component, Input } from '@angular/core';

export interface BarSeries {
  name: string;
  color: string;
}

export interface BarGroup {
  label: string;
  values: number[];   // one value per series, same order as `series`
}

/** Grouped vertical bar chart rendered with flexbox and percentage heights. */
@Component({
  selector: 'app-bar-chart',
  templateUrl: './bar-chart.component.html',
  styleUrls: ['./bar-chart.component.css']
})
export class BarChartComponent {
  @Input() series: BarSeries[] = [];
  @Input() groups: BarGroup[] = [];
  @Input() height = 180;

  get maxValue(): number {
    const all = this.groups.reduce((acc, g) => acc.concat(g.values), [] as number[]);
    return all.length ? Math.max(...all) : 0;
  }

  barHeight(value: number): number {
    const max = this.maxValue;
    return max ? (value / max) * 100 : 0;
  }

  trackByLabel(index: number, group: BarGroup): string {
    return group.label;
  }
}
