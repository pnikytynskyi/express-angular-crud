import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';

import {ProductsRoutingModule} from './products-routing.module';
import {ProductsComponent} from './products.component';
import {ListComponent} from "./pages/list/list.component";


@NgModule({
  declarations: [
    ProductsComponent,
    ListComponent
  ],
  imports: [
    CommonModule,
    ProductsRoutingModule
  ],
  exports: [ListComponent]
})
export class ProductsModule { }
