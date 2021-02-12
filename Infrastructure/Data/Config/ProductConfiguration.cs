//this class is to put some specification on the columns of the Product entity like: not nullable column, nvarchar with max of 1pp char ...
//this could have been done as we learnt in asp.net course with hanadi hmaideh using Data Anotation like [Requiered] for not nullabel ... which is written above the column name in the Product class
//here we do it using a new new

//inherit the microsoft already defined service (Interface) "IEntityTypeConfiguration" for the Entity <Product>
//then implement it using the function "Configure"
//in this function, use a parameter of type EntityTypeBuilder<Product> to rebuild the Product Entity as we want:

//**Then the rest of the config is in the StoreContext class, in the OnModelCreating override function 


using Core.Entities;
using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;

namespace Infrastructure.Data.Config
{
    public class ProductConfiguration : IEntityTypeConfiguration<Product>
    {
        public void Configure(EntityTypeBuilder<Product> builder)
        {
            //indeed, no need to say that the Id is requiered, beause it is by default and assigned by the DB, but just let us say it:
            builder.Property(p => p.Id).IsRequired();
            //make the name and description columns not nullable (requiered) and with max of 100 character
            builder.Property(p => p.Name).IsRequired().HasMaxLength(100);
            builder.Property(p => p.Description).IsRequired().HasMaxLength(100);
            //tel explicitly the DB that the price is a decimal value, with 18 decimal digits and 2 digits after the point\
            //it is not supported in sqlite, but will be useful when we move to MySql when we go to production
            builder.Property(p => p.Price).HasColumnType("decimal(18,2)"); 
            //make the pictureUrl not nullable string:
            builder.Property(p => p.PictureUrl).IsRequired();
            //now, complete the relations configuration of this entity with the ProductType and ProductBrand entities:
            builder.HasOne(b => b.ProductBrand).WithMany()
                .HasForeignKey(p => p.ProductBrandId);
            builder.HasOne(t => t.ProductType).WithMany()
                .HasForeignKey(p => p.ProductTypeId);
        }
    }
}

