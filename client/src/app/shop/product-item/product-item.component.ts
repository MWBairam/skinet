import { Component, Input, OnInit } from '@angular/core';
import { BasketService } from 'src/app/basket/basket.service';

@Component({
  selector: 'app-product-item',
  templateUrl: './product-item.component.html',
  styleUrls: ['./product-item.component.scss']
})
export class ProductItemComponent implements OnInit 
{

  //1-properties:
  //the following is an input property decorated with @, 
  //and it allows us to use this property in product-item.component.html:
  @Input() product: IProduct; 
  //the type of this property is IProduct model from the models folder in the shared folder
  //this is an Input type of properties !
  //which means it has a parent property in shop.component.ts (or any other component)
  //in this project:
  //in shop.components.ts we have this property: products: IProduct[];
  //here we have this property: @Input() product: IProduct; 
  //then in shop.component.html, we pass each "product" in products: IProduct[]; (parent) property to the @Input() product: IProduct; (child property)


  //2-constructor:
  //inject the basket.service.ts here in order to use its methods:
  constructor(private basketService: BasketService) { }


  //3-methods:
  //a-lifecycle methods:
  ngOnInit() {
  }
  //b-call the method addItemToBasket from the BasketService hile passing to it the above product property:
  //let us call the below function also addItemToBasket:
  addItemToBasket()
  {
    this.basketService.addItemToBasket(this.product);
  }

}
