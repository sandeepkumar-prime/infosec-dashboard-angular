import { NgModule } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

import { SharedModule } from '../../shared/shared.module';
import { FindingDetailComponent } from './components/finding-detail/finding-detail.component';
import { FindingsFilterComponent } from './components/findings-filter/findings-filter.component';
import { FindingsTableComponent } from './components/findings-table/findings-table.component';
import { ReportsRoutingModule } from './reports-routing.module';
import { ReportsComponent } from './reports.component';

@NgModule({
  declarations: [
    ReportsComponent,
    FindingsFilterComponent,
    FindingsTableComponent,
    FindingDetailComponent
  ],
  imports: [
    SharedModule,
    FormsModule,          // template-driven filter form (ngModel)
    ReactiveFormsModule,  // reactive status-update form
    ReportsRoutingModule
  ]
})
export class ReportsModule {}
