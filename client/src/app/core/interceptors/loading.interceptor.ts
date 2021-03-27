
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
    intercept(req: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> 
    {
        if (req.method === 'POST' && req.url.includes('orders')) 
        {
            //in checkout-payment.component.ts, the button "submit order", will send https post request to OrdersController
            //  https://localhost:5001/api/orders (and the order to create is in the body part).
            //we want to exclude this request from being delayed to display the loading indicator,
            //and in checkout-payment.component.ts, the button "submit order" we will display a font-awesome spinner icon.
            return next.handle(req);
        }
        if (req.method === 'POST' && req.url.includes('basket')) 
        {
            //in checkout-deivery.component.ts, when we click on any delivery method to be chosen,
            //this post request will be sent to update the basket  https://localhost:5001/api/basket 
            //(and the deliverymethod to save in the basket is in the body part).
            //we want to exclude this request from being delayed to display the loading indicator,
            return next.handle(req);
        }
        if (req.method === 'POST' && req.url.includes('message')) 
        {
            //in contact.component.ts, when we click on send message,
            //this post request will be sent to update the basket  https://localhost:5001/api/message/sendmessage 
            //(and the message to save in is in the body part).
            //we want to exclude this request from being delayed to display the loading indicator,
            //and in contact.component.ts, the button "send message" we will display a font-awesome spinner icon.
            return next.handle(req).pipe(delay(2000));
        }
        if (req.method === 'POST' && req.url.includes('payments')) 
        {
            //in checkout-review.component.ts, the button "go to payment", will send https post request to PaymentsController
            //  https://localhost:5001/api/payments to creat a pyamentIntent (and the pyamentIntent to create is in the body part).
            //we want to exclude this request from being delayed to display the loading indicator,
            //and in checkout-review.component.ts, the button "go to payment" we will display a font-awesome spinner icon.
            //but anyway, delay it in order to show the spinner there.
            return next.handle(req);
        }
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
        //like the https://localhost:5001/api/orders (calling the OrdersController in API project)
        if (req.method === 'POST' && req.url.includes('orders')) 
        {
            return next.handle(req);
        }
        //for example, exclude and bypass any https delete request:
        if (req.method === 'DELETE') 
        {
            return next.handle(req);
        }

        //or:
        if(req.url.includes('orders'))
        {
            return next.handle(req);
        }
*/
