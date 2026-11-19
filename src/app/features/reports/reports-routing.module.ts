import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { FindingDetailComponent } from './components/finding-detail/finding-detail.component';
import { ReportsComponent } from './reports.component';

const routes: Routes = [
  {
    path: '',
    component: ReportsComponent,
    children: [
      // /reports/F-1001 opens the detail drawer next to the table
      { path: ':id', component: FindingDetailComponent }
    ]
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class ReportsRoutingModule {}
