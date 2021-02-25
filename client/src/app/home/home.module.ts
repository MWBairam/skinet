import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HomeComponent } from './home.component';



@NgModule({
  declarations: [HomeComponent],
  imports: [
    CommonModule
  ],
  //export this module so it can be imported in any other place else, such as the app.module.ts:
  exports: [HomeComponent]
})
export class HomeModule { }
