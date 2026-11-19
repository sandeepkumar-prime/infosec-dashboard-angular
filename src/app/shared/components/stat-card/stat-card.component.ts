import { Component, EventEmitter, Input, Output } from '@angular/core';

export type StatCardVariant = 'default' | 'critical' | 'high' | 'medium' | 'low' | 'success' | 'info';

/** KPI tile: label, large value and caption. Emits `cardClick` when clickable. */
@Component({
  selector: 'app-stat-card',
  templateUrl: './stat-card.component.html',
  styleUrls: ['./stat-card.component.css']
})
export class StatCardComponent {
  @Input() label: string;
  @Input() value: number | string;
  @Input() caption: string;
  @Input() icon: string;
  @Input() variant: StatCardVariant = 'default';
  @Input() clickable = false;

  @Output() cardClick = new EventEmitter<void>();

  onClick(): void {
    if (this.clickable) {
      this.cardClick.emit();
    }
  }
}
