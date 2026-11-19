import { Component, Input } from '@angular/core';

import { AssetCategory } from '../../../../core/models/security.models';

@Component({
  selector: 'app-asset-coverage',
  templateUrl: './asset-coverage.component.html',
  styleUrls: ['./asset-coverage.component.css']
})
export class AssetCoverageComponent {
  @Input() categories: AssetCategory[] = [];

  coverage(category: AssetCategory): number {
    return category.count ? category.monitored / category.count : 0;
  }

  /** Categories below 95% monitoring coverage are flagged. */
  isBelowTarget(category: AssetCategory): boolean {
    return this.coverage(category) < 0.95;
  }
}
