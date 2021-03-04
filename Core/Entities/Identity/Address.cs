namespace Core.Entities.Identity
{
    public class Address
    {
        //we can write above each property the data annotation [Requiered]
        //or any other Data Annotation we want like [MaxLenght()] or  ......
        //but for the Address model, we will do that on the Dto class level in API project, in Dtos folder
        //that is to avoid using libraries as dependencies in Core project !

        public int Id { get; set; }
        public string FirstName { get; set; }
        public string LastName { get; set; }
        public string Street { get; set; }
        public string City { get; set; }
        public string State { get; set; }
        public string Zipcode { get; set; }

        //continue the sql relation with the AppUser class:
        public string AppUserId { get; set; }
        public AppUser AppUser { get; set; }
    }
}