import { Component, OnInit } from '@angular/core';
import { IOrder } from 'src/app/shared/models/order';
import { ActivatedRoute } from '@angular/router';
import { BreadcrumbService } from 'xng-breadcrumb';
import { OrdersService } from '../orders.service';

@Component({
  selector: 'app-order-detailed',
  templateUrl: './order-detailed.component.html',
  styleUrls: ['./order-detailed.component.scss']
})
export class OrderDetailedComponent implements OnInit 
{
  //1-properties:
  order: IOrder; 
  //we will bring the order from the DB, 
  //and remember from core project, Entites/orderAggregate/order that it has a property IReadOnlyList<orderItem>
  //and rememebr that in client/shared/models/order.ts in IOrder we match that exactly.
  //we will display in the html file the list of order items by reaching it using order.orderItems

  //2-constructor:
  //inject the ActivatedRoute and BreadcrumbService to use the breadcrumb service 
  //(remember the notes about it in product-detail.component.ts)
  //inject the ordersService we designed to get an order by its Id for a user
  constructor(private route: ActivatedRoute, 
    private breadcrumbService: BreadcrumbService, 
    private ordersService: OrdersService) 
  {
    this.breadcrumbService.set('@OrderDetailed', '');
  }

  ngOnInit() 
  {
    this.ordersService.getOrderDetailed(+this.route.snapshot.paramMap.get('id')) //take the order Id from the route brough us to here using the routerLink in orders.component.html
      .subscribe //subscribe to the returned observable in the https response to extract the value from it
      (
        (order: IOrder) => {this.order = order;this.breadcrumbService.set('@OrderDetailed', `Order# ${order.id} - ${order.status}`);}, 
        error => { console.log(error);}
      );
  }
}