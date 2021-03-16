namespace API.Dtos
{
    public class OrderDto
    {
        //those are the fields of "Order" we are receiving from angular when creating the order in checkout-payment.component.ts
        public string BasketId { get; set; }
        public int DeliveryMethodId { get; set; }
        public AddressDto ShipToAddress { get; set; }
        public string PaymentIntentId {get; set;}
    }
}