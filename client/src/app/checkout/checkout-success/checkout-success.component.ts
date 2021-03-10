import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { IOrder } from 'src/app/shared/models/order';

@Component({
  selector: 'app-checkout-success',
  templateUrl: './checkout-success.component.html',
  styleUrls: ['./checkout-success.component.scss']
})

/*
and there is no route for those checkout components (checkout-address, checkout-delivery, checkout-review, checkout-payment)
in app-routing.component.ts since we do not want the user to browse directly to those components,
and we want them to be controller directly by the stepper
*/


export class CheckoutSuccessComponent implements OnInit 
{

  //1-properties:
  order: IOrder;

  //2-constructor:
  constructor(private router: Router) 
  {
    /*
    In checkout-payment.component.ts, in createOrder method,
    we will redirect the user to here.
    the redirection to here will carry the submitted order to here as well to be displayed.

    so while redirecting to "success" page here, pass what we call it navigationExtras,
    then in success.component.ts here we configure it to use the navigationExtras !
    (remember what we did in the error.interceptor.ts and the server-error.component.ts)

    */
    const navigation = this.router.getCurrentNavigation();
    const state = navigation && navigation.extras && navigation.extras.state;

    if (state) 
    {
      this.order = state as IOrder;
    }
  }

  //3-methods:
  ngOnInit() 
  {
  }

}
