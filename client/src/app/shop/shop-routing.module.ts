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
  {path: '', component: ShopComponent}, 
  {path: ':id', component: ProductDetailsComponent}
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
