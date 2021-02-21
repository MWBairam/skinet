import { Component, OnInit } from '@angular/core';


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
    constructor () {}

    //3-methods:
    //3-a-lifecycle methods:
    ngOnInit(): void 
    {
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
