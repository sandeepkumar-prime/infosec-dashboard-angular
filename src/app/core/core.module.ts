import { NgModule, Optional, SkipSelf } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';

import { APP_CONFIG, DEFAULT_APP_CONFIG } from './config/app-config';
import { HeaderComponent } from './layout/header/header.component';
import { SidebarComponent } from './layout/sidebar/sidebar.component';
import { ToastComponent } from './layout/toast/toast.component';

/**
 * Singleton layer: application shell components and app-wide providers.
 * Must be imported only once, by AppModule.
 */
@NgModule({
  declarations: [HeaderComponent, SidebarComponent, ToastComponent],
  imports: [CommonModule, RouterModule],
  exports: [HeaderComponent, SidebarComponent, ToastComponent],
  providers: [{ provide: APP_CONFIG, useValue: DEFAULT_APP_CONFIG }]
})
export class CoreModule {
  constructor(@Optional() @SkipSelf() parentModule: CoreModule) {
    if (parentModule) {
      throw new Error('CoreModule is already loaded. Import it in AppModule only.');
    }
  }
}
