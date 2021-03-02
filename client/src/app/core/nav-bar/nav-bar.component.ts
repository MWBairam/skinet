import { Component, OnInit } from '@angular/core';
import { Observable } from 'rxjs';
import { BasketService } from 'src/app/basket/basket.service';
import { IBasket } from 'src/app/shared/models/basket';

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

  //2-cosnstructor:
  constructor(private basketService: BasketService) { }

  //3-methods:
  //a-lifecycle methods:
  ngOnInit() 
  {
    this.userBasket$ = this.basketService.basket$;
  }

}
