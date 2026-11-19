import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { BarChartComponent } from './components/bar-chart/bar-chart.component';
import { DonutChartComponent } from './components/donut-chart/donut-chart.component';
import { PanelComponent } from './components/panel/panel.component';
import { ProgressBarComponent } from './components/progress-bar/progress-bar.component';
import { SeverityBadgeComponent } from './components/severity-badge/severity-badge.component';
import { StatCardComponent } from './components/stat-card/stat-card.component';
import { StatusBadgeComponent } from './components/status-badge/status-badge.component';
import { ScoreColorDirective } from './directives/score-color.directive';
import { SeverityHighlightDirective } from './directives/severity-highlight.directive';
import { DueStatusPipe } from './pipes/due-status.pipe';
import { RelativeTimePipe } from './pipes/relative-time.pipe';
import { TruncatePipe } from './pipes/truncate.pipe';

const SHARED_DECLARATIONS = [
  BarChartComponent,
  DonutChartComponent,
  PanelComponent,
  ProgressBarComponent,
  SeverityBadgeComponent,
  StatCardComponent,
  StatusBadgeComponent,
  ScoreColorDirective,
  SeverityHighlightDirective,
  DueStatusPipe,
  RelativeTimePipe,
  TruncatePipe
];

/** Reusable, presentation-only building blocks shared by feature modules. */
@NgModule({
  declarations: SHARED_DECLARATIONS,
  imports: [CommonModule],
  exports: [CommonModule, ...SHARED_DECLARATIONS]
})
export class SharedModule {}
