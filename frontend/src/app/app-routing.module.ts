import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import {ItemsListComponent} from "./pages/items-list/items-list.component";

const routes: Routes = [
  {
    path: '',
    component: ItemsListComponent
  },
  { path: 'products', loadChildren: () => import('./features/products/products.module').then(m => m.ProductsModule) }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
