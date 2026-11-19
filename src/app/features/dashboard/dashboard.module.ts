import { NgModule } from '@angular/core';

import { SharedModule } from '../../shared/shared.module';
import { AssetCoverageComponent } from './components/asset-coverage/asset-coverage.component';
import { DomainOverviewComponent } from './components/domain-overview/domain-overview.component';
import { IncidentTrendComponent } from './components/incident-trend/incident-trend.component';
import { RecentAlertsComponent } from './components/recent-alerts/recent-alerts.component';
import { RiskDistributionComponent } from './components/risk-distribution/risk-distribution.component';
import { DashboardRoutingModule } from './dashboard-routing.module';
import { DashboardComponent } from './dashboard.component';

@NgModule({
  declarations: [
    DashboardComponent,
    RiskDistributionComponent,
    DomainOverviewComponent,
    RecentAlertsComponent,
    IncidentTrendComponent,
    AssetCoverageComponent
  ],
  imports: [SharedModule, DashboardRoutingModule]
})
export class DashboardModule {}
