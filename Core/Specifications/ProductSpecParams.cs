namespace Core.Specifications
{
    //in the API folder, ProductController,
    //instead of writing GetProducts(string sort, int? brandId, int? typeId, int MaxPageSize, int PageIndex, int _PageSize, .....), we will write these parameters in this class ProductSpecParams 
    //then use that class as the parameter in this GetProducts(ProductSpecParams ProdParams) function
            
    public class ProductSpecParams
    {

        //1-sorting parameters:
        public string sort {get; set;}




        //2-filtering parameters:
        //the int? means that the int can be null and it is completely optional to pass avalue to it or no !
        //that because we may filter based on brand only or type only or both of them !
        public int? BrandId {get; set;}
        public int? TypeId {get; set;}
     




        //3-pagination parameters:
        //a-we will consider by default at the begininng that the page Index is 1 (the first one)
        public int PageIndex {get; set;} = 1;
   
        //b-we will consider the number of products returned within a page is 6 or ...
        //so _PageSize = PageSize
        //but will allow the client angular side to request more thatn that
        //but if requested more than the MaxPageSize, we will return only 50 products for a page
        private int _PageSize {get; set;} = 9;
        private const int MaxPageSize = 50;
        public int PageSize 
        {
            get => _PageSize;
            set => _PageSize = (value > MaxPageSize) ? MaxPageSize : value;
        }





        //4-search parameter:
        //add a backend parameter to lower its letters
        private string _serach;
        public string Search 
        {
            get => _serach;
            set => _serach = value.ToLower();
        }
    }
}