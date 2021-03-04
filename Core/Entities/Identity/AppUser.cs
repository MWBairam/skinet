using Microsoft.AspNetCore.Identity;

namespace Core.Entities.Identity
{
    //we could have depended on IdentityUser only, but we need to expand the user info to contain new info.
    //so we created the class AppUser which contains DisplayName, Address. 
    //and inherited all the properties in IdentityUser.
    //IdentityUser has: a string Id for the user, userName (where microsoft stores email by default) PasswordHash (where the hashed password is stored), and .....
    public class AppUser : IdentityUser //the users table name in DB will remain AspNetUsers !
    {
        //IdentityUser has: 
        //a string Id for the user, 
        //userName (which is the same value to Email by default) 
        //Email
        //PasswordHash (where the hashed password is stored), 
        //and .....

        //in addition to what is existed in IdentityUser, add these also:
        public string DisplayName {get; set;}
        public Address Address {get; set;}  //it is an object of the class Address, and the AppUser has only one Address object for simplicity.
        //we will create out of AppUser class, the AppUsers table in sql,
        //we will create out of Address class, the Addresses table in sql,
        //the parent table is AppUsers, the child is Addresses,
        //so in Address class, continue the EntityFrameWork sql relation !
    }
}