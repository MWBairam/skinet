using System.IO;
using Microsoft.AspNetCore.Mvc;

namespace API.Controllers
{
    //This inherits the mvc "controller", not the BaseController as we did use in the other controllers !
    
    //Important Note: its main functionality is explained in startup.cs file, in the bottom of the file, in the app.UseEndpoints middleware !
    public class FallbackController : Controller
    {
        public IActionResult Index()
        {
            return PhysicalFile(Path.Combine(Directory.GetCurrentDirectory(), "wwwroot", "index.html"), "text/HTML");
            //this returns the page https://localhost:5001/index.html
            
        }
    }
}