using Core.Entities.Identity;
using Microsoft.AspNetCore.Identity.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore;

namespace Infrastructure.Identity
{
    public class AppIdentityDbContext : IdentityDbContext<AppUser>
    {
        public AppIdentityDbContext(DbContextOptions<AppIdentityDbContext> options) : base(options)
        {
        }


        //no need of course to add:
        //public DbSet<AppUser> AppUsers {get; set;}
        //because microsoft will add AspNetUsers table for any class inherits IdentityUser like the AppUser.
        //aslo, no need to create:
        //public DbSet<Address> Addresses {get; set;}
        //because microsoft will create by default a table called (Address) (without s unfortunately) because "Address" is a property in AppUser:IdentityUser
        
        
        
        
        //we need this overridde method to protect us from problems regarding AppUser : IdentityUser Id which is string by default from microsoft
        protected override void OnModelCreating(ModelBuilder builder) 
        {
            base.OnModelCreating(builder);
        }
    }
}