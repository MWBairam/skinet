import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Routes, RouterModule } from '@angular/router';
import { CheckoutComponent } from './checkout.component';
import { CheckoutSuccessComponent } from './checkout-success/checkout-success.component';


//set up routes using the concept of lazy loading as we did in video 114 for shop-routing.module.ts and shop.module.ts:
//identify the route below ('' here means this component)
//pass it to the below import of RouterModule
//then import this routing module in checkout.module.ts 
const routes: Routes = [
  {path: '', component: CheckoutComponent},
  {path: 'success', component: CheckoutSuccessComponent}
];


@NgModule({
  declarations: [],
  imports: [
    RouterModule.forChild(routes) //forRoot is in app-routing.module.ts 
  ],
  exports: [RouterModule]
})
export class CheckoutRoutingModule { }
