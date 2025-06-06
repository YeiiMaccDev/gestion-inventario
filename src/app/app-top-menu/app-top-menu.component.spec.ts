import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AppTopMenuComponent } from './app-top-menu.component';

describe('AppTopMenuComponent', () => {
  let component: AppTopMenuComponent;
  let fixture: ComponentFixture<AppTopMenuComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AppTopMenuComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AppTopMenuComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
