import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { AccountService } from '../account.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})

/*
in shop.component.html, where we got data from the user in the search textbox,
we did not use the "Angular Form", 
but we added "template refrence variable" to the search input, using the #, and called it "search",
and we set its value in shop.component.ts directly by calling its name #search 
here, we will use the Angular form, becuase we are reading data from multiple textboxes,
so that reading them using #<name> would be much harder than collecting them in a form !
*/
/*
We have two different types of forms available in ANGULAR.
We have a formas module which is template driven, which means is driven by our HTML template.
That's part of our component.
And we also have a reactive formas module, which is a reactive way of managing our forms using observables.

we will use the reactive one since it allows us to write less html !
so that we need the ReactiveFormModule which we imported in shared.module.ts which in turn we imported in account.module.ts !
*/

/*
there's three different building blocks of forms.
There's the form control, there's a form group and there's a former and the full array we're not going
to use in this particular course.
But it's a useful tool to be able to add dynamic inputs into a form.
We're going to focus on form group and form control.
Now a form group contains a collection of form controls and the form control is going to be attached
to our inputs.
So in our case at the moment, that means it's attached to the email address and password field.
*/

export class LoginComponent implements OnInit 
{
  //1-Properties:
  //create a FormGroup, then below in createLoginForm(), we will fill it with FormControlls
  loginForm: FormGroup;
  //the below property is to save the current route where the user was forced to log in !
  //it is used in the auth.guard.ts in core/guard folder, when we prohibit the user from going to checkout page unless he is logged in,
  //so redirect him to login page, then after log in, redirect him to returnUrl 
  returnUrl: string;
  //it uses also the below ActivatedRoute injected in the constructor.


  //2-Constructor:
  //constructor(private accountService: AccountService, private router: Router, private activatedRoute: ActivatedRoute) { }
  //use the account.service.ts where the account methods are there !
  //also, use the Router to redirect the user to the Shop page after he logins.
  //also, inject the ActivatedRoute, and to know why we need it, read the notes above near the returnUrl property.
  constructor(private accountService: AccountService, private router: Router, private activatedRoute: ActivatedRoute){};


  //3-Methods:
  //a-lifecycle methods:
  //ngOnInit which perform what inside it once the component is instantiated !
  ngOnInit() {
    //to know why we need it, read the notes above near the returnUrl property.
    this.returnUrl = this.activatedRoute.snapshot.queryParams.returnUrl || '/shop'; //if we do not have returnUrl, simply set returnUrl to /shop

    //call the method below which fills the above FormGroup with the requiered FormControls for login:
    this.createLoginForm();
  }

  //method below which fills the above FormGroup with the requiered FormControls for login:
  createLoginForm() 
  {
    //initialize the above FormGroup property as a new one, and fill it with controls:
    this.loginForm = new FormGroup
    (
      {
        //two controls:
        //the FormControl class takes 2 parameters, the first one is the initial value that a control is holding, and we set this to '' empty string,
        //thesecond parameters is a group of validations. Angular frontEnd client app comes with an embedded frontend validation,
        //we will validate the field as requiered and for the email to have the email address structures such as having @ and ...
        //not that the validations here should be consistent with the ones in the BackEnd in API project in Dtos folder in loginDto
        //or at least as much simillar as possible.
        email: new FormControl('', [Validators.required, Validators.pattern('^[\\w-\\.]+@([\\w-]+\\.)+[\\w-]{2,4}$')]),
        password: new FormControl('', Validators.required)
      }
    );
  }

  //method to be called once we click on logIn button in the form:
  onSubmit() 
  {
    //use the account.service.ts where the account methods are there !
    //use the login method we wrote there,
    //which will send the https://localhost:4200/api/account/login to the API project AccountController, 
    //which will return a UserDto and we will recieve it in IUser model in acount.service.ts in the login method !
    //and the login method in the API project AccountController will return error 401  in the shape we designed in Errors folder in API project if the user is not existed in the AspNetUsers table.
    
    //remember that the method returns an observable which we should subscribe to it to extract its value, then perform anything while subscribing to it !
    this.accountService.login(this.loginForm.value)
    .subscribe
    (
    () => {this.router.navigateByUrl('/shop'); console.log(this.loginForm.value);console.log('User logged in Successfully'); }, 
    //use the Router to redirect the user to the Shop page after he logins.
    //or we can make use of the above returnUrl (which was created for different purpose) to redirect the user to the page he was in.
    error => {console.log(error);}
    );
  }
}
