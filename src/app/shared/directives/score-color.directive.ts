import { Directive, ElementRef, Input, OnChanges, Renderer2 } from '@angular/core';

/** Thresholds shared by all score visualisations. */
export function scoreLevel(score: number): 'good' | 'fair' | 'poor' {
  if (score >= 80) {
    return 'good';
  }
  return score >= 65 ? 'fair' : 'poor';
}

export const SCORE_COLORS = { good: '#2e7d32', fair: '#e09b00', poor: '#c62828' };

/**
 * Colours the host element's text according to a 0-100 score
 * (>= 80 green, >= 65 amber, otherwise red). Uses ElementRef + Renderer2.
 *
 * Usage: <span [appScoreColor]="domain.score">{{ domain.score }}</span>
 */
@Directive({ selector: '[appScoreColor]' })
export class ScoreColorDirective implements OnChanges {
  @Input('appScoreColor') score: number;

  constructor(private el: ElementRef, private renderer: Renderer2) {}

  ngOnChanges(): void {
    this.renderer.setStyle(this.el.nativeElement, 'color', SCORE_COLORS[scoreLevel(this.score)]);
  }
}
