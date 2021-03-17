namespace Core.Entities
{
    public class Message : BaseEntity
    {

        //1-properties:

        //it has an Id (from the Baseentity)
        public string firstName { get; set; }
        public string lastName { get; set; }
        public string address { get; set; }
        public string email { get; set; }
        public string message { get; set; }

        //2-constructor with parameters;
        //used to pass values when instantiate this entity in MessageService:
        public Message(string firstName, string lastName, string address, string email, string message)
        {
            this.firstName = firstName;
            this.lastName = lastName;
            this.address = address;
            this.email = email;
            this.message = message;
        }

        //parameter-less constructor requiered for the job of EntityFramework:
        public Message()
        {
        }
    }


}