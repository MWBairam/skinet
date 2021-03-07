//this class is to put some specification on the columns of the Order entity like: not nullable column, nvarchar with max of 100 char ...
//this could have been done as we learnt in asp.net course with hanadi hmaideh using Data Anotation like [Requiered] for not nullabel ... which is written above the column name in the Order class
//here we do it using a new way
//also, configure the relation between sql models of Order, OrderItem and DeliveryMethod !

//inherit the microsoft already defined service (Interface) "IEntityTypeConfiguration" for the Entity <Order>
//then implement it using the function "Configure"
//in this function, use a parameter of type EntityTypeBuilder<Order> to rebuild the Order Entity as we want:

//**Then the rest of the config is in the StoreContext class, in the OnModelCreating override function 


using System;
using Core.Entities.OrderAggregate;
using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;

namespace Infrastructure.Data.Config
{
    public class OrderConfiguration : IEntityTypeConfiguration<Order>
    {
        public void Configure(EntityTypeBuilder<Order> builder)
        {
            //configure the relation with parent model DeliveryMethod and this child model Order:
            //since we wrote in Order model:
            //public DeliveryMethod DeliveryMethod { get; set; }
            //so the EntityFramework will understand automatically that DeliveryMethod is parent and Order is child and create a foreign key in it !
            //so no need to write anything !

            //configure the relation with this model Order as parent and the child model OrderItem:
            //since we wrote in Order model:
            //public IReadOnlyList<OrderItem> OrderItems { get; set; }
            //so the EntityFramework will understand automatically that Order is parent and OrderItem is child since Order has a list of it, and create a foreign key for Order in OrderItem !
            //so no need to write anything !
            //but we want to define as well that the deletion of Order record should delete all the related OrderItem records:
            builder.HasMany(o => o.OrderItems).WithOne().OnDelete(DeleteBehavior.Cascade);

            //since the Order model uses a property of type of Address class, but without sql relation, we should say that here:
            //(ShipToAddress is a property of type "Address" in "Order" model)
            //for aggregating this object as a property in Order model:
            builder.OwnsOne(o => o.ShipToAddress, a => {a.WithOwner();});

            //since the Order model uses a property of type OrderStatus class, but without sql relation, we should say that here:
            //(Status is a property of type "OrderStatus" in Order "model" )
            //(and remember that it is an Enum with converstion from index to text as we explained there !)
            //for aggregating this object as a property in Order model:
            builder.Property(s => s.Status)
                .HasConversion(o => o.ToString(),o => (OrderStatus) Enum.Parse(typeof(OrderStatus), o));

   
        }
    }
}