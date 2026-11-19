import { ComponentFixture, TestBed } from '@angular/core/testing';

import { StatCardComponent } from './stat-card.component';

describe('StatCardComponent', () => {
  let fixture: ComponentFixture<StatCardComponent>;
  let component: StatCardComponent;

  beforeEach(async () => {
    await TestBed.configureTestingModule({ declarations: [StatCardComponent] }).compileComponents();
    fixture = TestBed.createComponent(StatCardComponent);
    component = fixture.componentInstance;
    component.label = 'Critical Risks';
    component.value = 4;
    component.variant = 'critical';
    fixture.detectChanges();
  });

  it('renders label and value', () => {
    const el: HTMLElement = fixture.nativeElement;
    expect(el.querySelector('.stat-label').textContent).toContain('Critical Risks');
    expect(el.querySelector('.stat-value').textContent.trim()).toBe('4');
    expect(el.querySelector('.stat-card').classList).toContain('variant-critical');
  });

  it('emits cardClick only when clickable', () => {
    const spy = spyOn(component.cardClick, 'emit');
    const card: HTMLElement = fixture.nativeElement.querySelector('.stat-card');
    card.click();
    expect(spy).not.toHaveBeenCalled();

    component.clickable = true;
    fixture.detectChanges();
    card.click();
    expect(spy).toHaveBeenCalledTimes(1);
  });
});
