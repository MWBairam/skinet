import { Injectable } from '@angular/core';
import { environment } from 'src/environments/environment';
import { HttpClient } from '@angular/common/http';
import { BehaviorSubject } from 'rxjs';
import { IBasket, IBasketItem, Basket, IBasketTotals } from '../shared/models/basket';
import { map } from 'rxjs/operators';
import { IDeliveryMethod } from '../shared/models/deliveryMethod';



@Injectable({
  providedIn: 'root'
})

//all the notes of this is existed in the basket.service.ts.notes.txt file in this folder.


export class BasketService {

  //1-properies:

  baseUrl = environment.apiUrl; 

  private basketSource = new BehaviorSubject<IBasket>(null); 
  basket$ = this.basketSource.asObservable();

  private basketTotalSource = new BehaviorSubject<IBasketTotals>(null);
  basketTotal$ = this.basketTotalSource.asObservable();

  shipping = 0;
  

  //2-Constructor:
  constructor(private http: HttpClient) { }

  //3-methods:
  addItemToBasket(item: IProduct, quantity = 1) 
  {

    const itemToAdd: IBasketItem = this.mapProductItemToBasketItem(item, quantity);
    let basket = this.getCurrentBasketValue();
    if (basket === null) {basket = this.createBasket();}
    basket.items = this.addOrUpdateItemQuantity(basket.items, itemToAdd, quantity);
    this.setBasket(basket);
  }

  private mapProductItemToBasketItem(item: IProduct, quantity: number): IBasketItem 
  {
    return {
      id: item.id,  
      productName: item.name,
      price: item.price,
      pictureUrl: item.pictureUrl,
      quantity,
      brand: item.productBrand,
      type: item.productType
    };
  }

  getCurrentBasketValue() 
  {
    return this.basketSource.value;
  }

  getBasket(id: string) 
  {
    return this.http.get(this.baseUrl + 'basket?id=' + id)
      .pipe
      (
        map
        (
          (basket: IBasket) => 
          {
            this.basketSource.next(basket);
            this.shipping = basket.shippingPrice;
            this.calculateTotals();
          }
        )
     
      );
  }

  setShippingPrice(dm: IDeliveryMethod)
  {
    this.shipping = dm.price;
    const basket = this.getCurrentBasketValue();
    basket.deliveryMethodId = dm.id;
    basket.shippingPrice = dm.price;
    this.calculateTotals();
    this.setBasket(basket);
  }

  calculateTotals() 
  {
    const basket = this.getCurrentBasketValue(); 
    const shipping = this.shipping; 
    const subtotal = basket.items.reduce((a, b) => (b.price * b.quantity) + a, 0);
    const total = subtotal + shipping;
    this.basketTotalSource.next({shipping, total, subtotal});
  }


  private createBasket(): IBasket
  {
    const basket = new Basket();
    localStorage.setItem('basket_id', basket.id);
    return basket;
  }

  setBasket(basket: IBasket) 
  {
    return this.http.post(this.baseUrl + 'basket', basket)
    .subscribe
    (
      (response: IBasket) => 
      {
      this.basketSource.next(response); 
      console.log(basket);
      this.calculateTotals();
      }, 
      error => 
      {
      console.log(error);
      }
    );
  }

  private addOrUpdateItemQuantity(items: IBasketItem[], itemToAdd: IBasketItem, quantity: number): IBasketItem[] 
  {
    const index = items.findIndex(i => i.id === itemToAdd.id); 
    if (index === -1) 
    {
      itemToAdd.quantity = quantity;
      items.push(itemToAdd);
    } 
    else 
    {
      items[index].quantity += quantity;
    }
    return items;
  }



  
  incrementItemQuantity(item: IBasketItem) 
  {
    const basket = this.getCurrentBasketValue(); 
    const foundItemIndex = basket.items.findIndex(x => x.id === item.id); 
    basket.items[foundItemIndex].quantity++; 
    this.setBasket(basket); 
  }
  decrementItemQuantity(item: IBasketItem) 
  {
    const basket = this.getCurrentBasketValue();
    const foundItemIndex = basket.items.findIndex(x => x.id === item.id);
    if (basket.items[foundItemIndex].quantity > 1) 
    {
      basket.items[foundItemIndex].quantity--;
      this.setBasket(basket);
    } 
    else 
    {
      this.removeItemFromBasket(item);
    }
  }
  removeItemFromBasket(item: IBasketItem) 
  {
    const basket = this.getCurrentBasketValue();
    if (basket.items.some(x => x.id === item.id)) 
    {
      basket.items = basket.items.filter(i => i.id !== item.id);
      if (basket.items.length > 0) 
      {
        this.setBasket(basket);
      } 
      else 
      {
        this.deleteBasket(basket); 
      }
    }
  }
  deleteBasket(basket: IBasket) {
    return this.http.delete(this.baseUrl + 'basket?id=' + basket.id)
    .subscribe 
    (
      () => {this.basketSource.next(null);this.basketTotalSource.next(null);localStorage.removeItem('basket_id');}, 
      error => {console.log(error);}
    );
  }
  eraseBasketInfo(id: string)
  {
    this.basketSource.next(null);
    this.basketTotalSource.next(null);
    localStorage.removeItem('basket_id');
  }

  createPaymentIntent() 
  {
    return this.http.post(this.baseUrl + 'payments/' + this.getCurrentBasketValue().id, {})
      .pipe 
      (     
        map
        (
          (basket: IBasket) => {this.basketSource.next(basket);console.log(this.getCurrentBasketValue());}
        )
      )
  }





}
