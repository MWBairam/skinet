import { Component, OnInit } from '@angular/core';
import { BasketService } from './basket/basket.service';


@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})

export class AppComponent implements OnInit   
{
    //1-properties:
    title = 'Skinet';

    //2-constructor:
    /*
    inject the basket.service.ts here in order to use its methods:
    why we need it here ? 
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
    constructor(private basketService: BasketService) { }

    //3-methods:
    //a-lifecycle methods:
    //the following ngOnInit() will be performed once the app.component.ts is instantiated:
    ngOnInit(): void 
    {
      /*
      read the notes above:
      to solve the above problem,
      add a code in app.component.ts to check, once the angular starts, if there is a basket_id in the local storage of the browser, 
      so set the special observable "basketSource" in basket.service.ts to that existed basket, using the getbasket() method (which came from basket.service.ts) 
      (despite its name is getBasket(), it returns a basket value, and assign in basket.service.ts the special observable "basketSource" to that returned basket !)
      */
      const basketId = localStorage.getItem('basket_id'); //getItem will get something from the local storage of a browser 
      if (basketId) 
      {
        this.basketService.getBasket(basketId).subscribe 
        /*
        once we called .getBasket, the special observable "basketSource" in basket.service.ts is sat to the returned basket of the basket_id in local storage of the browser !
        also, it getBasket returns that basket in an observable of the returned https response, so to read it, subscribe to it and log to console the word "initialised basket"
        so that we know there was a basket_id in local storage of the browser.
        */
        (
        () => {console.log('initialised basket');}, 
        error => {console.log(error);}
        );
      }
    }
  }














// the old example:
// //type script class:
// export class AppComponent implements OnInit   
// {
//   //1-properties:
//   title = 'Skinet';
//   products: any[];
//   //we identified products as an arry,
//   //but its type is "any" which means array of int or array of strings or ....)
//   //(we will use Products in app.component.html)


//   //2-constructor:
//   constructor (private http: HttpClient) {}
//   //the constructor has done a Dependency Injection ! (in typescript languages we have dependency injection as well)
//   //intead of identifying a property _http above, and inject _http = http, we identify the http as private property in the constructor and say it is HttpClientModule
//   //so "http" is a property that can be used as well
  

//   //3-lifecycle methods:
//   //in angular we use what is called lifecycle hooks or methods, 
//   //those are methods called according to the component lifecyle status,
//   //example:
//   //ngOnChanges: When an input/output binding value changes (when the properties above are assigned values)
//   //ngOnInit: After the first ngOnChanges. (in another meaning, once the component is instantiated)
//   //ngOnDestroy: Just before the directive is destroyed.
//   //and ......
//   //if all of the lifecycle hooks were used, they would be called in a specific order absolutely.
//   //we will use the ngOnInit,
//   //so that above besides the class name, we choose the Interface it came from, and Implement it.
//   //the ngOnInit() in deed is the implementation of the OnInit interface.
//   //it is a function without parameters, and returns nothing (void)
//   ngOnInit(): void 
//   {
//     //use the HttpClientModule we have injected using the constructor (we named it as "http"):
//     //let us get the Prtoducts list we designed in the "API" project:
//     this.http.get('https://localhost:5001/api/products').subscribe
//     (  
//       (response: any) => {console.log(response); this.products = response.data;},
//        error => {console.log(error)}
//     );
//     //after getting the response from the api, assign the value to a var called "response" (its type is "any" which means an int or string or array of int or list of strings or ....)
//     //and log the value of "response" to the console (of the inspect tool of the browser)
//     //as well as set the value of "products" property above to "response" (we will use Products in app.component.html)
//     //also log any error to the console if happened
//   }
// }




//old wxample 2:
// //type script class:
// export class AppComponent implements OnInit   
// {
//   //1-properties:
//   title = 'Skinet';
//   products: IProduct[];
//   //we identified products as an arry of the model IProduct existed in the models folder



//   //2-constructor:
//   constructor (private http: HttpClient) {}
//   //the constructor has done a Dependency Injection ! (in typescript languages we have dependency injection as well)
//   //instead of identifying a property _http above, and inject _http = http, we identify the http as private property in the constructor and say it is HttpClientModule
//   //so "http" is a property that can be used as well
  

//   //3-lifecycle methods:
//   //in angular we use what is called lifecycle hooks or methods, 
//   //those are methods called according to the component lifecyle status,
//   //example:
//   //ngOnChanges: When an input/output binding value changes (when the properties above are assigned values)
//   //ngOnInit: After the first ngOnChanges. (in another meaning, once the component is instantiated)
//   //ngOnDestroy: Just before the directive is destroyed.
//   //and ......
//   //if all of the lifecycle hooks were used, they would be called in a specific order absolutely.
//   //we will use the ngOnInit,
//   //so that above besides the class name, we choose the Interface it came from, and Implement it.
//   //the ngOnInit() in deed is the implementation of the OnInit interface.
//   //it is a function without parameters, and returns nothing (void)
//   ngOnInit(): void 
//   {
//     //use the HttpClientModule we have injected using the constructor (we named it as "http"):
//     //let us get the Prtoducts list we designed in the "API" project:
//     this.http.get('https://localhost:5001/api/products').subscribe
//     (  
//       (response: IPagination) => {console.log(response); this.products = response.data;},
//        error => {console.log(error)}
//     );
//     //after getting the response from the api, assign the value to a var called "response" (its type is IPagination (in pagination.ts class in models folder) which contains the "pageIndex": , "pageSize": , "count": , list of sorted/paginated products)
//     //and log the value of "response" to the console (of the inspect tool of the browser)
//     //as well as set the value of "products" property above to "response" data var (remember that the var "data" is of type IProduct[] in pagination.ts in models folder) (we will use Products in app.component.html)
//     //also log any error to the console if happened
//   }
// }
