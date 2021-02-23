import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { IBrand } from '../shared/models/brand';
import { IPagination } from '../shared/models/pagination';
import { IType } from '../shared/models/productType';
import { ShopService } from './shop.service';
import { shopParams } from '../shared/models/shopParams'

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
  //this will be used for sorting purposes:
  sortOptions = 
  [
   {name: 'Alphabetical', value:'name'},
   {name: 'Price: Low to High', value:'priceAsc'},
   {name: 'Price: High to Low', value:'priceDesc'}
  ];//it is an array
    //the name field what is we display on the HTML webPage, and the value field is what we want to append to the https request link
  //this will be the total number of returned items:
  totalCount: number;
  //this is used for search purposes:
  //remember in shop.component.html in the Search part, in the textbox input html element, we gave it a "template refrence variable" name called #search
  //so that we can access that html input element from this component here using its name #search
  //we use the @ViewChild decoration for that purpose,
  //refrence the html element with the 'search', 
  //and say it is a static element (which means it does not use *ngFor or *ngIf or .... and other angular directive in it tag
  //let us call the the property name as searchTerm, and its type is ElementRef 
  //below as well 2 methods to deal with it
  @ViewChild ('search', {static: true}) searchTerm: ElementRef;
  //also:
  /*instead of adding here the:
  brandId: number = 0;
  typeId: number = 0;
  sort: string = 'name';
  pageNumber = 1;
  pageSize = 6;
  search: string;
  we will add them in the shopParms class in models folder in shared folder,
  then instantiate the class in here and use its parameters: */
  shopParams = new shopParams();

 




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
    //by default with the above properties with these values: brandId=0 & typeId =0 and sortSelected=name and pageSize=9 and pagenumber=1 (those parameters from shopParams class and initialized there)
    //which means pass to the .shopService.getProducts the shopParams object with brandId and typeId equal to 0 and ....
    //then in the shop.service.ts, we wrote if(brandId), so it brandId =0 we will have if(0) (which means false) and the 'brandId=xx' will not be added to the https request !
    //someone will ask, what if I want to query the brandId=0 & typeId=0 ?
    //the answer is, in the sql DB, we started the entries from Id=1 in the tables,
    //so indeed ther is no productId=0 and no brandId=0 and no typeId=0 !! just for this moment 
    //anyway, the conclusion of this, is we will get the first 6 products sorted by name and paginated by 9 products per response
    this.getProducts();
    //2-brands:
    this.getBrands();
    //3-types:
    this.getTypes();
  }

  //b-the following methods will be called in the OnInit() function:
  getProducts() 
  {
    //pass the above brandId and typeId and .... (existed in the shopParams) to the service method:
    //those properties, brandId and typeId .... have setters below, and called once an <li></li> element of a brand or type is clicked, select list of sortTypes value is changed, and new chosen page number
    
    //instead of this.shopService.getProducts(this.brandId, this.typeId, this.sort, ....
    //we used the shopParams class:
    //the service shopService and its method getProducts will retrun an object of type "pagination" which is existed in the models folder in the shared folder
    //that means, the below "response" variable, has the following: pageIndex, pageSize, count, data (data is the array of products) 
    this.shopService.getProducts(this.shopParams)
    .subscribe
    (
      response => {console.log(response); this.products = response.data; this.shopParams.pageNumber = response.pageIndex; this.shopParams.pageSize = response.pageSize; this.totalCount = response.count},
      error => {console.log(error)}
    );
    //the getProducts in shop.service.ts is a http.get methode which retruns an observables
    //we should subscribe to our returned observables in order to take out its value using .subscribe()

    //after getting the response from the api, assign the value to a var called "response" 
    //and log the value of "response" to the console (of the inspect tool of the browser)
    //as well as set the value of "products" property above to "response" "data" var (remember that the var "data" is of type IProduct[] in pagination.ts in models folder) 
    //as well as the other values of page number, size, count of items returned
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
    this.shopParams.brandId = clickedBrandId;
    //now the above brandId has been set to the brandId which the user clicked on

    //once the user filtered for something, reset the pagenumber to 1:
    this.shopParams.pageNumber = 1;

    //now call the above getProducts() function which uses this brandId
    this.getProducts();
  }
  OnTypeSelected(clickedTypeId: number)
  {
    this.shopParams.typeId = clickedTypeId;
    //now the above typeId has been set to the brandId which the user clicked on

    //once the user filtered for something, reset the pagenumber to 1:
    this.shopParams.pageNumber = 1;

    //now call the above getProducts() function which uses this typeId
    this.getProducts();
  }

  //d-methods which will be called only and only once the select list of sort type (in the shop.component.html) value is changed: 
  OnSortSelected(clickedSortType: string)
  {
    this.shopParams.sort = clickedSortType;
    //now the above sort has been set to the clicked Sort Type which the user clicked on
    //now call the above getProducts() function which uses this clickedSortType
    this.getProducts();
  }

  //e-method which will be called only and only once the selected page in the pagination area in the bottom of the web page is changed:
  onPageChanged(clickedPage: any)
  {
    this.shopParams.pageNumber = clickedPage.page;
    this.getProducts();
  }
  //f-2 methods to deal with the search texbox input html element and reset button in shop.component.html:
  onSearch()
  {
    //get the value from the search texbox input html element, and set it to the above searchTerm
    this.shopParams.search = this.searchTerm.nativeElement.value;
    //now get the list of our products:
    this.getProducts();
  }
  onReset()
  {
    //reset the search area by reseting the above searchTerm which is linked with the search texbox input html element
    this.searchTerm.nativeElement.value = '';
    //reste as well the above shopParams to its default values (written in shopParams in shared/models) 
    this.shopParams = new shopParams(); 
    //now again get the list of products:
    this.getProducts();
  }



}
