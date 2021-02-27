import { Component, OnInit } from '@angular/core';
import { Observable } from 'rxjs';
import { BreadcrumbService } from 'xng-breadcrumb';

@Component({
  selector: 'app-section-header',
  templateUrl: './section-header.component.html',
  styleUrls: ['./section-header.component.scss']
})


//creating the section header, in it we will add what we call it "breadcrumb" 
//breadcrumb is the page location where the user is at !
//for example:
//Home/Library/Data 
//we will use it from here: https://getbootstrap.com/docs/5.0/components/breadcrumb/
//besides the helper ngx-breadcrumb from here: https://www.npmjs.com/package/xng-breadcrumb

//for displaying the breadcrumb link in the section-header, we added the tag <xng-breadcrumb></xng-breadcrumb> in the section-header.component.html
//with identifying a data property for the breadcrumb in the routes in app-routing..module.ts 

//also, we want to populate the title of the page in the section-header besides the displayed breadcrumb,
//the title is also based on what is dislplayed in the breadcrumb 
//for example we are in Home/Shop/AdidasBoots, the title to display is AddidasBoots 
//we will do that using the property below with the injected BreadcrumbService 


export class SectionHeaderComponent implements OnInit 
{
  //1-properties:
  myBreadcrumb$: Observable<any[]>;
  //this property is of type "Observable" of array of any !
  //since it is an observable, use the $ at the end of its name 
  //read the notes below

  //2-constructor:
  //inject the BreadcrumbService as we said above:
  constructor(private breadcrumbService: BreadcrumbService) { }

  //3-Metods:
  //a-Lifecycle methods:
  ngOnInit() 
  {
    //use the above Breadcrumb service to fill in the value of the property Identified above:
    this.myBreadcrumb$ = this.breadcrumbService.breadcrumbs$;
    //the Breadcrumb service is an already defined service by angular
    //it returns the breadcrumb$ which represents the page in which the user is at (for example Home/Library/Data ) in an https response (how? i do not know !)
    //and as we learnt in, for example, the shop.component.ts, in getProducts() method (and other methods), that an observable is contained in the https response !
    //in order to read values from that observables, we need to subscribe to it using the .subscribe()
    //after we finish from the observable, we need to unsubscribe it !
    //we did not unsubscribe it manually in the methods in shop.components.ts, because the ngOnInit() there will destroy the component and its returned observables once the component is disposed.
    //here, the section-header will never be disposed since it should live forever the user's session since it is displayed above all the component !
    //and if we added, besides the implements, the ngOnDestroy() in order to destroy (unsubscribe) the observables,
    //but that lifecycle method will not be implemented unless this section-header.component.ts is going to be disposed !
    //and as i said, it might not be destroyed at all !
    //so the only solution is, to create a property above, which an observable,
    //and simply assign to it the observable we get from the BreadcrumbService !
    //then in the section-header.component.ts, take the value from it using the pipe "| async" which will be applied in the html domain only
    //and no subscribe and unsubscribe is requiered since we are able to take the value from the observable using an html pipe !
  }

}
