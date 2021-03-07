namespace Core.Entities.OrderAggregate
{
    public class OrderItem : BaseEntity
    {

        //1-Properties:

        //it has an Id (from the Baseentity)
        //this is going to be a child sql model with the parent "Order"
        
        public ProductItemOrdered ItemOrdered { get; set; } //it uses the model ProductItemOrdered as a property
        //another line of config for this is in Data/config folder in OrderItemConfiguration for aggregating this object as a property here
        public decimal Price { get; set; }
        public int Quantity { get; set; }
        //the sql relation between the Order (parent model) and OrderItem (child model) is configured in Infrastructure project, in Data/config folder in OrderConfiguration    
        

        //2-constructor:
        //constructor with parameters so when we create an instance of this class, we can pass values to the constructor to set the above properties:
        public OrderItem(ProductItemOrdered itemOrdered, decimal price, int quantity)
        {
            ItemOrdered = itemOrdered;
            Price = price;
            Quantity = quantity;
        }

        
        //since we got a constructor with parameters, we need to write the parameter-less constructor,
        //otherwise EntityFramework will complain and produce errors:      
        public OrderItem()
        {
        }
    }
}