namespace Core.Entities
{
    public class BaseEntity
    {
        public int Id { get; set; }

        //all other entities wil inherit this class
        //it is not only writing the Id in here only and not riting it again in the other entities, 
        //this is useful when we use the concept of Generics ! as we will see later in the Interfaces\IGenericRepository
        
    }
}