import { Component, EventEmitter, Inject, Output } from '@angular/core';

import { APP_CONFIG, AppConfig } from '../../config/app-config';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.css']
})
export class HeaderComponent {
  @Output() menuToggle = new EventEmitter<void>();

  constructor(@Inject(APP_CONFIG) public config: AppConfig) {}

  get initials(): string {
    return this.config.currentUser
      .split(' ')
      .map(part => part.charAt(0))
      .join('')
      .toUpperCase();
  }
}
