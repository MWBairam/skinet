  
import { Injectable } from '@angular/core';
import { environment } from 'src/environments/environment';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { BehaviorSubject, ReplaySubject, of } from 'rxjs';
import { IUser } from '../shared/models/user';
import { map, take } from 'rxjs/operators';
import { Router } from '@angular/router';
import { IAddress } from '../shared/models/address';

//make it injectable sowe can inject it anywhere else
@Injectable({
  providedIn: 'root'
})
export class AccountService 
{
  //1-properties:
  //baseurl in the appSettings.Development.json https://localhost:4200/api/
  baseUrl = environment.apiUrl;

  //create a "special observable" (BehaviorSubject):
  //very good explanation about observables as it is existed in the basket.service.ts. Please read al the notes there before completing the below.
  //    private currentUserSource = new BehaviorSubject<IUser>(null);
  //indeed, here we will not use BehaviourSubject observable, we will use ReplaySubject, which is quiet simillar to BehaviourSubject,
  //but has no initial value when it is not set to any thing.
  //this is important only for the functionality described in auth.guard.ts in core/guard folder, in CanActivate method for the .pipe there waiting for something.
  //video 205.
  private currentUserSource = new ReplaySubject<IUser>(1); //1 means it contains one object of IUser.
  //and read it using a public "normal observable":
  currentUser$ = this.currentUserSource.asObservable();
  //very good explanation about observables as above is existed in the basket.service.ts. Please read al the notes there before completing the below.

  //2-constructor:
  //use the httpClient module which will send the https requests,
  //use the Router to redirect the user to Home page once he logs out !
  constructor(private http: HttpClient, private router: Router) { }

  //3-methods:

  //methods here are exaclty the same concept in API project, in AccountController !

  //a-login:
  login(values: any) 
  {
    //send the https://localhost:4200/api/account/login to the API project, which will return a UserDto and we will recieve it in IUser model !
    return this.http.post(this.baseUrl + 'account/login', values) 
    .pipe
    (
      map((user: IUser) => //the reyrned value of type IUser existed in shared/models
      {
        if (user) //if not returned null:
        {
          localStorage.setItem('token', user.token); //save the user's token on the localstorage of the browser ! so the token is persistent there.
          this.currentUserSource.next(user); 
          //the returned value here in the https response is an observable becuase we did not subscribe to it using .subscribe()
          //so store it in the above currentUserSource which is private, and read by the currentUser normal observable,
          //then in any html file, we will subscribe to it using the | async !
          //remember the notes in basket.service.ts !
        }
      })
    );
  }
  //b-register:
  register(values: any) 
  {
    //send the https://localhost:4200/api/account/register to the API project, which will return a UserDto and we will recieve it in IUser model !
    return this.http.post(this.baseUrl + 'account/register', values) 
    .pipe(
      map((user: IUser) => //the reyrned value of type IUser existed in shared/models
       {
        if (user) //if not returned null:
        {
          localStorage.setItem('token', user.token); //save the user's token on the localstorage of the browser ! so the token is persistent there.
          this.currentUserSource.next(user);
          //the returned value here in the https response is an observable becuase we did not subscribe to it using .subscribe()
          //so store it in the above currentUserSource which is private, and read by the currentUser normal observable,
          //then in any html file, we will subscribe to it using the | async !
          //remember the notes in basket.service.ts !
        }
      })
    );
  }

  //c-logout:
  logout() 
  {
    //the logout concept is only about the removal of the user's token from the browser local storage, 
    //so when he tries to send an https request to the API project, to any function with [Authorize] data annotation there,
    //he will not be allowed to do that there !

    //ther is no logout method in the AccountController in API project, it is a concept to be done from client angular side only !
    localStorage.removeItem('token');
    this.currentUserSource.next(null); //and set the above observable to null
    this.router.navigateByUrl('/'); //and redirect the user to the Home page ! (routing is sat up in app-routing.module.ts )
  }

  //d-validate email existance:
  checkEmailExists(email: string) 
  {
    //send https request https://localhost:4200/api/account/emailexists?email=xxxxx 
    //to the AccountController in the API project which returns true if there is a user in the AspNetUsers table using the passed email here !
    return this.http.get(this.baseUrl + 'account/emailexists?email=' + email);
  }

  //e-load current logged in user:
  //after the login, if we refresh the browser, we lose the login state !! 
  //so to persist the login use the below method loadCurrentUser(token: string) in this account.service.ts.
  //remember from API project, AccountController, GetCurrentUser() method which is called by sending the https request https://locallhost:4200/api/account,
  //and remember that we need to embbed the logged in user's token in the https Header, in the Authorization part of it.
  //so prepare the below method with a parameter in which we will pass the logged in user's token.
  //we used it in the app.component.ts
  loadCurrentUser(token: string) 
  {
    if (token === null) 
    {
      this.currentUserSource.next(null);
      return of(null); 
      // "of" means an observable. and of(null) means an observable with null inside it.
      //we we need to return null in observable ?
      //becuase we we are not returning a subscribed observable here, and we are subscribing to an observable returned from here in app.component.ts when we called this method there !
    }

    //    let headers = new HttpHeaders();  
    //    headers = headers.set('Authorization', `Bearer ${token}`);
    //    return this.http.get(this.baseUrl + 'account', {headers}).pipe( // ...... the rest of the command below) 
    /*
    -go back to AccountController, it has [Authorize] annotation, which means the user cannot send https requests to methods there unless logged in.
    -also, some methods there extracts user's info (email and display name ) from the token (we inserted those in the token creation process in Infrastructure project, Services folder, TokenService.cs).

    for both of the 2 reasons, we need to insert the current logged in user's token in the https header (Authorization part of the header).
    and to do that, we can use the .set() above in each method we want like here, 
    or depend on the jwt.interceptor.ts in shared/interceptors folder here which does that automatically since it is imported in app.module.ts
    */
    return this.http.get(this.baseUrl + 'account') 
    .pipe //the API project, AccountController, GetCurrentUser() method will return a UserDto which will be recieved in the IUser model here and we will store it in the observable above !
    (
      map
      (
        (user: IUser) => 
        {
        if (user) 
        {
          localStorage.setItem('token', user.token);
          this.currentUserSource.next(user);
        }
      })
    );
  }


  //we will not ask the user to add his address info while Registering. 
  //We will allow him to do that when he is in the checkout page, in the "Address" tab, using the form there and the button "save as default address"
  //the below 2 methods are used in the checkout.component.ts and checkout-addres.component.ts
  //(not in the login.component or register.component)
  //get the user's address from the "Addres" table in the AppIdentityDbContext:

  //remember that we are sending the token in this request using the core/interceptors/jwt.interceptor.ts
  //user Id is determined in AccountController in UpdateUserAddress out of his email embedded in the sent token.
  
  getUserAddress() {
    return this.http.get<IAddress>(this.baseUrl + 'account/address');
  }
  //add/update the user's address by sending this https put request carrying the parameter "address" as the body of the request:
  updateUserAddress(address: IAddress) {
    return this.http.put<IAddress>(this.baseUrl + 'account/address', address);
  }
}
