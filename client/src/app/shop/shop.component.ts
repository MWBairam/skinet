import { Component, OnInit } from '@angular/core';
import { IBrand } from '../shared/models/brand';
import { IPagination } from '../shared/models/pagination';
import { IType } from '../shared/models/productType';
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
  brands: IBrand[];
  types: IType[];
  //the following will be used when we get a filtered list of products according to brandId and typeId:
  brandIdSelected: number = 0; //initial value of 0 
  typeIdSelected: number = 0; //initial value of 0 
  //the following will be used when we get a sorted list of products:
  sortSelected: string = 'name'; //initial value of 'name'
  sortOptions = 
  [
   {name: 'Alphabetical', value:'name'},
   {name: 'Price: Low to High', value:'priceAsc'},
   {name: 'Price: High to Low', value:'priceDesc'}
  ];
  //it is an arry
  //the name field what we display on the HTML webPage, and the value field is what we want to append to the https request link


 


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
  //------------------------------------------------------------------------------------------------
  //In simple words, this function is like the InitializeComponent() in C# desktop App for example
  ngOnInit() 
  {
    //once this component is initialized, bring the list of products, brnads and types:
    //1-products:
    //the getProducts() will be called once this component is instantiated,
    //with the above brandIdSelected = 0 & typeIdSelected =0 (and sortSelected = name)
    //which means pass to the .shopService.getProducts(0, 0, name)  
    //then in the shop.service.ts, we wrote if(brandId), so it brandId =0 we will have if(0) (which means false) and the 'brandId=xx' will not be added to the https request !
    //someone will ask, what if I want to query the brandId=0 & typeId=0 ?
    //the answer is, in the sql DB, we started the entries from Id=1 in the tables,
    //so indeed ther is no productId=0 and no brandId=0 and no typeId=0 !! just for this moment 
    //nyway, the conclusion of this, is we will get the first 6 products sorted by name 
    this.getProducts();
    //2-brands:
    this.getBrands();
    //3-types:
    this.getTypes();
  }

  //b-the following methods will be called in the OnInit() function:
  getProducts() 
  {
    //pass the above brandIdSelected and typeIdSelected to the service method:
    //those properties, brandIdSelected and typeIdSelected, has setters below, and called once an <li></li> element of a brand or type is clicked
    this.shopService.getProducts(this.brandIdSelected, this.typeIdSelected, this.sortSelected).subscribe
    (
      response => {console.log(response); this.products = response.data;},
      error => {console.log(error)}
    );
    //the getProducts in shop.service.ts is a http.get methode which retruns an observables
    //we should subscribe to our returned observables in order to take out its value using .subscribe()

    //after getting the response from the api, assign the value to a var called "response" 
    //and log the value of "response" to the console (of the inspect tool of the browser)
    //as well as set the value of "products" property above to "response" "data" var (remember that the var "data" is of type IProduct[] in pagination.ts in models folder) 
    //also log any error to the console if happened
  }

  getBrands()
  {
    this.shopService.getBrands().subscribe
    (
      response => {this.brands = [{id: 0, name:'All'}, ...response];}, // instead of response => {this.brands = response;} only, add the option "All" manually to the list of brands
      error => {console.log(error)}
    );
  }

  getTypes()
  {
    this.shopService.getTypes().subscribe
    (
      response => {this.types = [{id: 0, name:'All'}, ...response];}, // instead of response => {this.types = response;} only, add the option "All" manually to the list of brands
      error => {console.log(error)}
    );
  }

  //c-methods which will be called only and only once an <li></li> element of a brand or type is clicked:
  //those methods will not be called in the OnInit(), so that will not be called once this component is instantiated !
  //will be called only and only once an <li></li> element of a brand or type is clicked (check the shop.component.ts)
  OnBrandSelected(clickedBrandId: number)
  {
    this.brandIdSelected = clickedBrandId;
    //now the above brandIdSelected has been set to the brandId which the user clicked on
    //now call the above getProducts() function which uses this brandIdSelected
    this.getProducts();
  }
  OnTypeSelected(clickedTypeId: number)
  {
    this.typeIdSelected = clickedTypeId;
    //now the above typeIdSelected has been set to the brandId which the user clicked on
    //now call the above getProducts() function which uses this typeIdSelected
    this.getProducts();
  }

  //d-methods which will be called only and only once the select list of sort type (in the shop.component.html) value is changed: 
  OnSortSelected(clickedSortType: string)
  {
    this.sortSelected = clickedSortType;
    //now the above sortSelected has been set to the clicked Sort Type which the user clicked on
    //now call the above getProducts() function which uses this clickedSortType
    this.getProducts();
  }



}
