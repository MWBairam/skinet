import { Injectable } from '@angular/core';
import { NgxSpinnerService } from 'ngx-spinner';



//we want to display a loading indicator before displaying any result related to what the user requested:
//so imported this in app.module.ts: NgxSpinnerModule
//remember that we delayed any http response for 1000 millisecond in the core folder -> interceptors -> loading.interceptor since this intercepts any response
//and during this time will display the spinner !
//and we used for that this busy.service.ts service in the app/core/services folder


//make (this busy.service.ts) injectable, so we can inject it in any class (component)'s constructor to use it there 
@Injectable({
  providedIn: 'root'
})


export class BusyService 
{

  //1-properties:
  //we will set this timer value from the palce we are using a spinner, so that from below methods the show and hide depends on this timer value !
  busyRequestCount = 0;


  //2-constructor:
  //dependency inject for the already defined ngx-spinner service which we npm installed:
  constructor(private spinnerService: NgxSpinnerService) { }


  //3-methods:
  //use the above injected service to show or hide a spinner to say to the user that there is something is loading !
  busy()
  {
    this.busyRequestCount++;
    //show th spinner using the .show, and first paramter it takes is the name which is not importnant, and the second one is the spinner styling !
    this.spinnerService.show(undefined, {type: 'ball-spin-fade-rotating', bdColor: 'rgba(255,255,255,0.7)', color: '#333333'});
    //the spinner has a lot of types from https://labs.danielcardoso.net/load-awesome/animations.html like timer, ....
    //when displaying the spinner, make the background with white color and opacity of 0.7
  }

  idle()
  {
    this.busyRequestCount--;
    if(this.busyRequestCount <= 0)
    {
      this.busyRequestCount = 0;
      this.spinnerService.hide();
    }
  }



}
