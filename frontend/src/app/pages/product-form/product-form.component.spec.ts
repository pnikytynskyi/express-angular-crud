import {ComponentFixture, TestBed} from '@angular/core/testing';
import {ProductFormComponent} from './product-form.component';
import {ReactiveFormsModule} from '@angular/forms';
import {WarehouseItem} from '../../core/models/warehouseItem';

describe('ProductFormComponent', () => {
  let component: ProductFormComponent;
  let fixture: ComponentFixture<ProductFormComponent>;

  const mockProduct: WarehouseItem = {
    id: 1,
    name: 'Test Product',
    quantity: 5,
    unitPrice: 99.99,
    imageUrl: 'http://example.com/image.jpg',
    description: 'A test product',
  };

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ProductFormComponent, ReactiveFormsModule],
    }).compileComponents();

    fixture = TestBed.createComponent(ProductFormComponent);
    component = fixture.componentInstance;
  });

  it('should create', () => {
    fixture.detectChanges();
    expect(component).toBeTruthy();
  });

  it('should initialize form with product data when provided', () => {
    component.product = mockProduct;
    fixture.detectChanges();

    expect(component.productForm.value).toEqual({
      name: mockProduct.name,
      quantity: mockProduct.quantity,
      unitPrice: mockProduct.unitPrice,
      imageUrl: mockProduct.imageUrl,
      description: mockProduct.description,
    });
  });

  it('should initialize empty form when no product is provided', () => {
    fixture.detectChanges();
    expect(component.productForm.value).toEqual({
      name: '',
      quantity: 0,
      unitPrice: 0,
      imageUrl: '',
      description: '',
    });
  });

  it('should emit formSubmit when valid form is submitted', () => {
    component.product = mockProduct;
    fixture.detectChanges();

    spyOn(component.formSubmit, 'emit');
    component.onSubmit();

    expect(component.formSubmit.emit).toHaveBeenCalledWith({
      name: mockProduct.name,
      quantity: mockProduct.quantity,
      unitPrice: mockProduct.unitPrice,
      imageUrl: mockProduct.imageUrl,
      description: mockProduct.description,
    });
  });

  it('should not emit formSubmit when form is invalid', () => {
    fixture.detectChanges();

    spyOn(component.formSubmit, 'emit');
    component.productForm.patchValue({ name: '' });
    component.onSubmit();

    expect(component.formSubmit.emit).not.toHaveBeenCalled();
  });
});
