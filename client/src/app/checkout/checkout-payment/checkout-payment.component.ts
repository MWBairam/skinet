import { AfterViewInit, Component, ElementRef, Input, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { FormGroup } from '@angular/forms';
import { NavigationExtras, Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { BasketService } from 'src/app/basket/basket.service';
import { IBasket } from 'src/app/shared/models/basket';
import { IOrder } from 'src/app/shared/models/order';
import { CheckoutService } from '../checkout.service';

//to know what is this, please read the note below in the ngAfterViewInit() method.
declare var Stripe;

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

//in the methods in this class, we will implement new 2 types of lifecycle methods:
export class CheckoutPaymentComponent implements OnInit, AfterViewInit, OnDestroy 
{
  //1-properties:
  @Input() myCheckoutForm: FormGroup;
  //we have a parent component checkout.component.ts, in it we have the parent property checkoutForm: FormGroup.
  //we have this child component checkout-address.component.ts, in it we have the child property myCheckoutForm: FormGroup 
  //in checkout.component.html we will pass the parent property checkoutForm -> to the child property myCheckoutForm so that data in
  //checkout-address.component.ts are filled.

  //the following properties are added for the divs in the checkout-payment.component.ts with template refrence name (#<name>)
  //so we can read/validate their values from here
  @ViewChild('cardNumber', { static: true }) cardNumberElement: ElementRef;
  @ViewChild('cardExpiry', { static: true }) cardExpiryElement: ElementRef;
  @ViewChild('cardCvc', { static: true }) cardCvcElement: ElementRef;

  //and the below are used to in the methods below as a mid-level to set the @viewChild in this .ts file:
  cardNumber: any;
  cardExpiry: any;
  cardCvc: any;

  //and the below "stripe" is used tp hold our stripe account publishable key (the same one in API project in appSettings.json file).
  //in index.html <script src="https://js.stripe.com/v3/"></script>.
  stripe: any;

  /*
  and the cardErrors to hold the validation errors comes from the stripe pure javascript validation we imported.
  but what saves the errors in cardErrors ?
  the handler which listens to the changes on the js elements to save its value dynamically,
  and with the help of OnChange method we created below, and bound the handler to it, we can save the errors in cardErrors.
  we used this cardHandler in the ngAfterViewInit.
  */
  cardErrors: any;
  cardHandler = this.onChange.bind(this);

  /*
  those below are an extension for the above 2 properties functionalities,
  will be used as boolean to say if the stripe html elements (card number, card expairy and card cvc) are
  valid according to the stripe java script validations are done !
  (you may not understand what are the strip html elements, or the validations it does, so please continue reading this
  file and the html file as well).

  then these booleans are going to be used to enable/disable the button "submit order" in the html file.
  */
  cardNumberValid = false;
  cardExpiryValid = false;
  cardCvcValid = false;

  /*
  the below property will be used to disable the button "submit order" once it is clicked ! so that the user is protected from
  clicking the same button multiple times ! 
  we will make it enabled  by default, once the button is clicked and below method submitOrder() is called, make it disabled.
  when the method submitOrder finishes up, it will be again to enabled ! but the user will be redirected to the sucess page in 
  case of payment success, or home page in case of payment failure.

  how we are going to do that ? inside the <button> tag in checkout-payment.component.html, use this boolean property to controle
  if the button is enabled/disabled. 
  */
  buttonIsDisabled = false;
  
  
  
  //2-constructor:
  //we need the basket service to call the eraseBasketInfo (please read its functionality in basket.service.ts ).
  //we need the checkout.service.ts to use the createOrder method there (here is the last step in creating an order, then send it to the createOrder in checkout.service.ts where it will send it to the API)
  //we need the toastr service to display the error in case of order submit process is unsuccessful.
  //(for the successfull cases, we will redirect to a "successful" page so that we need the Router).
  constructor(private basketService: BasketService, private checkoutService: CheckoutService, private toastr: ToastrService, private router: Router) { }



  //3-methods:
  //a-lifecycle methods: 
  /*
  remember those come from the implementation above in export class CheckoutPaymentComponent implements OnInit, AfterViewInit, OnDestroy 
  in angular we use what is called lifecycle hooks or methods, 
  those are methods called according to the component lifecyle status,
  example:
  ngOnChanges(): When an input/output binding value changes (when the properties above are assigned values)
  ngOnInit(): After the first ngOnChanges. (in another meaning, once the component is instantiated)
  ngOnDestroy(): Just before the directive is destroyed.
  ngAfterViewInit(): Respond after Angular initializes the component's views and child views, or the view that contains the directive.
  and ......
  if all of the lifecycle hooks were used, they would be called in a specific order absolutely.
  //https://angular.io/guide/lifecycle-hooks
  */
  //3-a-1: ngOnInit 
  ngOnInit(): void 
  {
    //we will not use it here, no need for it.
  }
  //3-a-2: ngAfterViewInit 
  ngAfterViewInit(): void 
  {
    //use the above "stripe" property to store our stripe account pulishable key (the same one in API project in appSettings.json file).
    //from the index.html <script src="https://js.stripe.com/v3/"></script>, use the "Strip()" functionality for that.
    //note that because of the stripe pure javascript functionalities, we needed for Stripe() to declare the :declare var Stripe; above in the top of this file.
    this.stripe = Stripe('pk_test_51IUEriFOwelJ6W75hOcBbk6lRdmq0H4UoZ2gM8GpGxiVtsGbboIslo2ge1uhg41IWfriZVjR1H3iWd93hj1P5HUH00kel9lcm5');

    //from the index.html <script src="https://js.stripe.com/v3/"></script> also initialize 
    //the payment, via card, html elements in the empty divs we created in the checkout-payment.component.ts : 
    const elements = this.stripe.elements();
    //and assign those elements to the cardNumber, cardExpiry andcardCvc above,
    //and mount those on the @viewChild properties which are displayed in the html file,
    //and listen to the value changes for detecting any js validation error, so the handler will pass them to OnChange method to be saved in cardErrors.
    this.cardNumber = elements.create('cardNumber');
    this.cardNumber.mount(this.cardNumberElement.nativeElement);
    this.cardNumber.addEventListener('change', this.cardHandler);

    this.cardExpiry = elements.create('cardExpiry');
    this.cardExpiry.mount(this.cardExpiryElement.nativeElement);
    this.cardExpiry.addEventListener('change', this.cardHandler);

    this.cardCvc = elements.create('cardCvc');
    this.cardCvc.mount(this.cardCvcElement.nativeElement);
    this.cardCvc.addEventListener('change', this.cardHandler);
  }
  //3-a-3: ngOnDestroy()
  ngOnDestroy(): void 
  {
    //when this component is being disopsed, destroy thos properties values:
    this.cardNumber.destroy();
    this.cardExpiry.destroy();
    this.cardCvc.destroy();
  }


  //b-our methods:
  //3-b-1: submitorder:
  //this will be assigned as a click event in the "Submit Order" button in the checkout-payment.component.ts 
  submitOrder() 
  {
    this.buttonIsDisabled = true; //for this, please read the note besides this property identification above.
    //the order we will send to the createOrder method in OrdersController in the API is described in IOrder in shared/models/order.ts
    //IOrder is used in the createOrder method in chekout.service.ts
    const basket = this.basketService.getCurrentBasketValue();
    const basket_Id = basket.id;
    const deliveryMethod_Id = +this.myCheckoutForm.get('deliveryForm').get('deliveryMethod').value;
    const ship_To_Address = this.myCheckoutForm.get('addressForm').value;
    //create the order to be sent:
    const orderToCreate = { 
      basketId: basket_Id,
      deliveryMethodId: deliveryMethod_Id,
      shipToAddress: ship_To_Address
      //properties here should like the ones in IOrder which is used in createOrder method in chekout.service.ts we are sending this order to.
      //becarefull, since typescript will not correct the properties names since we did not identified the type of orderToCreat as IOrder explicitly.
    }
    //pass the order to createOrder method in chekout.service.ts which will send it to the createOrder method in OrdersController in the API
    this.checkoutService.createOrder(orderToCreate)
    .subscribe //remember that createOrder method in OrdersController in the API returns the order we created in the shape of IOrder we descibed in shared/models/order.ts
    (
      //subscribe to the returned observable, and store the extracted value in the below "order"
      (order: IOrder) => 
      {
        this.toastr.success('Order created successfully, now doing the payment ... !'); //display notification of success
        /*
        now we know that the order has been written in the "Orders" DB table,
        but before forwarding the user to the success page, we need to take the money out of him !

        (we cannot take the money out of him before submitting the order into "Orders" table in the DB. 
        thats why we are doing this step here after the this.checkoutService.createOrder(orderToCreate) )

        (the only problem we might have is that payment fails after submitting the order into "Orders" table in the DB, 
        but we can notice that because the status in the order would remains as pending.)

        remember that the paymentIntent had been created before, when the user clicked on "go to payment" button in checkout-review.component.ts/html.
        (read the notes there, and remember the picture 257-3 for the steps illustration)

        ********and I should say that the following process is frontend only, and the PaymentController is not involved. only creation of the PaymentIntent involves PaymentController.
        
        so now:
        -confirmCardPayment() below comes from the stripe pure javascript functionality we added in index.html <script src="https://js.stripe.com/v3/"></script>.
        -"stripe" is a property above.
        (note that because of the stripe pure javascript functionalities, we needed to declare the :declare var Stripe; above in the top of this file.)
        -after that the confirmCardPayment() will return the PaymentIntent had been created before, sayin that a payment related to that PaymentIntent also now has been done. 
        so we can validate that in the .then() below. and if existed, displays payment done sucessfully and erase the basket contents and forward the user to the success page, 
        otherwise, display payment error.
        */
        //the confirmCardPayment() takes 2 parameters, the clientSecret which was created when the PaymentIntent was created before (so now it is used to the payment),
        //and the payment_method in which we identify the card number used and name on card.
        this.stripe.confirmCardPayment(basket.clientSecret, {payment_method:  {card: this.cardNumber, billing_details:{name: this.myCheckoutForm.get('paymentForm').get('nameOnCard').value}}   })
        .then
        (
          result => //populate the returned PaymentIntent into "result". //remember that after the successfull payment, we said above that stripe will return the previously created intent.
          {
            console.log(result);
            if(result.paymentIntent)
            {
              //the result returned has a field called "paymentIntent" or "error"
              //so if "paymentIntent" is existed, so that the payment has been done succesfully.
              //so:
              this.toastr.success('Payment has been done successfully');
              this.basketService.deleteBasket(basket); //remove the basket info and basket Id from browser and the basket from redis (read the notes about this method in basket.service.ts)
              //also, after success, we need to redirect the user to the "success" web page,
              //and also display the successfull order has been submitted.
              //so while redirecting to "success" page, pass what we call it navigationExtras,
              //then in success.component.ts we configure it to use the navigationExtras !
              //(remember what we did in the error.interceptor.ts and the server-error.component.ts)
              const navigationExtras: NavigationExtras = {state: order}; 
              this.router.navigate(['checkout/success'], navigationExtras); //routes are in app-routing.module.ts and checkout-routing.component.ts
              
              this.buttonIsDisabled = false; //for this, please read the note besides this property identification above.
            }
            else
            {
              //the retuerned message from stripe has a field called error which has a field called message:
              this.toastr.error('Payment Error' + ': ' + result.error.message);
              console.log(result.error.message);
              //what if the user tried to submit order again after the payment failure?
              //there will be a problem described in video 271, with a solution for it !
              //the solution was complicated to keep a good user experience !
              //but I solved it only by deleting the user basket and redirecting him to home page so forcing him to create the basket again !
              //it is a bad user experience to re fill the basket again to retry payment ! but easier than implementing the complicated solution in the video.
              this.basketService.deleteBasket(basket);
              this.router.navigateByUrl('/');
              //the problem with my solution is that the user with each try, a new order willl be submitted in the "Order" table in the Db,
              //but will be marked with status=PaymentFailed in the status column !
            
              this.buttonIsDisabled = false; //for this, please read the note besides this property identification above.
            }
          }
        );
      }, 
      
      //if the order has not been submitted successfully to the "Orders" table in the DB:
      error => 
      {
        this.toastr.error(error.message); 
        console.log(error);
        this.buttonIsDisabled = false; //for this, please read the note besides this property identification above.
      }

    )
  }
  //note: the lecturer in video 272 has made this submitOrder method as async await typescript method as we did that in C# asp.net,
  //but I did not do that.
  //and instead of using console.log() for the errors in each if, he used try/catch to log that in the console,
  //but I also did not use that.


  //3-b-2:
  // //this is related to the cardHandler which passes the validation results of the index.html <script src="https://js.stripe.com/v3/"></script>
  // //rememeber the handler is used in ngAfterVireInit and bound to this method above in the properties section.
  // onChange({error}) 
  // {
  //   //the js script of stripe we used in index.html <script src="https://js.stripe.com/v3/"></script> validates the ....
  //   //and in case of errors, it produces and element called "error",
  //   //we can write inside the onChange(event), then below we can write event.error and event.error.message 
  //   //or we can extract the "error" which we are interested in, directly by writing onChange({error}).
  //   //this is called "destructuring".
  //   if (error) 
  //   {
  //     //save the error in the cardErrors to be displayed in the html page.
  //     this.cardErrors = error.message;
  //   } else 
  //   {
  //     this.cardErrors = null;
  //   }
  // }
  //updating the above method to take the "event" completely:
  onChange(event) 
  {
    //the event is poped out from the handler and the Event listeners used above,
    //the event is simply a json script appears if we want in the browser console:
    // console.log(event);
    //for the errors, we will use event.error
    //for validating the completness and correctness of the stripe html elements (card number, card expairy and card cvc), we will use event.message.complete field
    //rememebr that the validation is done via index.html <script src="https://js.stripe.com/v3/"></script> 
    if (event.error) 
    {
      //save the error in the cardErrors to be displayed in the html page.
      this.cardErrors = event.error.message;
    } else 
    {
      this.cardErrors = null;
    }



    //we will use the boolean properties above to enable/disable the button "submit order" in the html file
    //according to the completness and correctness of the stripe html elements
    //please read the notes above when we first identified these bollean properties:
    switch(event.elementType) 
    {
      case 'cardNumber':
        this.cardNumberValid = event.complete;
        break;
      case 'cardExpiry':
        this.cardExpiryValid = event.complete;
        break;
      case 'cardCvc':
        this.cardCvcValid = event.complete;
        break;
    }
  }
}
