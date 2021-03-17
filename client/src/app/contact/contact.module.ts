import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ContactComponent } from './contact.component';
import { ShopRoutingModule } from '../shop/shop-routing.module';
import { ContactRoutingModule } from './contact-routing.module';
import { SharedModule } from '../shared/shared.module';



@NgModule({
  declarations: [ContactComponent],
  imports: [
    CommonModule,
    //import our contact page routing module:
    ContactRoutingModule,
    //the shared module has the ReactiveFormsModule which we will use to build the Angular form
    SharedModule
  ]
})
export class ContactModule { }
