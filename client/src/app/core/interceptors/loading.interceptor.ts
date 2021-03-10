
import { HttpInterceptor, HttpRequest, HttpHandler, HttpEvent } from '@angular/common/http';
import { Observable } from 'rxjs';
import { BusyService } from '../services/busy.service';
import { Injectable } from '@angular/core';
import { delay, finalize } from 'rxjs/operators';

//make this service file injectable of ocurse, so we can inject it in the basket.component.ts 
@Injectable()
export class LoadingInterceptor implements HttpInterceptor {

    //1-properties:

    //2-constructor:
    //inject the busy.service.ts we created (which in turn uses the NgxSpinnerService and have methods to show and hide it)
    constructor(private busyService: BusyService) {}

    //3-methods:
    //intercept any http response by implementing the abovementioned interface HttpInterceptor.
    intercept(req: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
        //start the spinner by calling the busy method
        this.busyService.busy();
        //after that, we mean by "next" is to continue any next processing, and we need to handle the "next" here by
        //delaying any next processing for 1000 milliseconds, then finalize the spinner by hiding it using the idle function:
        return next.handle(req).pipe(
            delay(1000),
            finalize(() => {
                this.busyService.idle();
            })
        );
    }
}
    //then import this in app.module.ts in the Providers array.

    

/*
if you want to exclude a specific http request from being intercepted to be delayed in order to display the spinner,
you can add the following example before the calling the .busy method:

        //for example, exclude the https ost request which includes in its link the 'orders' keyword,
        //like the https://localhost:4200/api/orders (calling the OrdersController in API project)
        if (req.method === 'POST' && req.url.includes('orders')) 
        {
            return next.handle(req);
        }
        //for example, exclude and bypass any https delete request:
        if (req.method === 'DELETE') 
        {
            return next.handle(req);
        }
*/
