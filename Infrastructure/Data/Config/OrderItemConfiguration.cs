//this class is to put some specification on the columns of the OrderItem entity like: not nullable column, nvarchar with max of 100 char ...
//this could have been done as we learnt in asp.net course with hanadi hmaideh using Data Anotation like [Requiered] for not nullabel ... which is written above the column name in the OrderItem class
//here we do it using a new way
//also, configure the relation between sql models of OrderItem <-> Order !

//inherit the microsoft already defined service (Interface) "IEntityTypeConfiguration" for the Entity <OrderItem>
//then implement it using the function "Configure"
//in this function, use a parameter of type EntityTypeBuilder<OrderItem> to rebuild the OrderItem Entity as we want:

//**Then the rest of the config is in the StoreContext class, in the OnModelCreating override function 



using Core.Entities.OrderAggregate;
using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;

namespace Infrastructure.Data.Config
{
    public class OrderItemConfiguration : IEntityTypeConfiguration<OrderItem>
    {
        public void Configure(EntityTypeBuilder<OrderItem> builder)
        {
            //since the OrderItem model uses a property of type of ProductItemOrdered class, but without sql relation, we should say that here:
            //(ItemOrdered is a property of type "ProductItemOrdered" in "OrderItem" model)
            //for aggregating this object as a property in OrderItem model:
            builder.OwnsOne(i => i.ItemOrdered, io => {io.WithOwner();});

            //tell explicitly the DB that the price is a decimal value, with 18 decimal digits and 2 digits after the point.
            //it is not supported in sqlite, but will be useful when we move to MySql when we go to production
            builder.Property(i => i.Price).HasColumnType("decimal(18,2)");
        }
    }
}