using API.Errors;
using Infrastructure.Data;
using Microsoft.AspNetCore.Mvc;

namespace API.Controllers
{
    //this API Controller is used to return 4 types of Https Errors for testing purposes in postman !
    //not found 404 error, server error, bad request 400 error, validation-related bad request error 

    [ApiController]
    [Route("api/[controller]")]
    public class BuggyController : ControllerBase
    {
        private readonly StoreContext _context;
        public BuggyController(StoreContext context)
        {
            _context = context;
        }





        //using this example function, we will try to return the https NotFound error ! 
        [HttpGet("notfound")]
        public ActionResult GetNotFound()
        {
            //try to get anything we know that it is not existed in the DB !
            //such as the Product of Id=1000 which we know that it is not existed now !
            var thing = _context.Products.Find(1000);
            if(thing == null)
            {
                //we know that thing will be null !, so:
                //return with it the ApiResponse we designed in the Errors folder:
                return NotFound(new ApiResponse(404));
            }

            //this return is useless and the code will reach this line because NotFound will be returned !
            return Ok();
        }








        //using this example function, we will try to return the https ServerError ! 
        [HttpGet("servererror")]
        public ActionResult GetServerError()
        {
            //try to get anything we know that it is not existed in the DB !
            //such as the Product of Id=1000 which we know that it is not existed now !
            var thing = _context.Products.Find(1000);
            //since we know that thing will be = null,
            //let us try to execute any function, such as the .ToString(), on a null var ! which will generates an exception of ServerError
            var thingToReturn = thing.ToString();

            //this return is useless and the code will reach this line because an exception will be generated !
            return Ok();
        }









        //using this example function, we will try to return the https BadRequest error ! 
        [HttpGet("badrequest")]
        public ActionResult GetBadRequest()
        {
            //return with it the ApiResponse we designed in the Errors folder:
            return BadRequest(new ApiResponse(400));
        }






        //using this example function, we will try to return the https validation-related BadRequest error ! 
        //we can generate this error simply by passing a string to the int id parameter !
        [HttpGet("badrequest/{id}")]
        public ActionResult GetNotFoundRequest(int id)
        {
            //this return is useless and the code will reach this line because an exception will be generated !
            return Ok();
        }







    }
}