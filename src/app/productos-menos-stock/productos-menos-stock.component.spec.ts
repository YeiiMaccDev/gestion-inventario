import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ProductosMenosStockComponent } from './productos-menos-stock.component';

describe('ProductosMenosStockComponent', () => {
  let component: ProductosMenosStockComponent;
  let fixture: ComponentFixture<ProductosMenosStockComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ProductosMenosStockComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ProductosMenosStockComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
