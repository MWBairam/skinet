
import { HttpInterceptor, HttpRequest, HttpHandler, HttpEvent } from '@angular/common/http';
import { Observable } from 'rxjs';
import { BusyService } from '../services/busy.service';
import { Injectable } from '@angular/core';
import { delay, finalize } from 'rxjs/operators';

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
