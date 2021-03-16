using System;
using System.Linq.Expressions;
using Core.Entities.OrderAggregate;

namespace Core.Specifications
{
    //this used to get an order by PaymentId column value.
    //we used it in the PaymentService.
    //inherite the generic BaseSpecification class while passing to it our model "Order"
    //so we can use the property "public Expression<Func<T, bool>> Criteria {get;}" which is indeed a .where() lambda expression.
    public class OrderByPaymentIntentSpecification : BaseSpecification<Order>
    {
        //create a constructor, so when we instantiate this class, we pass a PaymentIntentId to this constructor.
        //then use this passed value and pass it in the base consrtuctor of the inherited BaseSpecification class 
        //(BaseSpecification class instantiated when we make an instance of this class since this class inherits the BaseSpecification.)
        //and we pass to its "criteria" property, the expression: o => o.PaymentIntentId == paymentIntentId
        public OrderByPaymentIntentSpecification(string paymentIntentId) 
            : base(o => o.PaymentIntentId == paymentIntentId)
        {
        }

        //after that, when we use the GetEnityWithSpec method in the GenericRepository in the PaymentService,
        //the GetEnityWithSpec method will send this instantiated class to the SpecificationEvaluator in Infrastructure project, Data folder,
        //in which, the .where(//our expression) statment is formed to be used when queryin the _StoreContext.
    }
}