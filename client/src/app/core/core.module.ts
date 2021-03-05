import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { NavBarComponent } from './nav-bar/nav-bar.component';
import { RouterModule } from '@angular/router';
import { TestErrorsComponent } from './test-errors/test-errors.component';
import { NotFoundComponent } from './not-found/not-found.component';
import { ServerErrorComponent } from './server-error/server-error.component';
import { ToastrModule } from 'ngx-toastr';
import { SectionHeaderComponent } from './section-header/section-header.component';
import { BreadcrumbModule } from 'xng-breadcrumb';
import { SharedModule } from '../shared/shared.module';



@NgModule({
  declarations: [NavBarComponent, TestErrorsComponent, NotFoundComponent, ServerErrorComponent, SectionHeaderComponent],
  imports: [
    //each module by default imports the CommonModule which provide the common functionalities like variables, loops, ....
    CommonModule,

    //import the RouterModule so we can add links to our buttons in nav-bar.component.html
    RouterModule,

    //import BreadCrumb Module we installed using npm install --save xng-breadcrumb from https://www.npmjs.com/package/xng-breadcrumb:
    //it is used in section-header to show a link of the current page where the user is at, like Home/library/product:
    BreadcrumbModule,

    //import the SharedModule, in which we have a lot of useful modules, like the BsDropdownModule to create drop down lists as we did in the nav-bar.component.ts/html:
    SharedModule,

    //import the ToastsModule which we use to show error notification 
    //remember that it was used in the interceptors folder -> error.interceptor.ts:
    //specifiy the position of the error notification to be at the bottom of the web page on the right
    //and prevent duplicates toasts
    ToastrModule.forRoot({positionClass: 'toast-bottom-right', preventDuplicates: true})
    //and this toastr comes with a css styles, so we need to add the css file link in the angular.json
    //but that did not work with this app, so i added them in Styles.scss file !


  ],
  //add this export part, so that we can use the declared NavBarComponent from everywhere:
  //what I mean is in any .html file, we can add the component using its selector <app-nav-bar></app-nav-bar>
  //export also the section-header where it holds the bradcrumb, so we can use <app-section-header> in app.component.html as well:
  exports: [NavBarComponent, SectionHeaderComponent]
})
export class CoreModule { }
