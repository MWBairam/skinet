namespace Core.Entities.OrderAggregate
{
    public class Address
    {
        /*
        you might ask that we have "Address" model in Identity folder ! so why we do not use it ?
        "Address" model there is sql-related to AppUser there, also it is indeed physically separated from this model since
        it is in the AppIdentityDbContext, and this model is in StoreContext. 

        anyway, we will take most of the properties from there to be in here.
        */

        //1-properties:

        //we do not have an Id, because this "Address" and "Order" are not sql-relational DBs,
        //the Address is going to be a property inside the Order, implemnted as a column, directly existed in the same row ! 
        //and we will configure that in Data/config folder in OrderConfiguration for aggregating this object as a property in Order model
        
        public string FirstName { get; set; }
        public string LastName { get; set; }
        public string Street { get; set; }
        public string City { get; set; }
        public string State { get; set; }
        public string Zipcode { get; set; }

        //2-constructor:
        //constructor with parameters so when we create an instance of this class, we can pass values to the constructor to set the above properties:
        public Address(string firstName, string lastName, string street, string city, string state, string zipcode)
        {
            FirstName = firstName;
            LastName = lastName;
            Street = street;
            City = city;
            State = state;
            Zipcode = zipcode;
        }

        //since we got a constructor with parameters, we need to write the parameter-less constructor,
        //otherwise EntityFramework will complain and produce errors:
        public Address()
        {
        }
    }
}