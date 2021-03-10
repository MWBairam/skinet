using System;
using System.Linq.Expressions;
using Core.Entities.OrderAggregate;

namespace Core.Specifications
{
    //here,

    /*
    we need to Get an "Order" from "Orders" table,
    with the parent record in DeliveryMethods table 
    and child records in OrderItetms table 
    so we need to use the Eager loading using .AddInclude (just as we did in ProductsWithTypesAndBrandsSpecification)
    since we are using the GenericRepository.
    */
    //make the constructor with the :base() which means use also derived (inherited) BaseSpecification class constructor
    //the BaseSpecification class constructor, if you take a look, has one parameter which sets the BaseSpecification "Criteria" attribute
    //the "Criteria" attribute was mainly built to have an expression such as x => x.Id when quering a specific product for example in the second constructor at the end of this file below
    //but since it is going to be constructed in a .Where() lambda expression in the SpecificationEvaluator in Infrastructure project Data folder,
    //so we can use it as well to write an expression like: x => x.brandId and x => x.typeId or x.OrderBuyerEmail or any one of these expressions alone
   
    //remember that for that we created an Interface with its implementation in this folder:
    //ISpecification/BaseSpecification.
   
    public class OrdersWithItemsAndOrderingSpecification : BaseSpecification<Order>
    {
        //to get all Orders of a user (of BuyerEmail) with the parent recordof DeliveryMethod and child records of OrderItems,
        //and the Orders are sorted by time,
        //we need to add the below AddInclude, and OrderByDesc, and pass to the constructor of the inherited class, the logged in user's email expression:
        public OrdersWithItemsAndOrderingSpecification(string email) : base(o => o.BuyerEmail == email)
        {
            //OrderItems is a property of IReadOnlyList<OrderItem> in Order model,
            //and since Orders and OrderItems are different tables, we are able to load all the OrderItems related to an Order
            //because orderItem is an aggregated property as we said above.
            //and use the AddInclude to do that:
            AddInclude(o => o.OrderItems);
            AddInclude(o => o.DeliveryMethod);
            AddOrderByDescending(o => o.OrderDate);
        }

        //same as above, but getting one Order according to its Id:
        public OrdersWithItemsAndOrderingSpecification(int id, string email) 
            : base(o => o.Id == id && o.BuyerEmail == email)
        {
            AddInclude(o => o.OrderItems);
            AddInclude(o => o.DeliveryMethod);
        }
    }
}