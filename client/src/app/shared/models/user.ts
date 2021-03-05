//remember that the IAddress and IUser should match the UserDto and AddressDto in API project, Dtos folder 
//(remember that the data returned from the AccountController are those Dtos)

export interface IUser {
    email: string;
    displayName: string;
    token: string;
}
