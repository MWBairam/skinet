import { Injectable } from '@angular/core';
import { environment } from 'src/environments/environment';
import { HttpClient } from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class OrdersService 
{
  //1-properties:
  //read the base url (https:localhost:4200/api/) from the appSettings.development.json
  baseUrl = environment.apiUrl;

  //2-constructor:
  //inject the http client to send https requests to the OrdersController api
  constructor(private http: HttpClient) { }

  //3-methods:
  //get all orders of a user
  //send https://localhost:4200/api/orders so that the http Get method "GetOrdersForUser" is called.
  //remember that we are sending the current logged in user's token with the https request
  //so that the [Authorize] will allow the request, and we are able to extract the use's email there from the token.
  getOrdersForUser() {
    return this.http.get(this.baseUrl + 'orders');
  }
  //get an order of a user by the order Id.
  //send https://localhost:4200/api/orders/<Id> so that the http Get method "GetOrderByIdForUser" is called.
  //same note as above about the token
  getOrderDetailed(id: number) {
    return this.http.get(this.baseUrl + 'orders/' + id);
    
  }
}