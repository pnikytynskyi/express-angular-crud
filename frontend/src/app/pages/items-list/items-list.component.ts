import {Component, OnInit} from '@angular/core';
import {CommonModule} from '@angular/common';
import {ListItemComponent} from "./list-item/list-item.component";
import {ProductService} from "../../core/services/product.service";
import {Observable, of} from "rxjs";
import {WarehouseItem} from "../../core/models/warehouseItem";
import {ProductFormComponent} from "../product-form/product-form.component";

@Component({
  selector: 'app-items-list',
  standalone: true,
  imports: [CommonModule, ListItemComponent, ProductFormComponent],
  templateUrl: './items-list.component.html',
  styleUrls: ['./items-list.component.scss']
})
export class ItemsListComponent  implements OnInit {
  items$: Observable<WarehouseItem[]>;
  editingProduct?: WarehouseItem;

  constructor(private productService: ProductService) {}

  ngOnInit(): void {
    this.loadProducts();
  }

  loadProducts(): void {
    this.productService.getAll().subscribe((data) => {
      console.log('Received from API:', data);
      this.items$ = of(data);
    });
  }
  createProduct(product: Omit<WarehouseItem, 'id'>): void {
    this.productService.create(product).subscribe(() => this.loadProducts());
  }

  startEdit(product: WarehouseItem): void {
    this.editingProduct = product;
  }

  cancelEdit(): void {
    this.editingProduct = undefined;
  }


  updateProduct(updatedData: Omit<WarehouseItem, 'id'>): void {
    if (!this.editingProduct) return;

    const updatedProduct: WarehouseItem = {
      ...this.editingProduct,
      ...updatedData,
    };

    this.productService.update(updatedProduct).subscribe(() => {
      this.loadProducts();
      this.cancelEdit();
    });
  }

  deleteProduct(id: number): void {
    if (confirm('Are you sure you want to delete this product?')) {
      this.productService.delete(id).subscribe(() => this.loadProducts());
    }
  }
}
