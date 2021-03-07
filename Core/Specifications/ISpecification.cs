using System;
using System.Collections.Generic;
using System.Linq.Expressions;

namespace Core.Specifications
{
    //this is an interface.
    //its implementation is in the same folder in BaseSpecificatio.cd
    
    //let the interface to accept a type (template) <T>
    public interface ISpecification<T>
    {
         //Attributes:
         //create 2 attributes
         //1-first one name is Criteria, and it is not string or int or .... but it is an Expression (lambda expression)
         //an expression is a Func which takes  a type (template) <T> and returns a bool
         //an example of a value for this attribute "Criteria" (taking the Product Entity as an example replacing the <T>): .where(p => p.Id) 
         //but indeed here the Criteria value is p => p.Id, and later on we will use the .where() in the SpecificationEvaluation class in the Data folder in Infrastructure project
         //2-second one name is Includes, and it is a list of Expressions (lambda expression)
         //an expression is a Func which takes a type (template) <T> and returns an object of the Entity will be instead of <T> (an object is the most generic (general) thing in C#)
         //an example of a value for this attribute "Includes", taking the Product Entity as an example replacing the <T>: .Include(p => p.ProductType) with .Include( p => p.ProductBrand)
         //also, the list will store the expressions p => p.ProductType   and   p => p.ProductBrand, and later on we will use the .Include() in the SpecificationEvaluation class in the Data folder in Infrastructure project

         Expression<Func<T, bool>> Criteria {get; }
         List<Expression<Func<T, object>>> Includes {get; }






         //also, another set of attributes used for "Products" sorting when we bring the list of products from the DB:
         Expression<Func<T, object>> OrderBy {get; }
         Expression<Func<T, object>> OrderByDescending {get; }




         //also, another set of attributes used for "Products" pagination:
         int Take {get;}
         int Skip {get;}
         bool IsPagingEnabled {get;}
         //so if we have 10 products in the DB, and we want to get these paginated, we set IsPagingaEnabled = true
         //then, if we want to get the first 5 products in a page, we take=5 and skip=null 
         //then to get the next 5 products, take=5 and skip=5 (skip first 5 products)

     }
}