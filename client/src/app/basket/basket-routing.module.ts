import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Routes, RouterModule } from '@angular/router';
import { BasketComponent } from './basket.component';


//the following array of routes are implemented and loaded in the belwo RouterModule in the imports part,
//this basket-routing.module.ts has parent routes in app-routing.module.ts 
//we could wrote all the routes in app-routing.module.ts, but we want to implement the lazy loading concept, so basket.module.ts is not loaded until we click on the button of basket
//we identified the concept of angular lazyLoading in app-routing.module.ts in the comment there
//also read notes there related to this in app-routing.module.ts and shop-routing.module.ts 
const routes: Routes = [
  {path: '', component: BasketComponent}
];

@NgModule({
  declarations: [],
  imports: [
    RouterModule.forChild(routes) //for.Root is in app-routing.module.ts 
  ],
  exports: [RouterModule]
})
export class BasketRoutingModule { }
