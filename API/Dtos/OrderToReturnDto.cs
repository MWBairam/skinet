using System;
using System.Collections.Generic;
using Core.Entities.OrderAggregate;

namespace API.Dtos
{
    //the OrderDto was created to match data received from the angular side.
    //this OrderToReturnDto is the data we are sending to the angular side to display there.

    
    public class OrderToReturnDto
    {
        public int Id { get; set; }
        public string BuyerEmail { get; set; }
        public DateTimeOffset OrderDate { get; set; }
        public Address ShipToAddress { get; set; }
        public string DeliveryMethod { get; set; }
		public decimal ShippingPrice { get; set; }
        public IReadOnlyList<OrderItemDto> OrderItems { get; set; }
        public decimal Subtotal { get; set; }
        public string Status { get; set; }

        //Also:
        //in "Order" model, there is a method named as "GetTotal" which calculates:
        // return Subtotal + DeliveryMethod.Price;
        //so in API project, Helper/MappingProfiles.cs where we map the "Order" to "OrderToReturnDto",
        //the IMapper is clever enough to notice the keyword "Get" in the method name,
        //and will generate a property called "Total" in OrderToReturnDto,
        //and no need to write anything to tell it to do that !
    }
}