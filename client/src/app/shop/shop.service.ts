import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { IPagination } from '../shared/models/pagination';

@Injectable({
  providedIn: 'root'
})


export class ShopService
{
  //1-properties:
  baseurl = 'https://localhost:5001/api/'


  //2-constructor:
  //dependency injection for the HttpClient module:
  constructor(private http: HttpClient) { }
  //the constructor has done a Dependency Injection ! (in typescript languages we have dependency injection as well)
  //instead of identifying a property _http above, and inject _http = http, we identify the http as private property in the constructor and say it is HttpClientModule
  //so "http" is a property that can be used as well


  //3-methods:
  getProducts()
  {
    return this.http.get<IPagination>(this.baseurl + 'products');
    //the final link in the ./get will be: https://localhost:5001/api/products
    //the .get() function returns observable<object> (an observable of type object which is generic without a specific type),
    //so we define what is the reponse we are going to have ! which is the IPagination model reponse (it contains the "pageIndex": , "pageSize": , "count": , list of sorted/paginated products)
    //(remember the "models" folder in the shared folder)
  }


}
