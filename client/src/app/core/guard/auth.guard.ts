import { Injectable } from '@angular/core';
import { CanActivate, ActivatedRouteSnapshot, RouterStateSnapshot, UrlTree, Router } from '@angular/router';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { AccountService } from 'src/app/account/account.service';




/*
-if we go to basket, when the user clicks on checkout, we will not allow him to go to the checkout.component.ts/html unless he is logged in !!
-we will do that from the frontend side using what we call it the auth-guard 
(from API BackEnd side, when can write above the Controller used for that the Data annotation [Authorize])
(and we are going to do Authoriztion from BackEnd side, because it is related to the user's token, and the one we are doing here is in frontEnd only !!)
-in src/app/core folder, create a folder called "guard"
-then in it:
guard>ng g g auth --skip-tests //angular generate guard and its name is auth 
//then we will be asked to choos the type of the guard:
//we have 3 types:
CanActivate  //in which we can determine a condition to go to a specific route (routes are in app-routing.module.ts) 
CanActivateChild //in which we can determine a condition to go to a specific child route (child routes like the ones in shop-routing.module.ts) 
CanLoad //in which we can determine a condition to load an entire module or no 
//we want here the CanActivate

//what is generated is:
CREATE src/app/core/guard/auth.guard.ts (456 bytes)
*/

//make sure it is injectable so we can use it anywhere we want.
@Injectable({
  providedIn: 'root'
})

//typescript class:
export class AuthGuard implements CanActivate 
{
  //1-properties:


  //2-constructor:
  //inject the account.service.ts where the login method is there !
  //inject Router so we can go to routes we want 
  constructor(private accountService: AccountService, private router: Router) {}


  //3-methods:
  //usually from whatwe learnt before, we implemented the OnngInt interface and used its method OnngInt() (lifecycle methods),
  //here it is a guard, so we are implementing the above CanActivate interface, and using the CanActivate below method:
  //it is a method that takes 2 parameters, the route which we want to go to, and the current route,
  //and returns an observable of type boolean !
  canActivate(next: ActivatedRouteSnapshot, state: RouterStateSnapshot): Observable<boolean> 
  {
    //indeed, if the user is logged in, the currentUser$ observable in account.service.ts is filled with logged user info,
    return this.accountService.currentUser$. //no need to subscribe using .subscribe()
    pipe //pipe means wait until currentUser$ has something (whether null or a value ) //for this pipe here, we used in account.service,ts a type of observable called ReplaySubject, not the BehaviourSubject or the normal subject !
    (
      map
      (
        //store the returned observable in "auth", then say if auth is not empty, return true (observable of boolean type), else,
        //redirect the user to account/login page,
        //then after login, redirect or take him to the page he was intending to go to.
        //(note: to make a use of the below queryParams: {returnUrl:, you should add that functionality in login.component.ts)
        auth => {    if (auth) {return true;} this.router.navigate(['account/login'], {queryParams: {returnUrl: state.url}});    }
      )
    );
  }
  //use this guard in the app-routing.module.ts where our routes are there, and use it for the route to checkout module.
}