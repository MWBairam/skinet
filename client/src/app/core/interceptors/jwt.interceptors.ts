import {HttpInterceptor, HttpRequest, HttpHandler, HttpEvent} from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

//make this service file injectable of ocurse, so we can inject it in the basket.component.ts 
@Injectable()


/*
-go back to AccountController, or OrdersController, it has [Authorize] annotation, which means the user cannot send https requests to methods there unless logged in.
-also, some methods there extracts user's info (email and display name ) from the token (we inserted those in the token creation process in Infrastructure project, Services folder, TokenService.cs).

for both of the 2 reasons, we need to insert the current logged in user's token in the https header (Authorization part of the header).
and to do that, we can use in each method:
   let headers = new HttpHeaders();  
   headers = headers.set('Authorization', `Bearer ${token}`);
   return this.http.get(this.baseUrl + '<apiName>/<method>', {headers}) 

or depend on the jwt.interceptor.ts in shared/interceptors folder here which does that automatically since it is imported in app.module.ts
*/

export class JwtInterceptor implements HttpInterceptor 
{
    //intercept each https request going out of this angular app
    intercept(req: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> 
    {
        //read the token of the current logged in user from the browser localstorage.
        //remember we saved that token using app/account/account.service.ts in the login() method.
        const token = localStorage.getItem('token');
        
        //then if token is not null (there is a logged in user)
        if (token) 
        {
           //clone the https request
            req = req.clone
            (
                {
                    //add the token to its header (in the Authorization part of the header)
                setHeaders: 
                {
                    Authorization: `Bearer ${token}`
                }
                }
            );
        }
        //return the https request which has in its header the token
        return next.handle(req);
    }

    //then import this in app.module.ts in the Providers array.
}


/*
if you want to exclude a specific http request from being intercepted,
you can add the following example before the calling the catchError:

        //for example, exclude the https post request which includes in its link the 'orders' keyword,
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