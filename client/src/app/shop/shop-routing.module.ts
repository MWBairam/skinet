import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, Routes } from '@angular/router';
import { ShopComponent } from './shop.component';
import { ProductDetailsComponent } from './product-details/product-details.component';



//we identified the concept of angular lazyLoading in app-routing.module.ts in the comment there.
//to continue implementing it here:
const routes: Routes = [
  //if we want to write routes for this shop.module.ts in app-routing.module.ts, we should write:
  /*
  {path: 'shop', component: ShopComponent}, 
  {path: 'shop/:id', component:ProductDetailsComponent}
  */
  //but we will write them here, and in app-routing.module.ts we will say to load routes from this child routing module.

  //also:
  //in all of the routes below, we add a data property which is used by the breadcrumb functionality !
  //breadcrumb is the page location where the user is at !
  //for example: Home/Library/Data 
  //and we added the breadcrumb in the app/core/section-header/ component 
  {path: '', component: ShopComponent},  //no need to add a breadcrumb data property here, it is gotten from the route in the app-routing.module.ts
  {path: ':id', component: ProductDetailsComponent, data: {breadcrumb: {alias: 'ProductDetails'} }} //we created an alias, so we can use it in the product-details.component.ts to replace it from there with the product Name !
]


@NgModule({
  declarations: [],
  imports: [
    //the common module is a module which allows us to use the basic angular commands, like creating variables, methods ...
    //no need for it here:
    //CommonModule

    //import the RoutingModule for the purposes explained above:
    //we use .forRoot() in app-routing.module.ts becuase app-routing.module.ts is a parent routing module,
    //there might be child routing module like this current shop-routing.module.ts like we explained above:
    RouterModule.forChild(routes)
  ],
  //export this module, so we can use it from other places 
  exports: [RouterModule]
})
export class ShopRoutingModule { }
