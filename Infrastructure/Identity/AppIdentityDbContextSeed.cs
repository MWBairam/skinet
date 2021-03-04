using System.Linq;
using System.Threading.Tasks;
using Core.Entities.Identity;
using Microsoft.AspNetCore.Identity;


//we will seed to the Db of the AppIdentityDbContext a test user with the help of microsoft already defined service "UserManager"

namespace Infrastructure.Identity
{
    public class AppIdentityDbContextSeed
    {
        // //1-properties:
        // UserManager<AppUser> _userManager;

        // //2-constructor:
        // //inject in it (Dependency inject) the Usermanager microsoft service:
        // public AppIdentityDbContextSeed(UserManager<AppUser> userManager)
        // {
        //     _userManager = userManager;
        // }


        //3-methods:
        //static method, so we can call it anywhere without creating an instance of this class.
        //we will inject directly to it the Usermanager microsoft service, and no need for the above constructor and property:
        //UserManager comes from the Identity service in startup file in API project
        public static async Task SeedUsersAsync(UserManager<AppUser> userManager)
        {
            if (!userManager.Users.Any()) //anyway, when seeding this test user once the app starts, check that he is not really existed !
            {
                var user = new AppUser //create an instance of the AppUser:IdentityUser we have in core project, models\Iidentity folder
                {
                    DisplayName = "Bob", //this come from the AppUser class
                    Email = "bob@test.com", //this come from the inherited IdentityUser in AppUser class
                    UserName = "bob@test.com", //this come from the inherited IdentityUser in AppUser class
                    Address = new Address //this come from the AppUser class, which is in turn an object of Address model
                    {
                        FirstName = "Bob",
                        LastName = "Bobbity",
                        Street = "10 The Street",
                        City = "New York",
                        State = "NY",
                        Zipcode = "90210"
                    }
                };

                //now using the injected UserManager microsoft identity service, create the above user with the follwoing password:
                await userManager.CreateAsync(user, "Pa$$w0rd");
            }
        }
    }
}