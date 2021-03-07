using System.Runtime.Serialization;

namespace Core.Entities.OrderAggregate
{
    //it is not a class !!
    //it is an Enum !
    public enum OrderStatus
    {
        [EnumMember(Value = "Pending")]
        Pending,

        [EnumMember(Value = "Payment Received")]
        PaymentRecevied,

        [EnumMember(Value = "Payment Failed")]
        PaymentFailed
    }

    //by default, this enum is going to return 0 for Pending, 1 for PaymentReceived, 2 for PaymentFailed.
    //but indeed we want the text of that to be returned, so we added the annotation of EnumMember.
    //to complete that conversion, also we need to configure this in Infrastructure project, in Data/config folder in OrderConfiguration   
    //Also,
    //the OrderStatus is going to be a property inside the Order, implemnted as a column, directly existed in the same row ! 
    //and we will configure that in Data/config folder in OrderConfiguration for aggregating this object as a property in Order model 

    //it is better to add more statuses like "Shippend" "Shipped" "Delivered" ......
}