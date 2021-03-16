import { IAddress } from "./address";

//model to the order we are sending to the CreateOrder(OrderDto orderDto) method in OrdersController in the API project 
export interface IOrderToCreate {
    basketId: string;
    deliveryMethodId: number;
    shipToAddress: IAddress;
    paymentIntentId: string;
}

//model for the order we are receiving from the "public async Task<ActionResult<Order>> CreateOrder(OrderDto orderDto)" method
//in the OrdersController in the API project.
//(remember in the CreateOrder method, when we create an order in the DB, we return all its fileds to the frontend !)
//(dont know we the lecturer did that !)
export interface IOrder {
    id: number;
    buyerEmail: string;
    orderDate: string;
    shipToAddress: IAddress;
    deliveryMethod: string;
    shippingPrice: number;
    orderItems: IOrderItem[]; //described below:
    subtotal: number;
    status: string;
  }
  
  export interface IOrderItem {
    productId: number;
    productName: string;
    pictureUrl: string;
    price: number;
    quantity: number;
  }