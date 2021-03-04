namespace API.Dtos
{
    public class UserDto
    {
        /*
        and since we want to ask the user to type hiss email and password only,
        so, we will send to this API controller these data only,
        and we want to return these data back to angular frontend (so we can display them),
        so create UserDto and LoginDto to specify the fields you want to be sent/returned for a user (so not all AppUser fileds are used in the login process)
        */

        public string Email { get; set; }
        public string DisplayName { get; set; }
        public string Token { get; set; }
    }
}