using System;
using System.Collections.Generic;

namespace Core.Entities.OrderAggregate
{
    public class Order : BaseEntity
    {
        //1-Properties:

        //it has an Id (from the Baseentity)

        //we will not associate the AspNetUsers table with the order tables !
        //we will just store the logged in user's Email in the column BuyerEmail as a fake relation !
        public string BuyerEmail { get; set; }

        //the time on server when the order was made:
        public DateTimeOffset OrderDate { get; set; } = DateTimeOffset.Now; //default value //and remove its set in the constructor

        //ShipToAddress is an instnance of the Address model we made,
        //it is not an sql relation !!
        public Address ShipToAddress { get; set; }
        //another line of config for this is in Data/config folder in OrderConfiguration for aggregating this object as a property here

        //it is an sql relation with the parent DeliveryMethod model:
        public DeliveryMethod DeliveryMethod { get; set; }
        //the sql relation between the DeliveryMethod (parent model) and Order (child model) is configured in Infrastructure project, in Data/config folder in OrderConfiguration    

        //OrderItem and Order are sql-related also,
        //each "Order" has a (collection of "OrderItem")
        public IReadOnlyList<OrderItem> OrderItems { get; set; }
        //the sql relation between the Order (parent model) and OrderItem (child model) is configured in Infrastructure project, in Data/config folder in OrderConfiguration    

        //the sum of (ProductItemOrdered Price * quantity) for each product !
        public decimal Subtotal { get; set; }

        //Status is an instnance of the OrderStatus model we made,
        //it is not an sql relation !!
        public OrderStatus Status { get; set; } = OrderStatus.Pending; //default value //and remove its set in the constructor
        //another line of config for this is in Data/config folder in OrderConfiguration for aggregating this object as a property here
 
        //we will discuss later in the Payment part !
        public string PaymentIntentId { get; set; }





        //2-constructor:
        //constructor with parameters so when we create an instance of this class, we can pass values to the constructor to set the above properties:
        public Order(IReadOnlyList<OrderItem> orderItems, string buyerEmail, Address shipToAddress, DeliveryMethod deliveryMethod, decimal subtotal)
        {
            BuyerEmail = buyerEmail;
            //OrderDate has a default value
            ShipToAddress = shipToAddress;
            DeliveryMethod = deliveryMethod;
            OrderItems = orderItems;
            Subtotal = subtotal;
            //Status has a default value
            //PaymentIntentId = paymentIntentId;

        }

        //since we got a constructor with parameters, we need to write the parameter-less constructor,
        //otherwise EntityFramework will complain and produce errors:  
        public Order()
        {
        }


        //3-methods:
        //also, creater a getter method to bring the Subtotal + Delivery costs:
        public decimal GetTotal()
        {
            return Subtotal + DeliveryMethod.Price;
        }
        //this method named as "GetTotal" which calculates:
        // return Subtotal + DeliveryMethod.Price;
        //so in API project, Helper/MappingProfiles.cs where we map the "Order" to "OrderToReturnDto",
        //the IMapper is clever enough to notice the keyword "Get" in the method name,
        //and will generate a property called "Total" in OrderToReturnDto,
        //and no need to write anything to tell it to do that !
    }
}