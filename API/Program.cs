using Microsoft.AspNetCore.Hosting;
using Microsoft.Extensions.DependencyInjection;
using Microsoft.Extensions.Hosting;
using Microsoft.Extensions.Logging;
using Infrastructure.Data;
using Microsoft.EntityFrameworkCore;
using System;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Identity;
using Core.Entities.Identity;
using Infrastructure.Identity;

namespace API
{
    public class Program
    {
        public static async Task Main(string[] args)
        {
            //--------------------------------------------------------------------------------------------
            //instead of only doing the following in this main() function:
            //CreateHostBuilder(args).Build().Run();
            //--------------------------------------------------------------------------------------------



            //we will modify it to create the requiered DB (if not existed) and do the update-databse (to complete any new migration) once this project is started.
            //This is essential for publishing the website on a production server, so at first startup, the Db is created on the production server, otherwise, 
            //we do not have any way to create the DB using EntityFramework.

            //the following is as recommended from microsoft:

            //instead of running CreateHostBuilder(args).Build() immediately using .Run() as before, we will assign it as a variable, then after we do the migration, 
            //we will run it:
            var host = CreateHostBuilder(args).Build();
            //now we need to use microsoft "Services", same as used in the startup.cs file
            //we should also, for any service we create, specify a lifetime for time,
            //and since we are out of the startup.cs services container (Configure function), we cannot use AddScoped or AddTransient or ... features
            //so we will control it with the "using" statment which disposes the objects after being performed:
            using (var timeScope = host.Services.CreateScope())
            {
                //now create an instance of services class with the lifetime of the above timeScop:
                var services = timeScope.ServiceProvider;
                //we need to log the actions here using the Ilogger service,
                //we will get the logger service using the ILoggerFactory:
                var loggerFactory = services.GetRequiredService<ILoggerFactory>();

                //now let us do the migration on startup of the program
                //but we need a mechanism to catch any exception oncce happens for any reason
                //we will use try and catch manually
                //for the services of the startup.cs file, we did not do that manually, exceptions were thrown by the functionalities in the startup.cs file
                try
                {
                    //get the StoreContext we have in the Infrastructure project, Data folder to migrate its tables:
                    var StoreContext = services.GetRequiredService<StoreContext>();
                    //now migrate its tables to the DB, and create the DB if not existed:
                    //do it using the async await mechanism (so add async above in the main() function defenition and instead of void, return a Task):
                    await StoreContext.Database.MigrateAsync();


                    //do the same for the second DbContext we have which is dedicted for microsoft identity tables:
                    var identityContext = services.GetRequiredService<AppIdentityDbContext>();
                    await identityContext.Database.MigrateAsync();
                     /*
                     Remember:
                     and since we have 2 contexts now !
                     1-the one we created in video 17 for the products, brands ,... tables and we called it StoreContext 
                     2-the one we have just created, to hold the identity tables, and we called it AppIdentityDbContext
                     so we have 2 databases, with 2 conenctionstrings  !
                     */
                    //also seed the test user we created in Infrastructure project in Identity folder in class AppIdentityDbContext
                    var userManager = services.GetRequiredService<UserManager<AppUser>>();
                    await AppIdentityDbContextSeed.SeedUsersAsync(userManager);
                }
                catch(Exception ex)
                {
                    //create a log for this, and specify the class to log against using the loggerfactory:
                    var logger = loggerFactory.CreateLogger<Program>();
                    //now write the exception with a string from our choice in the log file using the logger we created:
                    logger.LogError(ex, "An Error Occured During Migration");

                }

                //now run the project:
                host.Run();
            }
        }

        public static IHostBuilder CreateHostBuilder(string[] args) =>
            Host.CreateDefaultBuilder(args)
                .ConfigureWebHostDefaults(webBuilder =>
                {
                    webBuilder.UseStartup<Startup>();
                });
    }
}
