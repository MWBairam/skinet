//remember that the IAddress and IUser should match the UserDto and AddressDto in API project, Dtos folder 
//(remember that the data returned from the AccountController are those Dtos)

export interface IAddress {
    firstName: string;
    lastName: string;
    street: string;
    city: string;
    state: string;
    zipcode: string;
}
