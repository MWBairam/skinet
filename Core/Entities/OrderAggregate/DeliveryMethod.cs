namespace Core.Entities.OrderAggregate
{
    public class DeliveryMethod : BaseEntity
    {
        //it has an Id (from the Baseentity)
        //this is going to be a parent sql model with the child "Order" model.
        

        public string ShortName { get; set; }
        public string DeliveryTime { get; set; }
        public string Description { get; set; }
        public decimal Price { get; set; }
    }

    //the sql relation between the DeliveryMethod (parent model) and Order (child model) is configured in Infrastructure project, in Data/config folder in OrderConfiguration    
}