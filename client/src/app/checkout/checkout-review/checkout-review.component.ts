import { CdkStepper } from '@angular/cdk/stepper';
import { Component, Input, OnInit } from '@angular/core';
import { ToastrService } from 'ngx-toastr';
import { Observable } from 'rxjs';
import { BasketService } from 'src/app/basket/basket.service';
import { IBasket } from 'src/app/shared/models/basket';

@Component({
  selector: 'app-checkout-review',
  templateUrl: './checkout-review.component.html',
  styleUrls: ['./checkout-review.component.scss']
})

/*
and there is no route for those checkout components (checkout-address, checkout-delivery, checkout-review, checkout-payment)
in app-routing.component.ts since we do not want the user to browse directly to those components,
and we want them to be controller directly by the stepper
*/


/*
what we will do here is exactly to display what is in basket.component.html !
but without the increment and decemnt and trash buttons !

so as we did in basket.component.ts, create an observable and store in it the the observable in the basket.service.ts,
then display it in checkout-review.component.html using "| async" (subscribe to that observable in the html file)
and use for that the injected basket.service.ts

the lecturer in videos 239 and 240 made the basket.component is shared, then used it in basket.component.html and 
*/


/*
also at this point, when the user clicks on "go to payment" we should create the PaymentIntent with stripe payment processor.
Remember from the picture 257-3 that we should create the PaymentIntent before submitting an order.
*/

export class CheckoutReviewComponent implements OnInit 
{
  //1-properties:
  //this is to displaye the basket in the checkout-review.component.html 
  userBasket$: Observable<IBasket>;
  //the is an Input property:
  @Input() appStepper: CdkStepper;
  //This is an Input child property to be used in checkout.component.ts/html
  //there should be a relevant parent property to it in checkout.component.ts 
  //but indeed, the parent property for it is the <app-stepper [linearModeSelected]="false" #MyAppStepper> element in the checkout.component.html.
  //so in checkout.component.ts, we will MyAppStepper to this InputProperty, but what I want from it here?
  //if the createPaymentIntent method below is successful (when click on "go to payment"), 
  //we will allow move to the next step (checkout-payment.component.ts/html)
  //and that is instead of using the cdkStepperNext in the button. 
  
  /*
  the below property will be used to disable the button "go to payment" once it is clicked ! so that the user is protected from
  clicking the same button multiple times ! since this button creates payment intent with stripe.
  we will make it enabled  by default, once the button is clicked and below method createUserPaymentIntent() is called, make it disabled.
  when the method createUserPaymentIntent finishes up, it will be again to enabled ! but the user will be taken to the checkoutpayment page in 
  case of payment success, or server-error page in case of payment failure.

  how we are going to do that ? inside the <button> tag in checkout-review.component.html, use this boolean property to controle
  if the button is enabled/disabled. 
  */
  buttonIsDisabled = false;

  //2-constructor:
  constructor(private basketService: BasketService, private toastr: ToastrService) { }

  //3-methods:
  //a-lifecycle methods:
  ngOnInit() 
  {
    this.userBasket$ = this.basketService.basket$;
  }


 /*
  Note: the PaymentIntent should be created in the stripe before the user tries to submit the order (please remember the picture 257-3 in section 21)
  so that we will implement createPaymentIntent (we wrote in basket.service.ts) method in checkout-review.component.html when the user click "Go to Payment" 
  so before entering the payment tab, the intent is created.
  then in the payment tab, when the user fills in the card info, and click submit order, the API will check with stripe if an intent had been created with the clientSecret we stores in the basket,
  and if yes, submit the order in the Orders table in the DB and take out the money.

  if the user went back and clicked on "Go to Payment" button in checkout-review.component.html again,
  the paymentIntent had been created with the first click will be updated since we still have the same basket.
  (this is designed and validated in basketService.createPaymentIntent() )
 */
  createUserPaymentIntent() 
  {
    this.buttonIsDisabled = true; //for this, please read the note besides this property identification above.
    //call the method we designed in basketService:
    return this.basketService.createPaymentIntent()
    .subscribe
    (
      //upon successful payment intent creation, move to the next step (please read the notes above in @Input appStepper)
      //and display success notification (anyway, the user does need to know if an intent has been created !)
      //when you create a PyamentIntent with stripe, it returns thhe created Intent, with PaymentIntentId and ClientSecret,
      //and in createPaymentIntent we update those values to be stored in basket.
      //please do not console log the returned  PaymentIntent since it has the ClientSecret to be used in the next payment process in the checkout-payment.component.ts
      (response: any) => 
      {
        this.toastr.success('PaymentIntent has been created successfully. Please finish this up by submitting your order.'); 
        this.appStepper.next();
        this.buttonIsDisabled = false; //for this, please read the note besides this property identification above.
      },  
      error => 
      {
        console.log(error);
        this.buttonIsDisabled = false; //for this, please read the note besides this property identification above.
      }
    )
  }

}
