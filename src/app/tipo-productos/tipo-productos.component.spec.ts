import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TipoProductosComponent } from './tipo-productos.component';

describe('TipoProductosComponent', () => {
  let component: TipoProductosComponent;
  let fixture: ComponentFixture<TipoProductosComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [TipoProductosComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(TipoProductosComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
