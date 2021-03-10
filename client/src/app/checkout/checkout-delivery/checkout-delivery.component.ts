import { Component, Input, OnInit } from '@angular/core';
import { FormGroup } from '@angular/forms';
import { BasketService } from 'src/app/basket/basket.service';
import { IDeliveryMethod } from 'src/app/shared/models/deliveryMethod';
import { CheckoutService } from '../checkout.service';

@Component({
  selector: 'app-checkout-delivery',
  templateUrl: './checkout-delivery.component.html',
  styleUrls: ['./checkout-delivery.component.scss']
})

/*
and there is no route for those checkout components (checkout-address, checkout-delivery, checkout-review, checkout-payment)
in app-routing.component.ts since we do not want the user to browse directly to those components,
and we want them to be controller directly by the stepper
*/


export class CheckoutDeliveryComponent implements OnInit 
{
  //1-Properties:
  @Input() myCheckoutForm: FormGroup;
  //we have a parent component checkout.component.ts, in it we have the parent property checkoutForm: FormGroup.
  //we have this child component checkout-delivery.component.ts, in it we have the child property myCheckoutForm: FormGroup 
  //in checkout.component.html we will pass the parent property checkoutForm -> to the child property myCheckoutForm so that data in
  //checkout-delivery.component.ts are filled.

  //also, we will display the delivery methods we have in the DB, bring them as below and store them in this list
  //IDeliveryMethod is in shared/models/deliverymethods.ts 
  deliveryMethods: IDeliveryMethod[];

  //2-constructor:
  //inject the checkoutService we designed:
  //the basket.service.ts is used in setShippingPrice method below, read the notes there.
  constructor(private checkoutService: CheckoutService, private basketService: BasketService) { }

  ngOnInit() 
  {
    this.getDeliveryMethods();
  }

  getDeliveryMethods()
  {
    //get the https response observable using the checkoutService we injected,
    //then subscribe to it to extract its value, nad store it in the above list deliveryMethods:
    this.checkoutService.getDeliveryMethods()
    .subscribe
    (
      (dm: IDeliveryMethod[]) => {this.deliveryMethods = dm;}, 
      error => {console.log(error);}
    );
  }

  /*
  send the choosen delivery method to basket.service.ts where we calculate the totals there, which is considered
  the source of data where the order-summary.component.ts reads the totals, subtotal, and the shipping price
  to display them in basket.component.html and in checkout.component.html.
  
  this method is assigned as a click event in the html file, so we get the selcted method from there, then send it to basket.service.ts
  */
  setUserShippingPrice(deliverMethod: IDeliveryMethod)
  {
    this.basketService.setShippingPrice(deliverMethod);
  }
}