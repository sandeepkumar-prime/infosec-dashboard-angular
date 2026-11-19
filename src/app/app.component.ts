import { Component, Inject } from '@angular/core';
import { Title } from '@angular/platform-browser';
import { ActivatedRoute, NavigationEnd, Router } from '@angular/router';
import { filter } from 'rxjs/operators';

import { APP_CONFIG, AppConfig } from './core/config/app-config';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {
  sidebarCollapsed = false;

  constructor(
    router: Router,
    route: ActivatedRoute,
    titleService: Title,
    @Inject(APP_CONFIG) config: AppConfig
  ) {
    // Update the browser tab title from the route's `data.title`.
    router.events
      .pipe(filter(event => event instanceof NavigationEnd))
      .subscribe(() => {
        let child = route.firstChild;
        while (child && child.firstChild && !child.snapshot.data.title) {
          child = child.firstChild;
        }
        const pageTitle = child && child.snapshot.data.title;
        titleService.setTitle(pageTitle ? `${pageTitle} | ${config.appName}` : config.appName);
      });
  }

  toggleSidebar(): void {
    this.sidebarCollapsed = !this.sidebarCollapsed;
  }
}
