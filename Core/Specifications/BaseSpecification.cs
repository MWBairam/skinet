using System;
using System.Collections.Generic;
using System.Linq.Expressions;

namespace Core.Specifications
{
    public class BaseSpecification<T> : ISpecification<T>
    {




        //since the ISpecification interface has only attributes, the Implementation of it is as well {get; } for these attributes
        //the extra step here, is just we need to initialize our List below as a new list as we do usually with lists and arrays
        public Expression<Func<T, bool>> Criteria {get;}
        public List<Expression<Func<T, object>>> Includes {get;} = new List<Expression<Func<T, object>>>();










        //we need also, not only to {get;} the value of the Criteria, but also to {set;} it.
        //we can do that by writing above {get; set;} besides Criteria, but to set a value from another class, we will have to do BaseSpecification.Criteria = and we should write "Public" before Criteria as well
        //we will set its value using a constructor for this class, so when we call this class, we pass the value of the Criteria with it:
        public BaseSpecification(Expression<Func<T, bool>> spec_criteria)
        {
            Criteria = spec_criteria;
        }
        //also the same way for the "Includes" list of expressions, we need to fill this list with some lambda expressions,
        //we can use as well {get; set;}, but this will make us write the below function out of this class in everywhere we want to set this list, and the same issue we explained for setting "Criteria" the same way
        //we will create a function to add expressions to this list of expressions:
        //protected function means can be accessed from this class and classes that inherits this class only
        //it accepts a lambda expression as a parameter, then add it to the above list:
        protected void AddInclude(Expression<Func<T, object>> includeExpression)
        {
            Includes.Add(includeExpression);
        }










        //now the last thing to talk about is generating a parameter-less constructor here (default constructor)
        //usually no need for it, but since we generated a constructor-with-parameters,
        //and since the ProductWithTypesAndBrandsSpecification class inherits this class 
        //we should generate the parameter-less constructor
        public BaseSpecification()
        {

        }
    }
}