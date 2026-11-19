import { Component, Input } from '@angular/core';

/**
 * Card container with a header. Uses content projection:
 *   <app-panel title="..."><div panel-actions>...</div> body </app-panel>
 */
@Component({
  selector: 'app-panel',
  templateUrl: './panel.component.html',
  styleUrls: ['./panel.component.css']
})
export class PanelComponent {
  @Input() title: string;
  @Input() subtitle: string;
}
