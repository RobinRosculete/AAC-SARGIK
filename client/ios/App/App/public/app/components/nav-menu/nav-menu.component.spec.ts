import { ComponentFixture, TestBed } from '@angular/core/testing';

import { NavmenuComponent } from './nav-menu.component';

describe('NavMenuComponent', () => {
  let component: NavmenuComponent;
  let fixture: ComponentFixture<NavmenuComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [NavmenuComponent],
    });
    fixture = TestBed.createComponent(NavmenuComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
