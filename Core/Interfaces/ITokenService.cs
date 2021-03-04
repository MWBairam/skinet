using Core.Entities.Identity;

namespace Core.Interfaces
{
    /*
    this interface here (and its implementation in Infrastructure project) is to create a method to generate tokens to users
    once they login or register.
    it is used and injected in API project in AccountController.
    */
    public interface ITokenService
    {
        //write the method signature here (and its implementation in Infrastructure project)
        //we can write "public" access modifier before "string CreateToken(AppUser suer)", bu no need !
        //this method accepts a paramteter of type AppUser:IdentityUser (AspNetUser) (in core project, Entities/Identity folder).
        //then, using the AppUser info, the method will correlate and mix these info to generate a token and returns it as a string.
         string CreateToken(AppUser user);
    }
}