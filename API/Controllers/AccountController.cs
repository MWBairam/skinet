using System.Linq;
using System.Security.Claims;
using System.Text.Json.Serialization;
using System.Threading.Tasks;
using API.Dtos;
using API.Errors;
using API.Extensions;
using AutoMapper;
using Core.Entities.Identity;
using Core.Interfaces;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;

namespace API.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class AccountController : ControllerBase
    {
        //1-properties:
        private readonly UserManager<AppUser> _userManager;
        private readonly SignInManager<AppUser> _signInManager;
        private readonly ITokenService _tokenService;



        //2-Constructor:
        //Inject and use the Microsoft identity services:
        //UserManager to create new users and search for a suer in database.
        //SignInManager to detect user's sign In.
        /*
        ITokenService we designed it in Core project, interfaces folder, 
        //and implemented it in Infrastructure project, Services folder.
        //it is tio generate tokens once the user logins or registers, and send it to the user after his login/register
        //so that he will send this token with each https request he sends.
        */
        public AccountController(UserManager<AppUser> userManager, SignInManager<AppUser> signInManager, ITokenService tokenService)
        {
            _signInManager = signInManager;
            _userManager = userManager;
            _tokenService = tokenService;
        }


        //3-methods:
        //a-login:
        [HttpPost("login")]
        public async Task<ActionResult<UserDto>> Login(LoginDto loginDto)
        {
            /*
             and since we want to ask the user to type hiss email and password only,
             so, we will send to this API controller these data only,
             and we want to return these data back to angular frontend (so we can display them),
             so create UserDto and LoginDto to specify the fields you want to be sent/returned for a user (so not all AppUser fileds are used in the login process)
            */

            //UserManager gives us the .FindByEmailAsync to search in the AspNetUsers table for a user with specific Email            
            var user = await _userManager.FindByEmailAsync(loginDto.Email); 

            //if no user was found with that email, return the Unauthorized error,
            //and displaying the https error 401 we flattened and re-designed in Errors folder, ApiResponse class (with the help of MiddleWare folder)
            if (user == null) return Unauthorized(new ApiResponse(401));

            //otherwise, the user is existed in the AspNetUsers table, so let us check if his password he ssent is correct:
            //we do that using the SignInManager service and the .CheckPasswordSignInAsync method,
            //it takes 3 parameters: the user to be signed in (we brought it above from usermanager.FindByEmailAsync),
            //and the password delivered to here, and if we want to lock the account if the password check failed !
            var result = await _signInManager.CheckPasswordSignInAsync(user, loginDto.Password, false);
            
            //if password check failed, return the Unauthorized error,
            //and displaying the https error 401 we flattened and re-designed in Errors folder, ApiResponse class (with the help of MiddleWare folder)
            if (!result.Succeeded) return Unauthorized(new ApiResponse(401));
            //we will not say why the login failed !
            
            //otherwise, the password check succeeded, 
            //we will not return true or any thing like that !
            //we will simply return Email and DisplayName to the angular client app so we can display in the nav-bar there ! 
            return new UserDto
            {
                Email = user.Email,
                DisplayName = user.DisplayName,
                Token = _tokenService.CreateToken(user)
            };
        }
        /*
        we can test this function by sending to https:localhost:4200/api/account/login these data in the body in postman:
        {
	     "email": "bob@test.com",
	     "password": "Pa$$w0rd"
        }
        //those are for the test user we seeded in infrastructure/Identity/AppIdentityDbContext 
        */








        //b-register:
        [HttpPost("register")]
        public async Task<ActionResult<UserDto>> Register(RegisterDto registerDto)
        {
            //the same here, from angular side, we will ask the user to insert DisplayName, Email, Passowrd, and not all the columns in AspNetUsers table (identified in AppUser:IdentityUser) !
            //so angular will send those data and we will recieve them here as RegisterDto.

            //using the below created method CheckEmailExistsAsync(), check if the email inserted by the user is already existed and used by user in the AspNetUsers table:
            if (CheckEmailExistsAsync(registerDto.Email).Result.Value)
            {
                return new BadRequestObjectResult(new ApiValidationErrorResponse{Errors = new []{"Email address is in use"}});
                //return the badRequest error,
                //and displaying the https error 400 we flattened and re-designed in Errors folder, ApiResponse class (with the help of MiddleWare folder)
            }



            //using the UserManager, create a new user:
            //smae way as we did it in the Infrastructure/Identity/AppIdentityDbContext
            var user = new AppUser //create an instance of the AppUser:IdentityUser we have in core project, models\Iidentity folder
            {
                DisplayName = registerDto.DisplayName, //this come from the AppUser class
                Email = registerDto.Email, //this come from the inherited IdentityUser in AppUser class
                UserName = registerDto.Email //this come from the inherited IdentityUser in AppUser class
                //both of Email, username is the email (requiered like that by microsoft !)

                //we will not ask him to add "Address" info here now like we added it in the Infrastructure/Identity/AppIdentityDbContext
                //, we will ask him to add Address info in other places like during checkout !
                //remember that we are using foe registering the RegisterDto class, which requiers only the displayname, email, password as requierd 1
            };
            
            //create the above created user using the UserManager and .CreateAsync
            var result = await _userManager.CreateAsync(user, registerDto.Password);

            //if creation did not succeed (because for example, the email is already existed since it is unique, or weak password since there is a default policy for that from microsoft), 
            //anyway, we processed the case of email is already existed above, and processed the weak password case in the RegisterDto using the RegularExpression data annotation !
            if (!result.Succeeded) return BadRequest(new ApiResponse(400));
            //return the badRequest error,
            //and displaying the https error 400 we flattened and re-designed in Errors folder, ApiResponse class (with the help of MiddleWare folder)
   
            //otherwise (creation was successful), return these info of the created user:
            return new UserDto //we can configure a mapping for that in Helper folder, MappingProfile class, and use it as we did in ProductsController !
            {
                DisplayName = user.DisplayName,
                Token = _tokenService.CreateToken(user),
                Email = user.Email
            };
        }
        /*
        we can test this function by sending to https:localhost:4200/api/account/register these data in the body in postman:
        {
	    "displayName": "Tom",
	    "email": "tom@test.com",
	    "password": "Pa$$w0rd"
        }
        then login using these data as we tested in the login method
        */











        //=========================================================================================
        //adding another set of functions, other than "login" and "Register", as an added value methods:

        //c-GetCurrentUser:
        //this is for the authorized users only, which means for the logged in user only.
        //it is an HtttpGet without a name and without parameters in the method, so we can call it using https://locallhost:4200/api/account only
        [Authorize]
        [HttpGet]
        public async Task<ActionResult<UserDto>> GetCurrentUser()
        {
            //the ? means that this can be a null. And if any if User or Claims is null, "email" will be null,
            //so that "user" will be null and an empty UserDto will be returned. 
            //first bring the user's email, buy how?
            //remember that we have implemented the usgae of tokens as we explained above at the top of this file.
            //when the client angular side sends the https request https://locallhost:4200/api/account, 
            //it will be with authorization header which contains the current logged in user's token !
            //remember that in TokenService in (Infrastructure project in Services folder) when we formed the token,
            //we embedded the use's Email and DisplayName as a list of "Claims".
            //now from the received token (in the authorization header of the https request https://locallhost:4200/api/account), 
            //we can re-extract the use's Email sing the HttpContext class, and User property, to the Claims list sub-property, to take the Email value out of it.
            var email = HttpContext.User?.Claims?.FirstOrDefault(x => x.Type ==ClaimTypes.Email)?.Value;
            //then, then in the AspNetUsers table, we will look up for the AspNetUser with that email using the help of the FindBtEmailAsync from the UserManager Service.
            var user = await _userManager.FindByEmailAsync(email);

            //then we will take out from that user, only what is defined in the UserDto template, and return it:
            return new UserDto //we can configure a mapping for that in Helper folder, MappingProfile class, and use it as we did in ProductsController !
            {
                Email = user.Email,
                Token = _tokenService.CreateToken(user),
                DisplayName = user.DisplayName
            };
        }
        




            //d-check if the entered Email while registering or ... already exists or no:
            //remember that email check if exists or no is done automatically by microsoft identity, and we said that in the above Register method,
            //but anyway, we may need to check that in multiple other places, so it is good to have such method.
            
            //the [FromQuery] means that teeling the method to extract the email from the https request sent, like https//:localhost:4200/api/account/emailExists?email=bob@test.com 
            //and it is not mandatory, but it is good to add !
            [HttpGet("emailexists")]
            public async Task<ActionResult<bool>> CheckEmailExistsAsync([FromQuery] string email)
            {
              return await _userManager.FindByEmailAsync(email) != null; 
              //in the AspNetUsers table, we will look up for the AspNetUser with that email using the help of the FindBtEmailAsync from the UserManager Service.
              //so "_userManager.FindByEmailAsync(email)" will return a User with his info.
              //we do not want to return that user, but we want to return "True" if a user was found with that Email (which means the email is already used),
              //and "false" if not !
              //so instead of using a conventional "if" expression, we can write the condition !=null directly, so if  "_userManager.FindByEmailAsync(email)" returns a user, return true.
            }






            //e-get the user's address info (remember in Core project, Entities/Identity folder, we designed the AppUser:IdentityUser to have an object of "Address")
            [Authorize] //for only logged in users 
            [HttpGet("address")]
            public async Task<ActionResult<AddressDto>> GetUserAddress()
            {
            //explanation about these below 2 lines is existed in the above method GetCurrentUser():
            var email = HttpContext.User?.Claims?.FirstOrDefault(x => x.Type == ClaimTypes.Email)?.Value;
            //then if we queried the AspNetUser by his email using:
            //       var user = await _userManager.FindByEmailAsync(email) ;
            //we will get "null" Address !! becuase we need to do an EagerLoading using "Include" to bring the Address with AspNetUser from the Address table ! (like how we did it with Products, ProductBrands, ProductTypes)
		    var user = await _userManager.Users.Include(x => x.Address).SingleOrDefaultAsync(x => x.Email == email);
            //_userManager.User will return an IQuerable list of the AspNetUsers table, then we can iclude the Address info for each user, then choose the user we want using his email !
            
            //then we will take out from that user Address, only what is defined in the AddressDto template, and return it:
            return  new AddressDto //we can configure a mapping for that in Helper folder, MappingProfile class, and use it as we did in ProductsController !
            {
                FirstName = user.Address.FirstName,
                LastName = user.Address.LastName,
                Street = user.Address.Street,
                City = user.Address.City,
                State = user.Address.State,
                Zipcode = user.Address.Zipcode
            };
            //indeed, AddresDto is very important here, because if we tried to return the complete "Address" as it is described in
            //core project, Entities/Identity folder, we will return with it the property "public AppUser AppUser { get; set; }"
            //which will make a loop !! because we are returning the user with user.address which will return user.address ... !!
            //watch video 177
        }



        //f-Update user's Address:
        //Note: it is also can be used to add Address info for a user (it is just like updateing null Address info into new info !)
        [Authorize] //for only logged in users 
        [HttpPut("address")] //updating data is an https put method !
        public async Task<ActionResult<AddressDto>> UpdateUserAddress(AddressDto addressdto)
        {
            //explanation about these below 2 lines is existed in the above method GetCurrentUser() and GetUserAddress():
            var email = HttpContext.User?.Claims?.FirstOrDefault(x => x.Type == ClaimTypes.Email)?.Value;
            var user = await _userManager.Users.Include(x => x.Address).SingleOrDefaultAsync(x => x.Email == email);
            
            //update the "user" Address:
            //Note above that we are receiving from the client angular side info which are described in AddressDto,
            //and, the AppUser uses "Address" model in core project, Entities/Identity folder,
            //so map the data from AddressDto to a new instant of Address:
            user.Address = new Address  //we can configure a mapping for that in Helper folder, MappingProfile class, and use it as we did in ProductsController !
            {
                FirstName = addressdto.FirstName, 
                LastName=addressdto.LastName,
                Street = addressdto.Street,
                City = addressdto.City,
                State = addressdto.State,
                Zipcode = addressdto.Zipcode
            };
            //submit the updates to the DB using the _usermanager and .UpdateAsync:
            var result = await _userManager.UpdateAsync(user);


            //then if the modifications succeeded, returns the same AddressDto that we recieved from the client angular app !
            if (result.Succeeded) return addressdto;
            //else, return:
            return BadRequest("Problem updating the user");
        }




        //g-
        //we can create methods to update email, displayname, password !!
    }
}




