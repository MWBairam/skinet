import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-server-error',
  templateUrl: './server-error.component.html',
  styleUrls: ['./server-error.component.scss']
})
export class ServerErrorComponent implements OnInit {

  //1-properties:
  errorToDisplay: any;
  
  //2-constructor:
  //we will continue here what we explained in the interceptors folder -> error.interceptor.ts -> if (CaughtError.status === 500) 
  //so please read it there first !
  //we will use the the navigationExtras we created there !
  //this navigationExtras is passed to here when the interceptor there used router.navigateByUrl using a RouterModule !
  //so in order to extract it, will use a Router (different from the RouterModule) (will inject it using the ependecy injection)
  //after that, the operation n the navigationExtras should be done only in the constructor, we can do it for example in ngOnInit() or any other function !
  constructor(private router: Router) 
  {
    //get the passed navigationExtras:
    const navigation = this.router.getCurrentNavigation(); //this is an already defined method from angular 
    //set its value to the above errorToDisplay property:
    this.errorToDisplay = navigation && navigation.extras && navigation.extras.state && navigation.extras.state.error;
    //we can directly say this.errorToDisplay = navigation.extras.state.error; (remember interceptors folder -> error.interceptor.ts -> if (CaughtError.status === 500) )
    //but we did extra steps of validation !!
    
   }

  //3-methods:
  ngOnInit() {
  }

}
