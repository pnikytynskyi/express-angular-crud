import {Injectable} from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {map, Observable} from 'rxjs';
import {WarehouseItem} from "../models/warehouseItem";

@Injectable({
  providedIn: 'root'
})
export class ProductService {
  private apiUrl = 'http://localhost:3000/products';

  constructor(private http: HttpClient) {}

  getAll(): Observable<WarehouseItem[]> {
    return this.http.get<{ data: WarehouseItem[] }>(this.apiUrl).pipe(
      map(response => response.data)
    );
  }

  getById(id: number): Observable<WarehouseItem> {
    return this.http.get<WarehouseItem>(`${this.apiUrl}/${id}`);
  }

  create(product: Omit<WarehouseItem, 'id'>): Observable<WarehouseItem> {
    return this.http.post<WarehouseItem>(this.apiUrl, product);
  }

  update(product: WarehouseItem): Observable<WarehouseItem> {
    return this.http.put<WarehouseItem>(`${this.apiUrl}/${product.id}`, product);
  }

  delete(id: number): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/${id}`);
  }
}
