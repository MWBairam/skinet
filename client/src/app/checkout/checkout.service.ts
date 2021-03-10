import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from 'src/environments/environment';
import { IOrderToCreate } from '../shared/models/order';

//make this service file injectable of ocurse, so we can inject it in the basket.component.ts 
@Injectable({
  providedIn: 'root'
})

//make it injectable sowe can inject it anywhere else
export class CheckoutService 
{
  //1-properties:
  //baseurl in the appSettings.Development.json https://localhost:4200/api/
  baseUrl = environment.apiUrl;

  //2-constructor:
  constructor(private http: HttpClient) { }

  //3-methods:
  /*
  we have checkout-address.component.ts, checkout-delivery.component.ts, checkout-review.component.ts and checkout-payment.component.ts:
  so we need to Http Put the address info that the user will insert in checkout-address.component.ts
  we need to Http Get the DeliveryMethods we have in DB to display them in checkout-delivery.component.ts 
  we need to Http Get the Order before submitting it 

  ........

  */
  //1-get DeliveryMethods:
  /*
  -go back to AccountController, or OrdersController, it has [Authorize] annotation, which means the user cannot send https requests to methods there unless logged in.
  -also, some methods there extracts user's info (email and display name ) from the token (we inserted those in the token creation process in Infrastructure project, Services folder, TokenService.cs).

  for both of the 2 reasons, we need to insert the current logged in user's token in the https header (Authorization part of the header).
  and to do that, we can use in each method (as in the loadCurrentUser() method in account.service.ts):
     let headers = new HttpHeaders();  
     headers = headers.set('Authorization', `Bearer ${token}`);
     return this.http.get(this.baseUrl + '<apiName>/<method>', {headers}) 

  or depend on the jwt.interceptor.ts in shared/interceptors folder here which does that automatically since it is imported in app.module.ts
  */
  getDeliveryMethods()
  {
    return this.http.get(this.baseUrl + 'orders/deliveryMethods');
    //get the list of the EeliveryMethods we have from DB, 
    //and we say always, the value we want in https response is in an obseravble which we need to subscribe to it 
    //using .subscribe() to extract the value, but we will not do it here, we will do that in checkout-delivery.component.ts
    
    //the lecturer in 236 ordered the returned list using .sort according to delivery method price (since we did not do that in API project using OrderAsc(x => x.pric) becuase it was hard using IGeneric repo)
    //anyway, I did not do that since in the DB the records are already sorted according to price when we inserted them.
  }


  //create an order
  //we will pass to here data described in shared/models/order.ts in IOrderToCreate 
  //which will received in the ceateOrder method in the OrdersController by the orderDto.
  //remember that the creatOrder method in the API has the [Authorize] so we aressending the user's token as explained above.
  createOrder(order: IOrderToCreate) 
  {
    //https post request to ceateOrder method in the OrdersController
    //url=https://localhost:4200/api/orders
    //the body of the request is the "order" we have passed to here.
    return this.http.post(this.baseUrl + 'orders', order);
  }
}
