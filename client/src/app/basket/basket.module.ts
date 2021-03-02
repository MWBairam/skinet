import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { BasketComponent } from './basket.component';
import { BasketRoutingModule } from './basket-routing.module';
import { OrderTotalsComponent } from '../shared/components/order-totals/order-totals.component';
import { SharedModule } from '../shared/shared.module';



@NgModule({
  declarations: [BasketComponent],
  imports: [
    CommonModule,

    //routes:
    BasketRoutingModule,

    //order-totals.component.ts is in the shared module:
    SharedModule
  ]
})
export class BasketModule { }
