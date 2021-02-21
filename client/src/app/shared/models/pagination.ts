//import {IProduct} from './product'

export interface IPagination {
    pageIndex: number;
    pageSize: number;
    count: number;
    data: IProduct[]
}

//we have created an interface of one product model (IProduct in product.ts), let us create an interface for the complete paginated products list https response,
//remember how it was (it contains the "pageIndex": , "pageSize": , "count": , list of sorted/paginated products)
//so in the same folder (models) let us create an interface called IPagination in a file called pagination.ts/
//the data: IProduct[] means we have an array of "product" model.
