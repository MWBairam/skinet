namespace API.Dtos
{
    public class MessageDto
    {
        //it is the same as "Mesasge" entity, but without the Id.
        public string firstName { get; set; }
        public string lastName { get; set; }
        public string address { get; set; }
        public string email { get; set; }
        public string message { get; set; }
    }
}