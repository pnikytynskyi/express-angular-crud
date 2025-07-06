import {Component, EventEmitter, Input, OnInit, Output} from '@angular/core';
import {FormBuilder, FormGroup, ReactiveFormsModule, Validators} from '@angular/forms';
import {CommonModule} from '@angular/common';
import {WarehouseItem} from '../../core/models/warehouseItem';

@Component({
  selector: 'app-product-form',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './product-form.component.html',
  styleUrls: ['./product-form.component.scss']
})
export class ProductFormComponent implements OnInit {
  @Input() product?: WarehouseItem;
  @Output() formSubmit = new EventEmitter<Omit<WarehouseItem, 'id'>>();

  productForm!: FormGroup;

  constructor(private fb: FormBuilder) {}

  ngOnInit(): void {
    this.productForm = this.fb.group({
      name: [this.product?.name || '', Validators.required],
      quantity: [this.product?.quantity || 0, [Validators.required, Validators.min(0)]],
      unitPrice: [this.product?.unitPrice || 0, [Validators.required, Validators.min(0)]],
      imageUrl: [this.product?.imageUrl || '', Validators.required],
      description: [this.product?.description || '', Validators.required]
    });
  }

  onSubmit(): void {
    if (this.productForm.valid) {
      this.formSubmit.emit(this.productForm.value);
    }
  }
}
