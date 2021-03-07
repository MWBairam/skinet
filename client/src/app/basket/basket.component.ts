import { Component, OnInit } from '@angular/core';
import { Observable } from 'rxjs';
import { IBasket, IBasketItem } from '../shared/models/basket';
import { BasketService } from './basket.service';

@Component({
  selector: 'app-basket',
  templateUrl: './basket.component.html',
  styleUrls: ['./basket.component.scss']
})
export class BasketComponent implements OnInit {

  //1-properties:
  userBasket$: Observable<IBasket>;
  /*
  styling the basket html page, 
  do that in the here by reading the basket$ observable from the basket.service.ts,
  and assign it to the above local property userBasket$ which is an observable of type IBasket. 
  then display it in basket.component.html using "| async" (subscribe to that observable in the html file) 

  use for that the injected basket.service.ts, and read the basket$ from it.
  
  please go to basket.service.ts and read a lot of notes about obsevables, subscribing to it, .... and how we stored a basket in basket$ there !
  */

  //2-cosnstructor:
  constructor(private basketService: BasketService) { }

  //3-methods:
  //a-lifecycle methods:
  ngOnInit() 
  {
    this.userBasket$ = this.basketService.basket$;
  }
  //b-methods to:
  /*
  -in basket html page, activate the increment and decrement font awesome icons so we can click on them to increas/decrease quantity of an item.
  also, in basket html page, activate the trash font awesome icon so we can click on it to delete an item form the basket,
  -in order to do that, create the requierd methods in basket.service.ts, and use them in basket.component.ts, and add the requierd onClick events on icons in basket.component.html 
  */
  removeBasketItem(item: IBasketItem) 
  {
   this.basketService.removeItemFromBasket(item);
  }

  incrementItemQuantity(item: IBasketItem) 
  {
   this.basketService.incrementItemQuantity(item);
  }

  decrementItemQuantity(item: IBasketItem) 
  {
   this.basketService.decrementItemQuantity(item);
  }



}
