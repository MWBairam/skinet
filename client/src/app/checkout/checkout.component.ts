import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { AccountService } from '../account/account.service';

@Component({
  selector: 'app-checkout',
  templateUrl: './checkout.component.html',
  styleUrls: ['./checkout.component.scss']
})
export class CheckoutComponent implements OnInit 
{
  //we will use the ReactiveForm to collect data from user in this component.
  //ReactiveForms is imported in shared.module.ts which is imported in checkout.module.ts
  
  //Note: I have explained everything about Angular forms in app/account/login/login.component.ts and html file
  //so please read it from there first !
  //also different way of creating FormGroup is illustrated in register.component.ts

  //1-Properties:
  checkoutForm: FormGroup;

  //2-constructor:
  //inject the form builder
  //inject the account.service.ts (see the note below in getAddressFormValues())
  constructor(private fb: FormBuilder, private accountService: AccountService) { }

  //3-methods:
  ngOnInit() 
  {
    //once this component is instantiated, create the angular form wew designed in createCheckoutForm below:
    this.createCheckoutForm();

    //also, populate the logged in user's address from the Address table in the checkoutForm.addressForm:
    this.getAddressFormValues();
    //read the notes below about it and in the account.service.ts
  }

  createCheckoutForm() 
  {
    //we can create the FormGroup using this.checkoutForm = new FormGroup({ //myFormControlls }) as we did in login.component.ts
    //or use the formBuilder like below as we did in register.component.ts:
    this.checkoutForm = this.fb.group
    (
      //in the checkoutForm, we should create also 4 sub-forms for the different components we have to be displayed in the stepper.
      //for the checkout-address.component.ts, checkout-delivery.component.ts, checkout-review.component.ts, checkout-payment.component.ts
      {
        addressForm: this.fb.group
        (
          {
            //in this FormGroup, create the FormControlls:
            //the first para is initial value which is null, then in the second para use the [Requiered] validator:
            firstName: [null, Validators.required],
            lastName: [null, Validators.required],
            street: [null, Validators.required],
            city: [null, Validators.required],
            state: [null, Validators.required],
            zipcode: [null, Validators.required],
          }
        ),

        deliveryForm: this.fb.group
        (
          {
            deliveryMethod: [null, Validators.required]
          }
        ),

        paymentForm: this.fb.group
        (
          {
            nameOnCard: [null, Validators.required]
          }
        )
      }
    );
  }


  //we will not ask the user to add his address info while Registering. 
  //We will allow him to do that when he is in the checkout page, in the "Address" tab, using the form there and the button "save as default address"
  //the below method are used in the uses the .getUserAddress from the account.service.ts
  //(and use in here checkout.component.ts not in the login.component or register.component)
  //get the user's address from the "Addres" table in the AppIdentityDbContext:

  //remember that we are sending the token in this request using the core/interceptors/jwt.interceptor.ts
  //user Id is determined in AccountController in UpdateUserAddress out of his email embedded in the sent token.
  
  getAddressFormValues() 
  {
    this.accountService.getUserAddress().subscribe
    (
      //subscribe to the observable returned in the https response, populate the value to "address"
      //then if not null, patch it to the formControls of the formGroup "addressForm" above:
      address => {if (address) {this.checkoutForm.get('addressForm').patchValue(address);}}, 
      error => {console.log(error);}
    );
  }

  //if the user wants to change the populated data and update them, 
  //or if there is no address info in the first place and the user would like to save new address info,
  //in checkout-address.component.ts we will do that using the method:
  //saveUserAddress()
  
}
