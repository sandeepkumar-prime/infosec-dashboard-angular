import { Directive, HostBinding, Input } from '@angular/core';

import { Severity } from '../../core/models/security.models';

/**
 * Attribute directive that marks its host element with severity styling:
 * adds the "sev-row" class, a data-severity attribute (used by CSS for the
 * coloured left border) and a tooltip.
 *
 * Usage: <tr [appSeverityHighlight]="finding.severity">
 */
@Directive({ selector: '[appSeverityHighlight]' })
export class SeverityHighlightDirective {
  @Input('appSeverityHighlight') severity: Severity;

  @HostBinding('class.sev-row') readonly marker = true;

  @HostBinding('attr.data-severity')
  get dataSeverity(): string {
    return this.severity ? this.severity.toLowerCase() : null;
  }

  @HostBinding('attr.title')
  get title(): string {
    return this.severity ? this.severity + ' severity' : null;
  }
}
