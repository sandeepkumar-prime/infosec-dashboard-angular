import { TestBed } from '@angular/core/testing';
import { RouterTestingModule } from '@angular/router/testing';

import { AppComponent } from './app.component';
import { CoreModule } from './core/core.module';

describe('AppComponent', () => {
  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [RouterTestingModule, CoreModule],
      declarations: [AppComponent]
    }).compileComponents();
  });

  it('renders the shell with both navigation links', () => {
    const fixture = TestBed.createComponent(AppComponent);
    fixture.detectChanges();
    const links = Array.from<HTMLElement>(fixture.nativeElement.querySelectorAll('.nav-label'))
      .map(el => el.textContent.trim());
    expect(links).toEqual(['Security Dashboard', 'Security Reports']);
  });

  it('toggles the sidebar', () => {
    const fixture = TestBed.createComponent(AppComponent);
    const app = fixture.componentInstance;
    expect(app.sidebarCollapsed).toBe(false);
    app.toggleSidebar();
    expect(app.sidebarCollapsed).toBe(true);
  });
});
