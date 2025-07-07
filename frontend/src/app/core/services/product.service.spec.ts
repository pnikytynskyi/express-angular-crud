import {TestBed} from '@angular/core/testing';
import {HttpClientTestingModule, HttpTestingController} from '@angular/common/http/testing';
import {ProductService} from './product.service';
import {WarehouseItem} from '../models/warehouseItem';

describe('ProductService', () => {
  let service: ProductService;
  let httpMock: HttpTestingController;

  const mockProduct: WarehouseItem = {
    id: 1,
    name: 'Test Product',
    quantity: 10,
    unitPrice: 99.99,
    imageUrl: 'http://example.com/img.jpg',
    description: 'Sample item',
  };

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      providers: [ProductService]
    });

    service = TestBed.inject(ProductService);
    httpMock = TestBed.inject(HttpTestingController);
  });

  afterEach(() => {
    httpMock.verify(); // ensure no outstanding requests
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('should fetch all products', () => {
    service.getAll().subscribe((products) => {
      expect(products.length).toBe(1);
      expect(products[0]).toEqual(mockProduct);
    });

    const req = httpMock.expectOne('http://localhost:3000/products');
    expect(req.request.method).toBe('GET');
    req.flush({ data: [mockProduct] });
  });

  it('should fetch product by ID', () => {
    service.getById(1).subscribe((product) => {
      expect(product).toEqual(mockProduct);
    });

    const req = httpMock.expectOne('http://localhost:3000/products/1');
    expect(req.request.method).toBe('GET');
    req.flush(mockProduct);
  });

  it('should create a product', () => {
    const { id, ...newProduct } = mockProduct;

    service.create(newProduct).subscribe((product) => {
      expect(product).toEqual(mockProduct);
    });

    const req = httpMock.expectOne('http://localhost:3000/products');
    expect(req.request.method).toBe('POST');
    req.flush(mockProduct);
  });

  it('should update a product', () => {
    const updatedProduct = { ...mockProduct, name: 'Updated Product' };

    service.update(updatedProduct).subscribe((product) => {
      expect(product).toEqual(updatedProduct);
    });

    const req = httpMock.expectOne(`http://localhost:3000/products/${mockProduct.id}`);
    expect(req.request.method).toBe('PATCH');
    req.flush(updatedProduct);
  });

  it('should delete a product', () => {
    service.delete(1).subscribe((response) => {
      expect(response).toBeNull();
    });

    const req = httpMock.expectOne(`http://localhost:3000/products/1`);
    expect(req.request.method).toBe('DELETE');
    req.flush(null);
  });
});
