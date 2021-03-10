import { Component, OnInit } from '@angular/core';
import { observable } from 'rxjs';
import { IBasketTotals } from '../../models/basket';
import { Observable } from 'rxjs';
import { BasketService } from 'src/app/basket/basket.service';

@Component({
  selector: 'app-order-totals',
  templateUrl: './order-totals.component.html',
  styleUrls: ['./order-totals.component.scss']
})


  /*
  -we need, in basket.component.html (below the html table we created where we displayed what was added to the basket) to show "total" calculations (products bill + shipping cost).
  -we will create for that a component (shared/components/order-totals.component.ts), then we will call it in the basket.component.html using <app-order-totals></app-order-totals>
  -and we should create an interface (angular model) for that in shared/models/basket called IBasketTotals.
  -also, we displayed this order-totals in checkout.component.ts 

  anyway, we are going to show these "total" calculations in basket component and checkout component and ...... 
  (in multiple components, not only use it in the basket html page !)
  
  so we will not subscribe to it directly in basket.service.ts, 
  we will store the returned observable from the https response in the basketTotalsSource special observable property in basket.service.ts.
  and read it in here from the public property basketTotals in basket.servie.ts,
  (again, remember the explanation in basket.service.ts for the BehaviousSubject (special observable) and the normal observable)
  (remember that in any html page, we extract value from an observable using "| async")

  use for that the injected basket.service.ts, and read the basketTotal$ from it.
  
  please go to basket.service.ts and read a lot of notes about obsevables, subscribing to it, .... and how we stored a basket totals calculaions in basketTotals$ there !
  
  
  read the basketTotals$ observable from the basket.service.ts,
  and assign it to the above local property userBasketTotals$ which is an observable of type IBasketTotals. 
  then display it in order-totals.component.html using "| async" (subscribe to that observable in the html file) 
  */


export class OrderTotalsComponent implements OnInit 
{
  //1-properties:
  userOrderTotals$: Observable<IBasketTotals>;

  //2-constructor:
  constructor(private basketService: BasketService) { }

  //3-methods:
  //lifecycle methods:
  //ngOnInit() will perform what is inside it once this component is instantiated.
  ngOnInit() 
  {
    this.userOrderTotals$ = this.basketService.basketTotal$;
  }

}
