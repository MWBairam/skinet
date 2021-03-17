import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HomeComponent } from './home.component';
import { SharedModule } from '../shared/shared.module';
import { RouterModule } from '@angular/router';



@NgModule({
  declarations: [HomeComponent],
  imports: [
    
    CommonModule,

    //router ,odule so we add the links in the footer:
    //add it before SharedModule or problems will happen with the links !!
    RouterModule,

    //import the shared.module.ts in home.module.ts to use the CarouselModule from there in here: 
    SharedModule
 

  ],
  //export this module so it can be imported in any other place else, such as the app.module.ts:
  exports: [HomeComponent]
})
export class HomeModule { }
