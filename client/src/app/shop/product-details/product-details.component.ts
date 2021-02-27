import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { BreadcrumbService } from 'xng-breadcrumb';
import { ShopService } from '../shop.service';

@Component({
  selector: 'app-product-details',
  templateUrl: './product-details.component.html',
  styleUrls: ['./product-details.component.scss']
})
export class ProductDetailsComponent implements OnInit 
{

  //1-properties:
  product: IProduct; //this property represents one product, so its type is IProduct identified in the shared/models folder


  //2-constructor:
  //inject the shopService where all of our ".get https responses" methods are there.
  //also, inject the activeRoute service, which is used to extract the current route (url). to know why we need it? read the below notes.
  //also:
  //we used what we call it the "breadcrumb" which is the page location where the user is at !
  //for example: Home/Library/Data 
  //and we added the breadcrumb in the app/core/section-header/ component so we can show it in the section-header !
  //so, in shop-routing.module.ts, we added to the route a data property to be used by the breadcrumb:
  //{path: ':id', component: ProductDetailsComponent, data: {breadcrumb: {alias: 'ProductDetaisl'} }}
  //we added in it an alias, whcih is going to be replaced with the product name in below loadProduct method.
  //we need for that to inject the Breadcrumb service.
  constructor(private shopService: ShopService, private activedRoute: ActivatedRoute, private breadcrumbService: BreadcrumbService) { }


  //3-methods:
  //a-lifecycle methods:
  ngOnInit() {
    this.loadProduct();
    //read the notes below
  }

  //b--method to get one product by its id once the user click on the view button under the product picture:
  //we will call this function in above ngOnInit() method so once this component is instantiated, the loadProduct will be called !
  //this will be used in product-item.component.html:
  loadProduct()
  { 
    //the user clicked on the "View" button below the product picture in the web page,
    //in product-te.component.html, in the "View" button, we said to go to http://localhost:4200/shop/id once the button is clicked (using routerLink)
    //in the app-routing.module.ts, that link will route the app to open and instantiate the product-details.component.ts 
    //in here (product-details.component.ts), once this component is instantiated, the ngOnInit() will execute what inside it,
    //so the loadProduct() function will be executed !
    //but we need to pass the clicked product's id to be used in the loadProduct function,
    //that is why we injected the above ActivatedRoute module,
    //use it to extract the 'id' from the url: http://localhost:4200/shop/id
    //then it is a string, so convert it to integer using the '+' (like Int32.Parse() function in C#)
    const SelectedproductId  = +this.activedRoute.snapshot.paramMap.get('id');
    
    this.shopService.getProduct(SelectedproductId)
    .subscribe
    (
      response => {console.log(response); this.product = response; this.breadcrumbService.set('@ProductDetails', this.product.name)},  
      //to understand this breadcrumb part, read notes above in the constructor.
      //we accessed the alias ProductDetails using the @ and replaced it with the product name !
      error => {console.log(error)}
    );
    
    
  }

}
