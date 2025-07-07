import {ComponentFixture, TestBed} from '@angular/core/testing';
import {of} from 'rxjs';
import {ItemsListComponent} from './items-list.component';
import {ProductService} from '../../core/services/product.service';
import {WarehouseItem} from '../../core/models/warehouseItem';

describe('ItemsListComponent', () => {
  let component: ItemsListComponent;
  let fixture: ComponentFixture<ItemsListComponent>;
  let mockProductService: jasmine.SpyObj<ProductService>;

  const mockProducts: WarehouseItem[] = [
    { id: 1, name: 'Test Product', quantity: 10, unitPrice: 100, imageUrl: '', description: '' },
    { id: 2, name: 'Another Product', quantity: 5, unitPrice: 200, imageUrl: '', description: '' },
  ];

  beforeEach(async () => {
    mockProductService = jasmine.createSpyObj('ProductService', ['getAll', 'create', 'update', 'delete']);

    await TestBed.configureTestingModule({
      imports: [ItemsListComponent],
      providers: [{ provide: ProductService, useValue: mockProductService }]
    }).compileComponents();

    fixture = TestBed.createComponent(ItemsListComponent);
    component = fixture.componentInstance;
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should load products on init', () => {
    mockProductService.getAll.and.returnValue(of(mockProducts));
    fixture.detectChanges();
    component.items$.subscribe(items => {
      expect(items).toEqual(mockProducts);
    });
  });

  it('should call createProduct and reload', () => {
    const newProduct = { name: 'New', quantity: 1, unitPrice: 10, imageUrl: '', description: '' };
    mockProductService.create.and.returnValue(of({ ...newProduct, id: 3 }));
    mockProductService.getAll.and.returnValue(of(mockProducts));

    component.createProduct(newProduct);

    expect(mockProductService.create).toHaveBeenCalledWith(newProduct);
    expect(mockProductService.getAll).toHaveBeenCalled();
  });

  it('should set editingProduct in startEdit', () => {
    const product = mockProducts[0];
    component.startEdit(product);
    expect(component.editingProduct).toEqual(product);
  });

  it('should clear editingProduct in cancelEdit', () => {
    component.editingProduct = mockProducts[0];
    component.cancelEdit();
    expect(component.editingProduct).toBeUndefined();
  });

  it('should call updateProduct and reload', () => {
    const product = mockProducts[0];
    const updated = { name: 'Updated', quantity: 2, unitPrice: 20, imageUrl: '', description: '' };

    component.editingProduct = product;

    mockProductService.update.and.returnValue(of({ ...product, ...updated }));
    mockProductService.getAll.and.returnValue(of(mockProducts));

    component.updateProduct(updated);

    expect(mockProductService.update).toHaveBeenCalledWith({ ...product, ...updated });
    expect(mockProductService.getAll).toHaveBeenCalled();
    expect(component.editingProduct).toBeUndefined();
  });

  it('should call deleteProduct and reload if confirmed', () => {
    spyOn(window, 'confirm').and.returnValue(true);
    mockProductService.delete.and.returnValue(of(undefined));
    mockProductService.getAll.and.returnValue(of(mockProducts));

    component.deleteProduct(1);

    expect(mockProductService.delete).toHaveBeenCalledWith(1);
    expect(mockProductService.getAll).toHaveBeenCalled();
  });

  it('should NOT delete if user cancels confirmation', () => {
    spyOn(window, 'confirm').and.returnValue(false);
    component.deleteProduct(1);
    expect(mockProductService.delete).not.toHaveBeenCalled();
  });
});
