import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ShopComponent } from './shop.component';
import { ProductItemComponent } from './product-item/product-item.component';



@NgModule({
  declarations: [ShopComponent, ProductItemComponent],
  imports: [
    //each module by default imports the CommonModule which provide the common functionalities like variables, loops, ....
    CommonModule
  ],
  //add this export part, so that we can use the declared ShopComponent from everywhere:
  //what I mean is in any .html file, we can add the component using its selector <app-shop></app-shop>
  exports: [ShopComponent]
})
export class ShopModule { }
