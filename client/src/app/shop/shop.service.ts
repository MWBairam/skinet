import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { IBrand } from '../shared/models/brand';
import { IPagination } from '../shared/models/pagination';
import { IType } from '../shared/models/productType';
import { map } from 'rxjs/operators';
import { shopParams } from '../shared/models/shopParams';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})


export class ShopService
{
  //1-properties:
  //baseurl = 'https://localhost:5001/api/'
  //or bring the url from the environments folder ->environment.ts (environmetn.prod.ts for production)
  baseurl = environment.apiUrl;


  //2-constructor:
  //dependency injection for the HttpClient module:
  constructor(private http: HttpClient) { }
  //the constructor has done a Dependency Injection ! (in typescript languages we have dependency injection as well)
  //instead of identifying a property _http above, and inject _http = http, we identify the http as private property in the constructor and say it is HttpClientModule
  //so "http" is a property that can be used as well


  //3-methods:
  //instead of using getProducts(brandId? : number, typeId? : number, sort?: string, pageSize? : int, pageNumber? : int)
  //we will use the shopParams class in the models folder:
  getProducts(shopParams: shopParams)
  {
    //1-to return the list of products without considering the brabdId and/or typeId and sorting (by default based on name) and pagination (by default 9 products per page):
    //    return this.http.get<IPagination>(this.baseurl + 'products');
    //the final link in the .get will be: https://localhost:5001/api/products
    //the .get() function returns observable<object> (an observable of type object which is generic without a specific type),
    //so we define what is the reponse we are going to have ! which is the IPagination model reponse (it contains the "pageIndex": , "pageSize": , "count": , list of sorted/paginated products)
    //(remember the "models" folder in the shared folder)

    //2-to return the list of products considering the brandId and typeId and sorting and pagination:
    //above we have identified parameters: brandId and typeId of type number, and sort, and pageSize and pageNumber (all came from shopParams class) and can be null (?)
    //if we passed a value to brandId and/or typeId, so embed the ?brandId=xx&typeId=yy 
    //the link then will be for example: https://localhost:5001/api/products?typeId=3&brandId=2 
    //and if the brandId and typeId are null, the link keeps being: https://localhost:5001/api/products

    //same explanation for the sort to add to the https request &sort=priceAsc for example

    //and same for pageSize and pageIndex

    //example url we want:
    //https://localhost:5001/api/products?typeId=3&brandId=2&sort=priceDesc&pageSize=10&pageIndex=1


    let params = new HttpParams();
    //in C#, when initialize a new object, we write: "var obj = new className();"" or "className obj = new className();"
    //here it is the same concept, but at first we write "let" or "const"
    if(shopParams.brandId !== 0 ) //check if brandId is not 0 (check the explanation in shop.component.ts, in OnInit())
    {
      params = params.append('brandId', shopParams.brandId.toString()); 
      //the output is brandId=2 for example 
      //before using the integer number of the brandId, we should transfare it to be a string to be embeded in the https request
    }
    if(shopParams.typeId !==0 ) //check if typeId is not 0 (check the explanation in shop.component.ts, in OnInit())
    {
      params = params.append('typeId', shopParams.typeId.toString());
    }
    if(shopParams.search)
    {
      params = params.append('search', shopParams.search);
    }
    //if(shopParams.sort) //no need for the if, because sort will be alawys eith a value (initialized with value ='name' in shopParams class in models folder)
    //{
      params = params.append('sort', shopParams.sort); //sort=name or priceAsc or priceDesc
    //}
    params = params.append('pageIndex', shopParams.pageNumber.toString());
    params = params.append('pageSize', shopParams.pageSize.toString());

    //example url we want:
    //https://localhost:5001/api/products?typeId=3&brandId=2&sort=priceDesc&pageSize=10&pageIndex=1

    //now return the list of filtered/sorted/paginated products according to a brandId and/or typeId (and sorted as well):
    //   return this.http.get<IPagination>(this.baseurl + 'products', {observe: 'response', params});
    //the {observe: 'response', params} part will add the,for example, ?brandId=2&typeId=3&sort=priceAsc to the https request https://localhost:5001/api/products
  
    //indeed, when we used the "observe:", the returned value will not be of type "IPagination",
    //and we will not be able to use .subscribe in the shop.component.ts to extraxt the "data" variable of the returned "IPagination" object
    //so the solution, to return a value of type "IPagination" is to use the .pipe:
    return this.http.get<IPagination>(this.baseurl + 'products', {observe: 'response', params})
    .pipe
    (
      map(response => {return response.body;}) //take the body of the https request which will be our observable to consume using .subscribe in shop.component.ts
    );
  }




  getBrands()
  {
    return this.http.get<IBrand[]>(this.baseurl + 'products/brands');
    //here we defined the .get<> to bring us back an array of Brands
    //in the products above, we did not say that, becuase the "data" in IPagination is assigned as an array
  }




  getTypes()
  {
    return this.http.get<IType[]>(this.baseurl + 'products/types');
  }



  //get product by its id:
  getProduct(id: number)
  {
    return this.http.get<IProduct>(this.baseurl + 'products/' + id)
  }
}
