import { Component, OnInit } from '@angular/core';
import { Observable } from 'rxjs';
import { AccountService } from 'src/app/account/account.service';
import { BasketService } from 'src/app/basket/basket.service';
import { IBasket } from 'src/app/shared/models/basket';
import { IUser } from 'src/app/shared/models/user';

@Component({
  selector: 'app-nav-bar',
  templateUrl: './nav-bar.component.html',
  styleUrls: ['./nav-bar.component.scss']
})


export class NavBarComponent implements OnInit 
{

  //1-properties:
  userBasket$: Observable<IBasket>;
  /*
  Displaying the basket item count in the nav bar above the the icon of basket in the nav-bar so when we click on it, 
  do that in the nav-bar.component.ts here by reading the basket$ observable from the basket.service.ts,
  and assign it to the above local property userBasket$ which is an observable of type IBasket. 
  then display it in nav-bar.component.html using "| async" (subscribe to that observable in the html file) 

  use for that the injected basket.service.ts, and read the basket$ from it.
  
  please go to basket.service.ts and read a lot of nots about obsevables, subscribing to it, .... and how we stored a basket in basket$ there !
  */

  //also, to display the current logged in user info:
  //use the account.service.ts we created before, 
  //to read from it the observable currentUser$ which was set to the current logged user when the login method there was called !
  //so inject the account.service.ts below in the constructor, and read from it the currentUser$ in the ngOnInit()
  //and store it in this observable currentLoggedUser$ and subscribe to it in the nav-bar.component.ts using the "| async" pipe
  currentLoggedUser$: Observable<IUser>;



  //2-cosnstructor:
  constructor(private basketService: BasketService, private accountService: AccountService) { }

  //3-methods:
  //a-lifecycle methods:
  ngOnInit() 
  {
    this.userBasket$ = this.basketService.basket$;
    this.currentLoggedUser$ = this.accountService.currentUser$;
  }

  //b-also bring the logout() method from account.service.ts to be used here as an OnClick event in the logout button in the dropdownlist:
  userlogout() {
    this.accountService.logout();
  }

}
