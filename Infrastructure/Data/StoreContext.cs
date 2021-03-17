using System;
using System.Linq;
using System.Reflection;
using Core.Entities;
using Core.Entities.OrderAggregate;
using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Storage.ValueConversion;

namespace Infrastructure.Data
{
    public class StoreContext : DbContext
    {
        //generating this constructor with the DbContext options allows as to use multiple options such as using a connection string in the appsettings.json or appsettings.Development.json
        public StoreContext(DbContextOptions<StoreContext> options) : base(options)
        {
        }
        
        //products related tables:
        public DbSet<Product> Products {get; set;}
        public DbSet<ProductType> ProductTypes {get; set;}
        public DbSet<ProductBrand> ProductBrands {get; set;}
        
        //order related tables:
        public DbSet<DeliveryMethod> DeliveryMethods {get; set;}
        public DbSet<Order> Orders {get; set;}
        public DbSet<OrderItem> OrderItem {get; set;}

        //contact us:
        public DbSet<Message> Messages {get; set;}





        //to apply the config (in Config folder) of the Entities, we need to override one function of the DbContext derived class:
        protected override void OnModelCreating(ModelBuilder modelbuilder)
        {
            base.OnModelCreating(modelbuilder);
            modelbuilder.ApplyConfigurationsFromAssembly(Assembly.GetExecutingAssembly());




            //this was added for video 61:
            //when trying to sort "Products" using price, client send this https get: 
            //https://localhost:5001/api/products?sort=priceAsc ot:
            //https://localhost:5001/api/products?sort=priceDesc 
            //the price is decimal type of columns which is not fully supported in sqlite, so we will get an error while trying to sort with pricewe will get an error while trying to sort with price
            //so add this piece of code:
            //to test if the db is sqlite, so convert all decimal properties to double, if not (when we use sql in the production env), keep it decimal:
            
            //also, the same problem with the property (DateTimeOffset OrderDate) in Order model, the type DateTimeOffset is not supported in sqlite,
            //so convert it to DateTimeOffsetToBinaryConverter
            
            if(Database.ProviderName == "Microsoft.EntityFrameworkCore.Sqlite")
            {
                //loop on all entities (Products, Orders, ....)
                //inside each entity, loop on all attributes
                foreach(var entityType in modelbuilder.Model.GetEntityTypes())
                {
                    //get the decimal properties only:
                    var propertiesDecimal = entityType.ClrType.GetProperties().Where(p => p.PropertyType == typeof(decimal));
                    //and find all the properties with type DateTimeOffset:
                    var propertiesDateTimeOffset = entityType.ClrType.GetProperties().Where(p => p.PropertyType == typeof(DateTimeOffset));
                    
                    //now change the decimals types to double:
                    foreach(var property in propertiesDecimal)
                    {
                        modelbuilder.Entity(entityType.Name).Property(property.Name).HasConversion<double>();
                    }
                    //and change the DateTimeOffset to DateTimeOffsetToBinaryConverter:
                    foreach(var property in propertiesDateTimeOffset)
                    {
                        modelbuilder.Entity(entityType.Name).Property(property.Name).HasConversion(new DateTimeOffsetToBinaryConverter());
                    }
                }
            }

        } 
    }
}