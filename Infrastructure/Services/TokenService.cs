using System;
using System.Collections.Generic;
using System.IdentityModel.Tokens.Jwt;
using System.Security.Claims;
using System.Text;
using Core.Entities.Identity;
using Core.Interfaces;
using Microsoft.Extensions.Configuration;
using Microsoft.IdentityModel.Tokens;


namespace Infrastructure.Services
{
    /*
    the interface ITokenService in core project has its implementation in Infrastructure project here,
    it is about creating a method to generate tokens to users once they login or register.
    it is used and injected in API project in AccountController.
    */
    public class TokenService : ITokenService
    {
        //1-properties:
        private readonly IConfiguration _config; 
        //using IConfiguration service, we can read the appSettings.Development.json file
        private readonly SymmetricSecurityKey _key; 
        //using SymmetricSecurity library, we can let the API project sign/correlate each token with a key, 
        //so that when the token is sent back from the user in an https request, API project will trust it because it is signed with its key.
        
        
        //2-constructor:
        //inject in it the above IConfiguration service,
        //for the SymmetricSecurityKey, we will use it as an instance of object.
        public TokenService(IConfiguration config)
        {
            _config = config;
            _key = new SymmetricSecurityKey(Encoding.UTF8.GetBytes(_config["Token:Key"]));
            //using SymmetricSecurity library, we can let the API project sign/correlate each token with a key, 
            //so that when the token is sent back from the user in an https request, API project will trust it because it is signed with its key.
            //get the key in appSettings.Development.json (or appSettings.json) in API project, Encode it using UTF8, then we will be having the _key which is a SymmetricSecurityKey.
            //then we can use this _key in signing tokens below !
        }

        //3-Constructor:
        //implement the method signature from ITokenService,
        //this method accepts a paramteter of type AppUser:IdentityUser (AspNetUser) (in core project, Entities/Identity folder).
        //then, using the AppUser info, the method will correlate and mix these info to generate a token and returns it as a string.
        public string CreateToken(AppUser user)
        {
            //to generate the "var token" below,we will mix an correlate multiple data:
            
            //1-use the passed user's info, like his Email and DisplayName to be mixed in the token,
            //do that by creating what we call it claims (it is not the AspNetRolesClaims ! it is something different !)
            var claims = new List<Claim>
            {
                new Claim(JwtRegisteredClaimNames.Email, user.Email),
                new Claim(JwtRegisteredClaimNames.GivenName, user.DisplayName)
            };

            //2-use a key to sign the token,
            //use a hashed version of the _key above we created inthe constructor which is a SymmetricSecurityKey,
            //for hashing we choosed the longest algorithm to da that:
            var creds = new SigningCredentials(_key, SecurityAlgorithms.HmacSha512Signature);

            //3-define an expiry date fo the token, so that the user is provided with another token when he logs in again
            var expiryDate = DateTime.Now.AddDays(7);

            //4-identify an official name for the API project as Tokens Issuer:
            //we write it in appSettings.Development.json (or appSettings.json) in API project
            var issuer = _config["Token:Issuer"];

            //4-now create a descriptor for the token, in which we will mix all the data above from 1 to 4: 
            var tokenDescriptor = new SecurityTokenDescriptor
            {
                Subject = new ClaimsIdentity(claims),
                Expires = expiryDate,
                SigningCredentials = creds,
                Issuer = issuer
            };

            //5-define the token handler which is going to mix the data in the descriptor to generate a token:
            //a famous handler is called JwtSecurity and we will use it:
            var tokenHandler = new JwtSecurityTokenHandler();

            //6-now generate the token using the jwt handler while passing to it the descriptor we created:
            var token = tokenHandler.CreateToken(tokenDescriptor);

            //now return this token as a string:
            return tokenHandler.WriteToken(token);
        }
    }
}