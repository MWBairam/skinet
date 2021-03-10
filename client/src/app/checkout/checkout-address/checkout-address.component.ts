import { Component, Input, OnInit } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { ToastrService } from 'ngx-toastr';
import { AccountService } from 'src/app/account/account.service';

@Component({
  selector: 'app-checkout-address',
  templateUrl: './checkout-address.component.html',
  styleUrls: ['./checkout-address.component.scss']
})

/*
and there is no route for those checkout components (checkout-address, checkout-delivery, checkout-review, checkout-payment)
in app-routing.component.ts since we do not want the user to browse directly to those components,
and we want them to be controller directly by the stepper
*/


export class CheckoutAddressComponent implements OnInit 
{
  //1-properties:
  @Input() myCheckoutForm: FormGroup;
  //we have a parent component checkout.component.ts, in it we have the parent property checkoutForm: FormGroup.
  //we have this child component checkout-address.component.ts, in it we have the child property myCheckoutForm: FormGroup 
  //in checkout.component.html we will pass the parent property checkoutForm -> to the child property myCheckoutForm so that data in
  //checkout-address.component.ts are filled.



  //2-constructor:
  //inject account.service.ts for the reason explained below in the saveUserAddress method,
  //use the toastr (we explained in core/interceptors/error.interceptor.ts) to display success notification upon successfull save
  constructor(private accountService: AccountService, private toastr: ToastrService) { }

  //methods:
  ngOnInit() 
  {
  }


  //we will not ask the user to add his address info while Registering. 
  //We will allow him to do that when he is in the checkout page, in the "Address" tab, using the form there and the button "save as default address"
  //2 methods are in account.service.ts to be used in the checkout.component.ts to read the address
  //and here in checkout-addres.component.ts to update the address info
  //(not used in the login.component or register.component)

  //get the user's address from the "Addres" table in the AppIdentityDbContext is done in checkout.component.ts
  //and the info are populated in the addressForm textboxes

  //if the user wants to change the populated data and update them, 
  //or if there is no address info in the first place and the user would like to save new address info:
  saveUserAddress() 
  {
    //take out the values from the textboxes in the addressForm in the checkoutForm,
    //remember that we are sending the token in this request using the core/interceptors/jwt.interceptor.ts
    //user Id is determined in AccountController in UpdateUserAddress out of his email embedded in the sent token.
    
    this.accountService.updateUserAddress(this.myCheckoutForm.get('addressForm').value)
    .subscribe 
    (
      () => {this.toastr.success('Address saved');}, 
      error => {this.toastr.error(error.message);console.log(error);}
    );
    //the UpdateUserAddress in AccountController upon successfull update, returns the updated address info in AddressDto (here we recive it as IAddress)
    //so subscribe to the observable in the returned https response,
    //(we did not extract the IAddress modelvlaues from the subscribed observable, 
    //and I do not know why we made the UpdateUserAddress in AccountController upon successfull update, returns the updated address info in AddressDto ?! )
    //anyway, while subscribing, display an toastr notification if there is an address returned ! or error notification ! 
  }




}
