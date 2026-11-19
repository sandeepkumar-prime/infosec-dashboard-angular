import { Component, Input } from '@angular/core';

/** Horizontal CSS progress bar. `value` and `max` produce the fill width. */
@Component({
  selector: 'app-progress-bar',
  template: `
    <div class="track" [style.height.px]="height">
      <div class="fill" [style.width.%]="percent" [style.background]="color"></div>
    </div>`,
  styles: [`
    .track { width: 100%; background: var(--track); border-radius: 999px; overflow: hidden; }
    .fill { height: 100%; border-radius: 999px; transition: width 0.4s ease; }
  `]
})
export class ProgressBarComponent {
  @Input() value = 0;
  @Input() max = 100;
  @Input() color = 'var(--accent)';
  @Input() height = 8;

  get percent(): number {
    if (!this.max) {
      return 0;
    }
    return Math.max(0, Math.min(100, (this.value / this.max) * 100));
  }
}
