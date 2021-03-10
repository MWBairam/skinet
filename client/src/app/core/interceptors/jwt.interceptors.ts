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
