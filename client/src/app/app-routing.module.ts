import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { NotFoundComponent } from './core/not-found/not-found.component';
import { ServerErrorComponent } from './core/server-error/server-error.component';
import { TestErrorsComponent } from './core/test-errors/test-errors.component';
import { HomeComponent } from './home/home.component';
import { ProductDetailsComponent } from './shop/product-details/product-details.component';
import { ShopComponent } from './shop/shop.component';


//a const to hold the routes we have for different web pages we have:
const routes: Routes = [
  //the order of routes here is importent !
  //spcifically for the last route which is a wildcard for any invalid link to redirect you to home page or not-found page !

  //in all of the routes below, we add a data property which is used by the breadcrumb functionality !
  //breadcrumb is the page location where the user is at !
  //for example: Home/Library/Data 
  //and we added the breadcrumb in the app/core/section-header/ component 

  
  
  //add a route to the "home" page (module/component) when the user request https://localhost:4200 only without adding anything else
  {path: '', component: HomeComponent, data: {breadcrumb: 'Home'}}, //the '' means nothing after https://localhost:4200 
  



  //instead of writing these 2 links (routes) here,
  /*
  {path: 'shop', component: ShopComponent}, //when the user clicks on "shop" button in the home page, the link will be https://localhost:4200/shop, so route the request to shop module/component
  {path: 'shop/:id', component:ProductDetailsComponent}, //when the user clicks on "view" button in the shop page in the product-item area, the link will be https://localhost:4200/shop/id, so route the request to product-details module/component
  */
  //we will write them in shop-routing.module.ts !
  //why is that? if we kept them here, the shop.module.ts will be loaded directly once the angular app runs ! which might hurt the performance !
  //so load the shop.module.ts & shop.component.ts once the user clickes on the shop button in the navbar !
  //this is called lazyLoading !
  //then in here, we will write the following to say that there are routes in the shop.module.ts:
  {path: 'shop', loadChildren: () => import('./shop/shop.module').then(mod =>mod.ShopModule), data: {breadcrumb: 'Shop'}},
  //another breadcrumb configuration is done in teh shop-routing.module.ts as well !


  //same as what we did above for "shop", we will do the same for the "basket"
  {path: 'basket', loadChildren: () => import('./basket/basket.module').then(mod =>mod.BasketModule), data: {breadcrumb: 'Basket'}},
  //then continue configuring the routes in basket-routing.module.ts 

  //same as what we did above for "shop" and "basket", we wil do the same for the "checkout":
  {path: 'checkout', loadChildren: () => import('./checkout/checkout.module').then(mod =>mod.CheckoutModule), data: {breadcrumb: 'Checkout'}},


  //the following link is for the test-errors component in core folder:
  {path: 'test-errors', component: TestErrorsComponent, data: {breadcrumb: 'test-errors'}},



  //the following paths will be used to redirect users to the not-found or server-error components where we display and handle the 404 and 500 errors:
  //to catch an error somewhere, we will use what we call it "HttpInterceptor" which is same as the try and catch in C#
  //so we can intercept the https responses coming from the api and check if those contain any error 
  {path: 'not-found', component: NotFoundComponent, data: {breadcrumb: 'not-found'}},
  {path: 'server-error', component: ServerErrorComponent},


  //if any other link (**) requested other than the above, redirect to https://loclahost:4200 with adding nothing to the link, which means to the home route above 
  //or we can redirect it to the not-found.component.html 
  {path: '**', redirectTo: 'not-found', pathMatch:'full'}





];

@NgModule({
  //import the RouterModule "Angular Router" and pass to it the above routes we have:
  //we use .forRoot() becuase this app-routing.module.ts is a parent routing module,
  //there might be child routing module like shop-routing.module.ts like we explained above:
  imports: [RouterModule.forRoot(routes)],
  //export this module, so we can use it from other places 
  exports: [RouterModule]
})

export class AppRoutingModule { }
