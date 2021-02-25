import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ShopComponent } from './shop.component';
import { ProductItemComponent } from './product-item/product-item.component';
import { SharedModule } from '../shared/shared.module';
import { ProductDetailsComponent } from './product-details/product-details.component';
import { RouterModule } from '@angular/router';
import { ShopRoutingModule } from './shop-routing.module';


@NgModule({
  declarations: [ShopComponent, ProductItemComponent, ProductDetailsComponent],
  imports: [
    //each module by default imports the CommonModule which provide the common functionalities like variables, loops, ....
    CommonModule,
    //import the shared.module.ts from the shared folder we created before
    //so that we can use all ngx-bootstrap imports there in here, like the PaginationModule:
    SharedModule,
    //import the RouterModule so we can add links to our buttons in product-item.component.html or in ...
    //RouterModule
    //but since we used the lazyLoading concept as we explained in app-routing.module.ts,
    //we will use the shop-routing.module.ts instead of the app-routing.module.ts in here:
    ShopRoutingModule

  ]
  //add this export part, so that we can use the declared ShopComponent from everywhere:
  //what I mean is in any .html file, we can add the component using its selector <app-shop></app-shop>
  //exports: [ShopComponent]
  //but since we used the concept of routes lazy loading explained in app-routing.module.ts, no need to export this because
  //our app.module.ts is no longer responsible for loading this shop.component.ts component,
  //it is the reponsibility of this shop.module.ts and the imported ShopRoutingModule 
})
export class ShopModule { }
