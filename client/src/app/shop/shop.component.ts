import { Component, OnInit } from '@angular/core';
import { ShopService } from './shop.service';

@Component({
  selector: 'app-shop',
  templateUrl: './shop.component.html',
  styleUrls: ['./shop.component.scss']
})

//typescript class:
//"export" means you can use this class anywhere 
export class ShopComponent implements OnInit 
{
  //1-properties:
  products: IProduct[];
 


  //2-constructor:
  constructor(private shopService: ShopService) { }
  //the constructor has done a Dependency Injection ! (in typescript languages we have dependency injection as well)
  //instead of identifying a property _shopService above, and inject _shopService = shopService, 
  //we identify the shopService as private property in the constructor and say it is ShopService (from the ShopService.ts)
  //so "shopService" is a property that can be used as well



  //3-methods:
  //a-lifecycle methods:
  //in angular we use what is called lifecycle hooks or methods, 
  //those are methods called according to the component lifecyle status,
  //example:
  //ngOnChanges: When an input/output binding value changes (when the properties above are assigned values)
  //ngOnInit: After the first ngOnChanges. (in another meaning, once the component is instantiated)
  //ngOnDestroy: Just before the directive is destroyed.
  //and ......
  //if all of the lifecycle hooks were used, they would be called in a specific order absolutely.
  //we will use the ngOnInit,
  //so that above besides the class name, we choose the Interface it came from, and Implement it.
  //the ngOnInit() in deed is the implementation of the OnInit interface.
  //it is a function without parameters, and returns nothing (void)
  ngOnInit() 
  {
    //the getProducts in shop.service.ts is a http.get methode which retruns an observables
    //we should subscribe to our returned observables in order to take out its value 
    this.shopService.getProducts().subscribe
    (
      response => {console.log(response); this.products = response.data;},
      error => {console.log(error)}
    );
  }
  //after getting the response from the api, assign the value to a var called "response" 
  //and log the value of "response" to the console (of the inspect tool of the browser)
  //as well as set the value of "products" property above to "response" "data" var (remember that the var "data" is of type IProduct[] in pagination.ts in models folder) 
  //also log any error to the console if happened
}
