import { HttpInterceptor, HttpRequest, HttpHandler, HttpEvent } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { Router, NavigationExtras } from '@angular/router';
import { Injectable } from '@angular/core';
import { catchError, delay } from 'rxjs/operators';
import { ToastrService } from 'ngx-toastr';


  
//to catch an error somewhere, we will use what we call it "HttpInterceptor" which is same as the try and catch in C#
//so we can intercept the https responses coming from the api and check if those contain any error 
//then if there is an error,
//redirect the user web page to the not-found.component.html or server-error.component.html or ....

//let us build our interceptor by implementing the HttpInterceptor in the below class,
//so that we can use it in any other place we want 


//make this intrceptor injectable, so we can use anywere else as an injected depenency
@Injectable()
//this class implements the interface HttpInterceptor
export class ErrorInterceptor implements HttpInterceptor 
{
    //1-properies:

    //2-constructor
    //use dependency injection to inject the RouterModule (in the first if below, I explained its usage)
    //and inject the toastr service which allows us to display errors in notifications 
    constructor(private router: Router, private toastr: ToastrService) {}

    //3-methods:
    //a-Implement the method in HttpInterceptor here:
    //intercept any http request/response, and take the result as an aboservable, 
    //so we need the .pipe to process it  
    intercept(req: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
        return next.handle(req).pipe(
            catchError(CaughtError => {
                if (CaughtError) {
                    if (CaughtError.status === 400) 
                    {

                        //in API project, we tested 4 types of errors in the BuggyController,
                        //and we designed ApiRespnse for them to be included in the https response in the Errors folder in API project 

                        //for the error 400, we tested 2 ones,
                        //one related to validation purposes, such as pasing a string to an integer variable !
                        //and this is processed inside the following "if" and the handling is by throwing the error to be displayed 
                        //the other one related to notFound issues ! and the handling is to display the error message we designed in a toastr notification

                        if(CaughtError.error.errors)
                        {
                            //in the CaughtError.error.errors:
                            //the first CaughtError is the actual complete error of the https response we caught above besides catchError
                            //the second error keyword is the error part we added inside the actual error message
                            //for the validation-based errors, we return with the "error" part we designed, an array of the validations happened, and we called it also errors !
                            //look at the picture in the course folder section 11 !
                            //so if this validations array is existed, throw the error:
                            throw CaughtError.error;
                        }
                        else
                        {
                        //otherwise, if it is notFound error:

                        //before using the toastr notifications to  display errors,
                        //we redirected the user to the not-found.component.html (its route is in app-routing.module.ts)
                        //   this.router.navigateByUrl('/not-found');
                        //now we will do something different, will not open and redirect the user to a new page where we write the error,
                        //we will display the error in the same page in a small notification,
                        //remember that we installed the toastr package in this "client" project using "npm install ngx-toastr",
                        //then imported it (made it a singleton service) in the core.nodule.ts, so we can use it here,
                        //we injected it above in the constructor.
                        this.toastr.error(CaughtError.error.message, CaughtError.error.statusCode);
                        //in the CaughtError.error:
                        //the first CaughtError is the actual complete error of the https response we caught above besides catchError
                        //the second error keyword is the error part we added inside the actual error message
                        //remember we designed that in the API project, Errors folder in ApiResponse class and .... besides implementing it in the MiddleWare folder
                        //look at the picture in the course folder section 11 !
                        }
                    }
                    //there is another error 401 happens when the user is not logged in,
                    //while the method has [Authorize] which requiers him to be logged in
                    if(CaughtError.status == 401)
                    {
                        this.toastr.error(CaughtError.error.message, CaughtError.error.statusCode);
                    }                    
                    if(CaughtError.status == 404)
                    {
                        this.toastr.error(CaughtError.error.message, CaughtError.error.statusCode);
                    }
                    if (CaughtError.status === 500) 
                    {
                        //for the 400 error, first we redirected the browser to not-found.component.ts/.html , then commented this out to display a toastr notification instead
                        //for the 404 erro the same, we used a toastr notification
                        //for 400 validation-based errors, we did not redirect the browser to any component, and did not display any toastr notification. But we threw the error only 
                        //for 500 https error, we will redirect the browser to server-error.component.ts/.hml to disply the error with its info

                        //in the API project, Errors folder, we designed the class ApiException:ApiResponse, which is the https 500 error we want to be returned
                        //(and used it in the Middleware folder)
                        //this response we designed has an additional part we added to the original https response, and we called it also error !
                        //look at the picture in the course folder section 11 !
                        //once this error is recieved, we want to redirect the browser to server-error.component.ts/.html page while passing to it that error part we designed
                        //the Caughterror.error below is:
                        //the first CaughtError is the actual complete error of the https response we caught above besides catchError
                        //the second error keyword is the error part we added inside the actual error message
                        //we stored it in navigationExtras.status.error 
                        //using the navigationExtras is a new way we learn here to take out the part we want of an https response

                        const navigationExtras: NavigationExtras = {state: {error: CaughtError.error}};

                        this.router.navigateByUrl('/server-error', navigationExtras);
                        //and in server-error.component.ts we configured it to receive the naviagtion extras we configured above.
                    }
                }
                return throwError(CaughtError);
            })
        );
    }
}

//after that, go and make use of this in app.module.ts and add it in the providers array !



//summary:
//for the 400 error, first we redirected the browser to not-found.component.ts/.html , then commented this out to display a toastr notification instead
//for the 404 erro the same, we used a toastr notification
//also the 401
//for 400 validation-based errors, we did not redirect the browser to any component, and did not display any toastr notification. But we threw the error only 
//for 500 https error, we will redirect the browser to server-error.component.ts/.hml to disply the error with its info



/*
if you want to exclude a specific http request from being intercepted,
you can add the following example before the calling the catchError:

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
