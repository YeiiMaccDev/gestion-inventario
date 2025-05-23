import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ProductosAvencerComponent } from './productos-avencer.component';

describe('ProductosAvencerComponent', () => {
  let component: ProductosAvencerComponent;
  let fixture: ComponentFixture<ProductosAvencerComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ProductosAvencerComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ProductosAvencerComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
