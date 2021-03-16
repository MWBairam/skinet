import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Routes, RouterModule } from '@angular/router';
import { OrdersComponent } from './orders.component';
import { OrderDetailedComponent } from './order-detailed/order-detailed.component';

//we identified the concept of angular lazyLoading in app-routing.module.ts in the comment there.
//it was about loading this module only when click on a button that forwards us to it.
//read the explanation in app-routing.module.ts and shop-routing.module.ts since it is explained well in those.
//to continue implementing it here:
const routes: Routes = [
  {path: '', component: OrdersComponent},
  {path: ':id', component: OrderDetailedComponent, data: {breadcrumb: {alias: 'OrderDetailed'}}}
];

@NgModule({
  declarations: [],
  imports: [
    RouterModule.forChild(routes) //for root is in app-routing.module.ts 
  ],
  exports: [RouterModule] //export router module so we can use "routerLink" in order-detailed.component.ts 
})
export class OrdersRoutingModule { }