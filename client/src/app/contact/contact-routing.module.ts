import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ContactComponent } from './contact.component';
import { RouterModule, Routes } from '@angular/router';

const routes: Routes = [
  //if we want to write routes for this contact.module.ts in app-routing.module.ts, we should write:
  /*
  {path: 'contact', component: ShopComponent}, 

  //also:
  //in all of the routes below, we add a data property which is used by the breadcrumb functionality !
  //breadcrumb is the page location where the user is at !
  //for example: Home/Library/Data 
  //and we added the breadcrumb in the app/core/section-header/ component 

  //the route is lazy loaded, so write this route here, and a main route in app-routing.component.ts
  //read the same explaination in shop-routing.component.ts
  */
  {path: '', component: ContactComponent},
]

@NgModule({
  declarations: [],
  imports: [
    CommonModule,
    //import the above routes:
    RouterModule.forChild(routes)
  ],
  //export router module so we can use routes to different pages in contact.component.html
  exports: [RouterModule]
})
export class ContactRoutingModule { }
