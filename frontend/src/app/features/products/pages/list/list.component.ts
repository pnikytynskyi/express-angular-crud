import {Component, OnInit} from '@angular/core';
import {ProductService} from 'src/app/core/services/product.service';
import {Product} from 'src/app/core/models/product';

@Component({
  selector: 'app-list',
  templateUrl: './list.component.html'
})
export class ListComponent implements OnInit {
  products: Product[] = [];

  constructor(private productService: ProductService) {}

  ngOnInit(): void {
    this.loadProducts();
  }

  loadProducts(): void {
    this.productService.getAll().subscribe((data) => {
      this.products = data;
    });
  }
}
