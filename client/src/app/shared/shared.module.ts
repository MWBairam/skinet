import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { CarouselModule, PaginationModule } from 'ngx-bootstrap';
import { PagingHeaderComponent } from './components/paging-header/paging-header.component';
import { PagerComponent } from './components/pager/pager.component';
import { OrderTotalsComponent } from './components/order-totals/order-totals.component';
import { CheckoutModule } from '../checkout/checkout.module';


//everything related to ngx-bootstrap will be declared/imported here
//then we can use it in any other module


@NgModule({
  declarations: [PagingHeaderComponent, PagerComponent, OrderTotalsComponent],
  imports: [
    //each module by default imports the CommonModule which provide the common functionalities like variables, loops, ....
    CommonModule,
    //Import the IPagination module from the ngx-bootstrap library:
    PaginationModule.forRoot(),
    //PaginationModule has its own providers array which need to be injected at root module at startup, so that we need the part .forRoot()
  
    //add the Carousel module so we can make us of it in the Home Component:
    CarouselModule.forRoot()
    //ad export it in the below exports list
  
  ],
  //add this export part, so that we can use the declared Components, and imports from everywhere:
  //export PaginationModule we imported above
  //export the component pagination-header.component.ts in "component" folder since it is shared, so we can sue it in shop.component.ts: 
  //export the component pager.component.ts in "component" folder since it is shared, so we can sue it in shop.component.ts:
  //export the order-totals to be used in basket.component.html,
  //also, the
  exports: [
    PaginationModule,
    PagingHeaderComponent,
    PagerComponent,
    CarouselModule,
    OrderTotalsComponent,
  ]
})
export class SharedModule { }



//then if we need to use any declared Components, and imports, from here, we need to import this module in any other module,
//for example, in shop.module.ts, import this sharedModule there so we can use the paginationModule there 
