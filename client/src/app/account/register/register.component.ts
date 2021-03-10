  
import { Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, Validators, AsyncValidatorFn } from '@angular/forms';
import { AccountService } from '../account.service';
import { Router } from '@angular/router';
import { timer, of } from 'rxjs';
import { switchMap, map } from 'rxjs/operators';

@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.scss']
})

export class RegisterComponent implements OnInit 
{
  //What are the types of the Angular Forms ?
  //why we are using them ?
  //How to build forms ?
  //All these questions are answered in the (login.component.ts, login.component.html), so Please, take a look on there first !
  
  
  //1-properties:
  //the FormGroup, which we will initialize in the below createRegisterForm() method and fill in it with the FormControls:
  registerForm: FormGroup;
  //in the OnSubmiy() method, backend will return errors of 401 validation-based errors like email is already in use or weak password
  //so we will extract the array of errors from https response, and store it in this array and display it in the html file:
  errors: string[];


  //2-contstructor:
  //use ethe account.service.ts we desinged in where we have our account methods.
  //use the Router as well to redirect the user to the Home page or .... once he submits his register.
  //also, here use the FormBuilder (we did not use it in login.component.ts, and it is another way for creating FormGroup) which is used in the below createRegisterForm()
  constructor(private fb: FormBuilder, private accountService: AccountService, private router: Router) { }

  //3-methods:
  //a-lifecycle methods:
  ngOnInit() 
  {
    this.createRegisterForm();
  }
  //b-register methods:
  //create form:
  createRegisterForm() 
  {
    //we can say:
    //this.registerForm = new FormGroup //as we did in login.component.ts
    //or use the FormBuilder module as another way of creating the FormGroup 
    this.registerForm = this.fb.group
    (
      {
        //three controls:
        //the FormControl class takes 2 parameters, the first one is the initial value that a control is holding, and we set this to '' empty string,
        //thesecond parameters is a group of validations. Angular frontEnd client app comes with an embedded frontend validation,
        //we will validate the field as requiered and for the email to have the email address structures such as having @ and ...
        //not that the validations here should be consistent with the ones in the BackEnd in API project in Dtos folder in registerDto
        //or at least as much simillar as possible.
      displayName: [null, [Validators.required]],
      email: [null,[Validators.required, Validators.pattern('^[\\w-\\.]+@([\\w-]+\\.)+[\\w-]{2,4}$')]],
      password: [null, [Validators.required]]
      }
    );
  }
  //method to be called once we click on logIn button in the form:
  onSubmit() 
  {
    //use the account.service.ts where the account methods are there !
    //use the register method we wrote there,
    //which will send the https://localhost:4200/api/account/register to the API project AccountController, 
    //which will return a UserDto and we will recieve it in IUser model in acount.service.ts in the register method !

    //remember that the method returns an observable which we should subscribe to it to extract its value, then perform anything while subscribing to it !
    this.accountService.register(this.registerForm.value)
    .subscribe
    (
      response => {this.router.navigateByUrl('/shop');}, 
      //use the Router to redirect the user to the Shop page after he logins
      error => {console.log(error);this.errors = error.errors;}
      //for filling the "errors" array with errors, please read the note at the top above "errors" property.
    );
  }
  //if the .register returned https response error 401 (which was returned from AccountController)
  //that means the register failed
  //so that the error.interceptor.ts in core/interceptors folder wil automatically catch the error and act as we configured there
  //to display the error using the toastr notification


  //the lecturer added a function to do dynamic async check for email if it is existed and used before 
  //calling the API AccountController, CheckEmailExistsAsync method using this.accountService.checkEmailExists(control.value)
  //so that the user while he is typing the email, he gets a result of the check before clicking the register button !
  //but I did not do it !
}


