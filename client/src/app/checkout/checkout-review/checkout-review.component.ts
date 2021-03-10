import { Component, OnInit } from '@angular/core';
import { Observable } from 'rxjs';
import { BasketService } from 'src/app/basket/basket.service';
import { IBasket } from 'src/app/shared/models/basket';

@Component({
  selector: 'app-checkout-review',
  templateUrl: './checkout-review.component.html',
  styleUrls: ['./checkout-review.component.scss']
})

/*
and there is no route for those checkout components (checkout-address, checkout-delivery, checkout-review, checkout-payment)
in app-routing.component.ts since we do not want the user to browse directly to those components,
and we want them to be controller directly by the stepper
*/


/*
what we will do here is exactly to display what is in basket.component.html !
but without the increment and decemnt and trash buttons !

so as we did in basket.component.ts, create an observable and store in it the the observable in the basket.service.ts,
then display it in checkout-review.component.html using "| async" (subscribe to that observable in the html file)
and use for that the injected basket.service.ts

the lecturer in videos 239 and 240 made the basket.component is shared, then used it in basket.component.html and 
*/

export class CheckoutReviewComponent implements OnInit 
{
  //1-properties:
  userBasket$: Observable<IBasket>;

  //2-constructor:
  constructor(private basketService: BasketService) { }

  //3-methods:
  //a-lifecycle methods:
  ngOnInit() 
  {
    this.userBasket$ = this.basketService.basket$;
  }

}
