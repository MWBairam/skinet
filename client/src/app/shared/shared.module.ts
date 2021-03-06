import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { BsDropdownModule, CarouselModule, PaginationModule } from 'ngx-bootstrap';
import { PagingHeaderComponent } from './components/paging-header/paging-header.component';
import { PagerComponent } from './components/pager/pager.component';
import { OrderTotalsComponent } from './components/order-totals/order-totals.component';
import { CheckoutModule } from '../checkout/checkout.module';
import { ReactiveFormsModule } from '@angular/forms';
import { CdkStepperModule } from '@angular/cdk/stepper';
import { StepperComponent } from './components/stepper/stepper.component';

//everything related to ngx-bootstrap will be declared/imported here
//then we can use it in any other module


@NgModule({
  declarations: [PagingHeaderComponent, PagerComponent, OrderTotalsComponent, StepperComponent],
  imports: [
    //each module by default imports the CommonModule which provide the common functionalities like variables, loops, ....
    CommonModule,
    //Import the IPagination module from the ngx-bootstrap library:
    PaginationModule.forRoot(),
    //PaginationModule has its own providers array which need to be injected at root module at startup, so that we need the part .forRoot()
  
    //add the Carousel module so we can make us of it in the Home Component:
    CarouselModule.forRoot(),
    //ad export it in the below exports list

    //we will use the Angular forms in login.component.ts/html, in particular, the Reactive forms,
    //also in the register.component.ts/html and ....
    //so import ReactiveFormsModule here, then export it in the below, then use SharedModule in where you want to use the ReactiveFormsModule in it:
    ReactiveFormsModule,
    //ad export it in the below exports list


    //we will use in the checkout.component.ts a stepper wizard so we can guide the user to add his data step by step,
    //we will use the one from the installed CDK from angular repo,
    CdkStepperModule,
    //ad export it in the below exports list so we can use it in stepper.component.ts which will be used in checkout.component.ts

    //also the DropDown lists module of https://valor-software.com/ngx-bootstrap/#/dropdowns so we can use it in any html file we want:
    //like using it in the nav-bar.component.ts/html 
    BsDropdownModule.forRoot()
    //ad export it in the below exports list

  
  ],
  //add this export part, so that we can use the declared Components, and imports from everywhere:
  //export PaginationModule we imported above
  //export the component pagination-header.component.ts in "component" folder since it is shared, so we can sue it in shop.component.ts: 
  //export the component pager.component.ts in "component" folder since it is shared, so we can sue it in shop.component.ts:
  //export the order-totals to be used in basket.component.html, and checkout.component.html 
  //also, the ReactiveFormsModule as we explained above:
  //also the CdkStepperModule explained above:
  //and the BsDropdownModule:
  exports: [
    PaginationModule,
    PagingHeaderComponent,
    PagerComponent,
    CarouselModule,
    OrderTotalsComponent, 
    ReactiveFormsModule,
    BsDropdownModule,
    //export the CdkStepperModule explained above, which is used in stepper.component.ts which will be used in checkout.component.ts
    //so also export the stepper.component.ts we created in the shared/components folder:
    CdkStepperModule,
    StepperComponent
  ]
})
export class SharedModule { }



//then if we need to use any declared Components, and imports, from here, we need to import this module in any other module,
//for example, in shop.module.ts, import this sharedModule there so we can use the paginationModule there 
