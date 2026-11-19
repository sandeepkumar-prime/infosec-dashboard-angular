import { Component, Input } from '@angular/core';

export interface NavItem {
  label: string;
  route: string;
  icon: string;
  description: string;
}

@Component({
  selector: 'app-sidebar',
  templateUrl: './sidebar.component.html',
  styleUrls: ['./sidebar.component.css']
})
export class SidebarComponent {
  @Input() collapsed = false;

  readonly navItems: NavItem[] = [
    { label: 'Security Dashboard', route: '/dashboard', icon: '▦', description: 'Posture overview' },
    { label: 'Security Reports', route: '/reports', icon: '☷', description: 'Findings register' }
  ];
}
