import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

/**
 * Top-level routes. Both pages are lazy-loaded feature modules.
 *   /dashboard            -> Security Dashboard
 *   /reports              -> Security Reports (findings table)
 *   /reports/:id          -> Security Reports with finding detail drawer open
 */
const routes: Routes = [
  { path: '', redirectTo: 'dashboard', pathMatch: 'full' },
  {
    path: 'dashboard',
    loadChildren: () => import('./features/dashboard/dashboard.module').then(m => m.DashboardModule),
    data: { title: 'Security Dashboard' }
  },
  {
    path: 'reports',
    loadChildren: () => import('./features/reports/reports.module').then(m => m.ReportsModule),
    data: { title: 'Security Reports' }
  },
  { path: '**', redirectTo: 'dashboard' }
];

@NgModule({
  imports: [RouterModule.forRoot(routes, { scrollPositionRestoration: 'top' })],
  exports: [RouterModule]
})
export class AppRoutingModule {}
