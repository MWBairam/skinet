import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { NavBarComponent } from './nav-bar/nav-bar.component';



@NgModule({
  declarations: [NavBarComponent],
  imports: [
    //each module by default imports the CommonModule which provide the common functionalities like variables, loops, ....
    CommonModule
  ],
  //add this export part, so that we can use the declared NavBarComponent from everywhere:
  //what I mean is in any .html file, we can add the component using its selector <app-nav-bar></app-nav-bar>
  exports: [NavBarComponent]
})
export class CoreModule { }
