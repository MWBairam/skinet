import { Component, OnInit } from '@angular/core';
import { OrdersService } from './orders.service';
import { IOrder } from '../shared/models/order';

@Component({
  selector: 'app-orders',
  templateUrl: './orders.component.html',
  styleUrls: ['./orders.component.scss']
})
export class OrdersComponent implements OnInit 
{
  //1-properties:
  //store the returned orders list in here
  orders: IOrder[]; //type of IOrder is in shared/models/order.ts

  //2-constructor:
  //inject the orders.service.ts we designed:
  constructor(private ordersService: OrdersService) { }

  //3-methods:
  //lifecycle methods:
  ngOnInit() 
  {
    this.getOrders();
  }
  //get all orders of a user:
  getOrders() 
  {
    this.ordersService.getOrdersForUser()
    .subscribe //subscribe to the returned observable in the https response to extract the value from it
    (
      (orders: IOrder[]) => {this.orders = orders;}, //store the list of orders in the above property
      error => {console.log(error);}
    );
  }

  //get an order of a user by the order Id is in the order-detailed.component.ts

}
