import {Component, OnInit} from '@angular/core';
import {CommonModule} from '@angular/common';
import {ListItemComponent} from "./list-item/list-item.component";
import {ProductService} from "../../core/services/product.service";
import {Observable, of} from "rxjs";
import {WarehouseItem} from "../../core/models/warehouseItem";

@Component({
  selector: 'app-items-list',
  standalone: true,
  imports: [CommonModule, ListItemComponent],
  templateUrl: './items-list.component.html',
  styleUrls: ['./items-list.component.scss']
})
export class ItemsListComponent  implements OnInit {
  items$: Observable<WarehouseItem[]>;

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
  addItemToShipment(id: number): void {}
}
