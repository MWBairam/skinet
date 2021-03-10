import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { CheckoutComponent } from './checkout.component';
import { CheckoutRoutingModule } from './checkout-routing.module';
import { SharedModule } from '../shared/shared.module';
import { CheckoutAddressComponent } from './checkout-address/checkout-address.component';
import { CheckoutDeliveryComponent } from './checkout-delivery/checkout-delivery.component';
import { CheckoutReviewComponent } from './checkout-review/checkout-review.component';
import { CheckoutPaymentComponent } from './checkout-payment/checkout-payment.component';
import { CheckoutSuccessComponent } from './checkout-success/checkout-success.component';




@NgModule({
  declarations: [CheckoutComponent, CheckoutAddressComponent, CheckoutDeliveryComponent, CheckoutReviewComponent, CheckoutPaymentComponent, CheckoutSuccessComponent],
  imports: [
    CommonModule,
    CheckoutRoutingModule,

    //import the shared.module.ts so we can use the order-totals component where we display the basket/checkout summary:
    SharedModule
  ]
})
export class CheckoutModule { }


