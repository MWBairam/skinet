using Core.Entities;
using Microsoft.EntityFrameworkCore;

namespace Infrastructure.Data
{
    public class StoreContext : DbContext
    {
        //generating this constructor with the DbContext options allows as to use multiple options such as using a connection string in the appsettings.json or appsettings.Development.json
        public StoreContext(DbContextOptions<StoreContext> options) : base(options)
        {
        }
        public DbSet<Product> Products {get; set;}
    }
}