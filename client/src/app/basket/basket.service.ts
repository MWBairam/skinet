import { Injectable } from '@angular/core';
import { environment } from 'src/environments/environment';
import { HttpClient } from '@angular/common/http';
import { BehaviorSubject } from 'rxjs';
import { IBasket, IBasketItem, Basket, IBasketTotals } from '../shared/models/basket';
import { map } from 'rxjs/operators';


//make this service file injectable of ocurse, so we can inject it in the basket.component.ts 
@Injectable({
  providedIn: 'root'
})


export class BasketService {

  //1-properies:
  //a-the base url we want to form our https request in the below methods:
  baseUrl = environment.apiUrl; //https://localhost:4200/api/ 
  //b-properties of type of "observable", which we need to store the returned observable from the https response.
  private basketSource = new BehaviorSubject<IBasket>(null); //this is a special type of observables, we specified in it the exact type of data to be retuerned which is of IBasket model, and if empty, return an object of IBasket with null info ! (complete reading the notes below)
  basket$ = this.basketSource.asObservable();
  /*1)
  the private property is an observable of a special type, and called BehaviourSubject.
  what is special about it is that it always returns a value even if it is empty, which we specified here as "null" and we can specify the value we want (read note 4 to know the reason)
  and when it is filled with data, it is an observable which holds data of type IBasket (model in shred/models folder which represents a basket and its items) 
  */
  /* 2)
  more info about the observables of type "BehaviourSubject" is found in https://www.joshmorony.com/using-behaviorsubject-to-handle-asynchronous-loading-in-ionic/#:~:text=A%20BehaviorSubject%20is%20a%20type,from%20HTTP%20requests%20in%20Angular).&text=When%20you%20subscribe%20to%20it,data%20has%20been%20emitted%20yet)
  A BehaviorSubject is a type of observable (i.e. a stream of data that we can subscribe to like the observable returned from HTTP requests in Angular). 
  I say a type of observable because it is a little different to a standard observable. 
  We subscribe to a BehaviourSubject just like we would a normal observable, 
  but the benefit of a BehaviourSubject for our purposes is that:
  -It will always return a value, even if no data has been emitted from its stream yet
  -When you subscribe to it, it will immediately return the last value that was emitted immediately (or the initial value if no data has been emitted yet)
  -Just load data once, or only when we need to
  -Ensure that some valid value is always supplied to whatever is using it (even if a load has not finished yet)
  -Instantly notify anything that is subscribed to the BehaviorSubject when the data changes
  */
  /*3)
  the second property is of type "Observable" (the normal observable)
  since it is a normal observable, use the $ at the end of its name.
  it is just a public property which we can read from everywhere, and we are storing it the private basketSource
  (we could have made one property, but it is alawys to do it like this way, one is private and is gets set by a method below,
    the other one is a public which we use it to get that private property value) 
  read the notes below in the getBasket method to know more about observables in https responses, and subscribing and unsubscribing to it
  */
  /*4)
  the reason we need a special type of observable which returns a "null (empty) IBasket" or "filled IBasket" with info from redis is that
  we said in the BasketController GetBasket method (and inBasketRepository), that if we tried to bring a basket with an Id not existed !
  we will instantiate the CustomerBasket model (in API project) and IBasket model (in angular) which is empty
  and return it to be displayed as empty basket,
  and not create anything in redis !
  then when user fills it with items, and UpdateBasket method is called (in API project BasketController),
  the basket will be created !
  */


  /*
  same above explanation for the following properties as well:
  -we need, in basket.component.html (below the html table we created where we displayed what was added to the basket) to show "total" calculations (products bill + shipping cost).
  -we will create for that a component (shared/components/order-totals.component.ts), then we will call it in the basket.component.html using <app-order-totals></app-order-totals>
  -and we should create an interface (angular model) for that in shared/models/basket called IBasketTotals.

  anyway, we are going to show these "total" calculations in basket component and checkout component and ...... 
  (in multiple components, not only use it in the basket html page !)
  so we will not subscribe to it directly in here, we will store the returned observable from the https response in the below proprties.
  (again, remember the explanation above for the BehaviousSubject (special observable) and the normal observable)
  (remember that in any html page, we extract value from an observable using "| async")

  related methods to it is calculateTotals(), which is used in getBasket() and setBasket().
  */
  private basketTotalSource = new BehaviorSubject<IBasketTotals>(null);
  basketTotal$ = this.basketTotalSource.asObservable();
  







  //2-Constructor:
  //inject the HttpClient service we want to use the .get and .post and .... methods to send https requests 
  constructor(private http: HttpClient) { }


 








  //3-methods:
  //======================================================================================================================
  //get a basket from redis based on its Id:
  //we will send an https request: https://localhost:4200/api/basket?id="basketId" so that GetBasketById method will be automatically called in BasketController in the API project 
  //then we will get the https response
  //to take out a value from this response, we need to do .subscribe  
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
            //the .pipe and map and .next are used to assign the returned observable to the above special observable basketSource                                 
            //in ssection-header.component.ts, we assigned the returned abservable directly to a normal observable, so we did not use those at all.

            this.calculateTotals();
            //the calculateTotal is a private method written below.
            //to know the story behind this method, read the notes above near the property "basketTotalSource".
          }
        )
     
      );
    /*
    As we learnt in, for example, the shop.component.ts, in getProducts() method (and other methods), that an observable is contained in the https response !
    In order to read values from that observables, we need to subscribe to it using the .subscribe()
    after we finish from the observable, we need to unsubscribe it !
    (we did not unsubscribe it manually in the methods in shop.components.ts, because the ngOnInit() there will destroy the component and its returned observables once the component is disposed)
    here, we did not use the .subscribe(), but we used something diferent (almost as we did in the section-header.component.ts in the core folder)
    we got only the observable from the https response, 
    we formatted it to be in the "IBasket" (model or interface in shared/models),
    then we stored it in the observable above basketSource !
    then if we need to read a readable value from this abservabl in basket.component.html to diplsay it (or in any html file),
    we simply subscribe to it using html pipes (like we did in section-header.component.html) which is "| async",
    so in a tag contains the basket$, we write "basket$ | async" so we extract the IBasket value from it !
    */
    /*
    the reason we stored the returned observable (came from the https response) in an observable above, and we did not subscribe to it directly here
    is that we we may need to get the user's basket in multiple components other that here only,
    so any time, to bring the basket info, call the below getCurrentBasketValue() method which will return the above identified observable property !
    then in any other html file, extract the value from it using "| async" as we explained in the notes above ! 
    */
  }

  /*
  indeed, this method is used because we may need to get the user's basket in multiple components other that here only,
  so any time, to bring the basket info, call this info which will return the above identified observable property !
  then in any other html file, extract the value from it using "| async" as we explained in the notes above ! 
  */
  getCurrentBasketValue() 
  {
    return this.basketSource.value;
  }
  //======================================================================================================================










  //======================================================================================================================
  setBasket(basket: IBasket) 
  {
    return this.http.post(this.baseUrl + 'basket', basket)
    .subscribe
    (
      (response: IBasket) => 
      {
      this.basketSource.next(response); 
      //for troubleshooting, log to browser console:
      console.log(basket);

      //also:
      this.calculateTotals();
      //the calculateTotal is a private method written below.
      //to know the story behind this method, read the notes above near the property "basketTotalSource".
      }, 
      error => 
      {
      console.log(error);
      }
    );

    //it is a post method to post the "basket" of type IBasket info we are sending to redis.
    //and we are sending this https request https:localhost:4200/api/basket with a body filled with json data of the basket info.
    //so that the UpdateBasket method is called (in API project BasketController).
    //this does need only this.http.post(this.baseUrl + 'basket', basket), so we added the .subscribe() part !
    //becuase remember that the UpdateBasket method (in API project BasketController) will return the basket we updated as well,
    //so we need to extract it from the https response 
  }
  //======================================================================================================================












  //======================================================================================================================
  //now, we will write a method to create an IBasketItem 
  addItemToBasket(item: IProduct, quantity = 1) 
  {
    /*
    to add a basket item (IBasketItem) in a basket (Basket) (remember from shared/models that the Basket has an array if IBasketItem[]),
    we will pass to this function a product (IProduct) which a user choosed to add, with a default quantity of 1,
    then from the IProduct, we will create an IBasketItem using the below method we created mapProductItemToBasketItem()
    */
    const itemToAdd: IBasketItem = this.mapProductItemToBasketItem(item, quantity);
    /*
    then get the user's basket using the above created method getCurrentBasketValue(),
    and remember, as we saiid above, if the user has no basket,
    we will instantiate the CustomerBasket model (in API project) and IBasket model (in angular) which is empty
    and return it to be displayed as empty basket,
    and not create anything in redis !
    */
    let basket = this.getCurrentBasketValue();
    //then if it is a null, create a basket using the below method createBaske() and set the created basket to the "basket":
    if (basket === null) {basket = this.createBasket();}
    /*now add this IBasketItem (which was created from the IPdroduct) to the Basket,
    but If the user clicked twice on the "add to basket" button of the same product ? we should update the quantity of the existed item, not adding it twice !
    and to achive that, we use the below method addOrUpdateItemQuantity() (read how it checks if a product is existed as an item in the basket or no)
    */
    basket.items = this.addOrUpdateItemQuantity(basket.items, itemToAdd, quantity);
    /*
    now, call the above identified method, setBasket, to add the "basket" we created to redis using an https post request to the API
    some will ask, we are cretaing the basket again in redis !!
    yes, we are overriding the already existed basket (remember we brought it from the above let basket = this.getCurrentBasketValue(); )
    and if not existed, create a new one !
    */
    this.setBasket(basket);
  }
  //helper methods:
  private mapProductItemToBasketItem(item: IProduct, quantity: number): IBasketItem 
  {
    return {
      id: item.id,  //the IBasketItem Id is exaclty the IProduct Id
      productName: item.name,
      price: item.price,
      pictureUrl: item.pictureUrl,
      quantity,
      brand: item.productBrand,
      type: item.productType
    };
  }
  private createBasket(): IBasket //return an object of IBasket 
  {
    /*
    instantiate an object of Basket (which has Id and BasketItem[]) from the IBasket 
    as we explained in shared/models/basket, one we instantiate this, and Id is going to be created to it using the uuid (since redis will never creates Ids of course)
    */
    const basket = new Basket();
    /*
    now, we want if a user closesd the website, or stopped the browser, and comes back to the browser and opened the website again, 
    to find his basket again,
    so we are using the localstorage function, which will save the basketId in the browser ! so that we can load a basket by retrieving a basketId from the browser localstorage !
    Note: if user opened chrome, added to the basket, then closed chrome, then opened the website from firefox, the basket will not appear !
    Note: if user1 opened chrome and added to basket, then closed the website, then user2 opened the website, he will find in his basket user1's basket !!
    I do not kwon why the lecturer did that !!
    a better souldtion is to use sql, and store baskets in a table which contains userName using the microsooft Identity (attach it with the functionalities of login) ! 
    then bring a user's basket whatever the browser is, and without colliding with other users' basket who used the same browser before,
    or never store the basket at all ! and remove it once the user closes the website !
    */
    localStorage.setItem('basket_id', basket.id);
    return basket;

    /*
    we had a problem in video 149 last 3 minutes, which is:
    when we refresh the web page, and add a new item again to the already created basket (and already saved in the local storage of the browser)
    , a new basket_id is created to store and holde the old items and the new added one after the refresh, 
    replacing the old basket_id !
    (take a look on the browser localstorage (using the inspect tool) where we store a basket_id , and notice how basket_id changes when we perform the above scenrio)
    
    to solve the above problem,
    add a code in app.component.ts to check, once the angular starts, if there is a basket_id in the local storage of the browser, 
    so set the special observable "basketSource" in basket.service.ts to that existed basket, using the getbasket() method (which came from basket.service.ts) 
    (despite its name is getBasket(), it returns a basket value, and assign in basket.service.ts the special observable "basketSource" to that returned basket !)
    
    and remember that we saved the basket_id in the browser in the basket.service.ts in the createBasket method
    */
  }
  private addOrUpdateItemQuantity(items: IBasketItem[], itemToAdd: IBasketItem, quantity: number): IBasketItem[] 
  {
    /*
    since the IBasketItem Id is the IProduct Id, checks if the product to add is existed between the basket items 
    by checking and comparing the Product Id to add with all existed basket items Ids,
    and thats how we figure out if a product is an already existed item in the basket or no !
    */
    const index = items.findIndex(i => i.id === itemToAdd.id); //finIndex is just like the .find lambda expression in C#
    if (index === -1) //-1 means not found !
    {
      //so add this product as an item to the basket 
      itemToAdd.quantity = quantity;
      items.push(itemToAdd);
    } 
    else 
    {
      //if existed, just increase the item quantity:
      items[index].quantity += quantity;
      //items is an arry,
      //to access the elemnt of the requierd Id, use items[index], for example items[3]
    }
    return items;
  }
  //to know the story behind this method, read the notes above near the property "basketTotalSource":
  private calculateTotals() {
    
    const basket = this.getCurrentBasketValue(); //use the above method getCurrentBasketValue() to get the current basket which its id is in the browser local storage and it is itself stored in redis
    
    const shipping = 0; //for now, consider the shipping cost is 0
    
    const subtotal = basket.items.reduce((a, b) => (b.price * b.quantity) + a, 0);
    //subtotal is Sum(forEach product, product quantity * product price)
    //instead of using for or forEach loops, we use another method by angular which is reduce,
    //the b is the "item" from items (basket is type of IBasket, items is the IBasketItem[] (remember shared/models/basket)), 
    //a is the final result of the reduc method, and we are accumulating the value in it using the (b.price * b.quantity) + a, where the initial value of a is 0 
    
    const total = subtotal + shipping;
    
    //now, store the value of total as a special observable of type IBasketTotal (BehaviourSubject) in basketTotalSource property,
    //so we can read the basketTotalSource (via reading basketTotal) in any html page !
    this.basketTotalSource.next({shipping, total, subtotal});
  }
  //======================================================================================================================







  //=====================================================================================================================
  /*
  -in basket html page, activate the increment and decrement font awesome icons so we can click on them to increas/decrease quantity of an item.
  also, in basket html page, activate the trash font awesome icon so we can click on it to delete an item form the basket,
  -in order to do that, create the requierd methods in basket.service.ts, and use them in basket.component.ts, and add the requierd onClick events on icons in basket.component.html 
  */
  incrementItemQuantity(item: IBasketItem) 
  {
    //use the above method getCurrentBasketValue() to get the current basket which its id is in the browser local storage and it is itself stored in redis
    const basket = this.getCurrentBasketValue(); 
    //in the basket (IBasket{"Id":  , "Items": }) (and each item is IBasketItem{"id": , "price": , "quantity": , ....}), 
    //check if the item to be increased is existed, and extract its Id
    const foundItemIndex = basket.items.findIndex(x => x.id === item.id); //finIndex returns an Index !
    //items is an arry,
    //to access the elemnt of the requierd id, use items[index], for example items[3]
    basket.items[foundItemIndex].quantity++; //increase quantity
    this.setBasket(basket); //use the above identified method setBasket, to override the already existed basket with the same basket but with the new values
  }

  decrementItemQuantity(item: IBasketItem) 
  {
    //same explanation as above:
    const basket = this.getCurrentBasketValue();
    const foundItemIndex = basket.items.findIndex(x => x.id === item.id);
    //but if the item to be decreased, has more quantity bigger than 1, simply decrease its amount:
    //else, if its quantity is 1, and we clicked on decrease, that means to remove item from basket:
    if (basket.items[foundItemIndex].quantity > 1) 
    {
      basket.items[foundItemIndex].quantity--;
      this.setBasket(basket);
    } 
    else 
    {
      this.removeItemFromBasket(item); //call the below removeItemFromBasket method:
    }
  }
  removeItemFromBasket(item: IBasketItem) 
  {
    //use the above method getCurrentBasketValue() to get the current basket which its id is in the browser local storage and it is itself stored in redis
    const basket = this.getCurrentBasketValue();
    //if the item to be decreased is existed (use .some):
    if (basket.items.some(x => x.id === item.id)) 
    {
      //we need to remove an item from the basket,
      //so filter out the item id that we do not want, and keep the other items stored in a basket
      basket.items = basket.items.filter(i => i.id !== item.id);
      //then after filtering out that item to remove from the basket, the basket may be with zero items !
      //if not, simply use the above identified method setBasket, to override the already existed basket with the same basket but with the new values
      if (basket.items.length > 0) 
      {
        this.setBasket(basket);
      } 
      //else, we need to remove the basket:
      else 
      {
        this.deleteBasket(basket); //call the method below:
      }
    }
  }
  deleteBasket(basket: IBasket) {
    //call the DeleteBasket method in API project BasketController by sending this https delete request: https://localhost:4200/api/basket?id=xxx
    return this.http.delete(this.baseUrl + 'basket?id=' + basket.id)
    .subscribe //a confirm will be returned in the https delete response, subscribe to the observable returned, 
    (
      //set the above property basketSource to null, also basketTototalSource to null, and remove the stored basket_id in the browser local stoage which we stored in createBasket and made it persistent in the app.component.ts
      () => {this.basketSource.next(null);this.basketTotalSource.next(null);localStorage.removeItem('basket_id');}, 
      error => {console.log(error);}
    );
  }


}
