using API.Errors;
using Microsoft.AspNetCore.Mvc;

namespace API.Controllers
{
    //this controller is to retrun a specific error when the client side (our angular project) requests an api that does not exist !

    [ApiController]
    [Route("errors/{code}")]
    public class ErrorController
    {

        //[HttpGet] no need to specify this, we want this method to handle any type of http !
        //not writing the [HttpGet] will make the swagger webUI fails, and asks us to write [HttpGet] explicitly !
        //so to make swagger ignores this and not to show this API in its webUI:
        [ApiExplorerSettings(IgnoreApi = true)]

        public IActionResult Error(int code)
        {
            //return with it the ApiResponse we designed in the Errors folder:
            return new ObjectResult(new ApiResponse(code));
        }
        //now go the startup file to add this: app.UseStatusCodePagesWithReExecute("/errors/{0}") 
        //which redirects the page to this controller, to get back the ApiResponse from the above function
    }
}