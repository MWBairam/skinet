import { Component, Input, OnInit } from '@angular/core';
import { FormGroup } from '@angular/forms';
import { NavigationExtras, Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { BasketService } from 'src/app/basket/basket.service';
import { IBasket } from 'src/app/shared/models/basket';
import { IOrder } from 'src/app/shared/models/order';
import { CheckoutService } from '../checkout.service';

@Component({
  selector: 'app-checkout-payment',
  templateUrl: './checkout-payment.component.html',
  styleUrls: ['./checkout-payment.component.scss']
})

/*
and there is no route for those checkout components (checkout-address, checkout-delivery, checkout-review, checkout-payment)
in app-routing.component.ts since we do not want the user to browse directly to those components,
and we want them to be controller directly by the stepper
*/


export class CheckoutPaymentComponent implements OnInit 
{
  //1-properties:
  @Input() myCheckoutForm: FormGroup;
  //we have a parent component checkout.component.ts, in it we have the parent property checkoutForm: FormGroup.
  //we have this child component checkout-address.component.ts, in it we have the child property myCheckoutForm: FormGroup 
  //in checkout.component.html we will pass the parent property checkoutForm -> to the child property myCheckoutForm so that data in
  //checkout-address.component.ts are filled.
  
  
  
  //2-constructor:
  //we need the basket service to call the eraseBasketInfo (please read its functionality in basket.service.ts ).
  //we need the checkout.service.ts to use the createOrder method there (here is the last step in creating an order, then send it to the createOrder in checkout.service.ts where it will send it to the API)
  //we need the toastr service to display the error in case of order submit process is unsuccessful.
  //(for the successfull cases, we will redirect to a "successful" page so that we need the Router).
  constructor(private basketService: BasketService, private checkoutService: CheckoutService, private toastr: ToastrService, private router: Router) { }

  ngOnInit(): void 
  {
  }
  
  //this will be assigned as a click event in the "Submit Order" button in the checkout-payment.component.ts 
  submitOrder() 
  {
    //the order we will send to the createOrder method in OrdersController in the API is described in IOrder in shared/models/order.ts
    //IOrder is used in the createOrder method in chekout.service.ts
    const basket_Id = this.basketService.getCurrentBasketValue().id;
    const deliveryMethod_Id = +this.myCheckoutForm.get('deliveryForm').get('deliveryMethod').value;
    const ship_To_Address = this.myCheckoutForm.get('addressForm').value;
    //create the order to be sent:
    const orderToCreate = { //IOrder as used in createOrder method in chekout.service.ts
      basketId: basket_Id,
      deliveryMethodId: deliveryMethod_Id,
      shipToAddress: ship_To_Address
    }
    //pass the order to createOrder method in chekout.service.ts which will send it to the createOrder method in OrdersController in the API
    this.checkoutService.createOrder(orderToCreate)
    .subscribe //remember that createOrder method in OrdersController in the API returns the order we created in the shape of IOrder we descibed in shared/models/order.ts
    (
      //subscribe to the returned obsservable, and store the extracted value in the below "order"
      (order: IOrder) => {
      this.toastr.success('Order created successfully'); //display notification of success
      this.basketService.eraseBasketInfo(basket_Id); //remove the basket info and basket Id from browser (read the notes about this method in basket.service.ts)
      //also, after success, we need to redirect the user to the "success" web page,
      //and also display the successfull order has been submitted.
      //so while redirecting to "success" page, pass what we call it navigationExtras,
      //then in success.component.ts we configure it to use the navigationExtras !
      //(remember what we did in the error.interceptor.ts and the server-error.component.ts)
      const navigationExtras: NavigationExtras = {state: order}; 
      this.router.navigate(['checkout/success'], navigationExtras); //routes are in app-routing.module.ts and checkout-routing.component.ts
    }, 


    error => {this.toastr.error(error.message); console.log(error);}
    
    )
  }
}
