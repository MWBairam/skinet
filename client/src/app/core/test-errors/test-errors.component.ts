import { HttpClient } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { environment } from 'src/environments/environment';

@Component({
  selector: 'app-test-errors',
  templateUrl: './test-errors.component.html',
  styleUrls: ['./test-errors.component.scss']
})

//this class is to test the Errors we designed to be returned in the API project, Errors and MiddleWare folders !

export class TestErrorsComponent implements OnInit
 {

  //1-properties:
  //bring the url from the environments folder ->environment.ts (environmetn.prod.ts for production)
  baseUrl = environment.apiUrl; //https://localhost:5001/api/
  //use this for testing the validation error 400 (last function below)
  validationErrors: any;


  //2-constructor:
  //we will inject the HttpClient directly in here, so below we can use to do https requests to get errors from the API project BuggyController !
  //we will not use a service like test-errors.service.ts then inject it here then ue its mehtods !
  //we will use HttpClient directly here
  constructor(private http: HttpClient) { }



  //3-methods:
  //a-lifecycle methods:
  ngOnInit() {
  }
  //b-methods to send https reuests to get errors from the API project BuggyController:
  get404Error()
  {
    //go and get from BuggyController, getNotFound method (call it using /notfound) which looks for a product with Id=1000 which we know it does not exists !!
    this.http.get(this.baseUrl + 'buggy/notfound')
    .subscribe
    (
      response => {console.log(response);},
      error => {console.log(error);}
    );
  }


  get500Error()
  {
    //go and get from BuggyController a the flatned server error we designed there
    this.http.get(this.baseUrl + 'buggy/servererror')
    .subscribe
    (
      response => {console.log(response);},
      error => {console.log(error);}
    );
  }

  get400Error()
  {
    //go and get from BuggyController a flatned bad request error we designed there
    this.http.get(this.baseUrl + 'buggy/badrequest')
    .subscribe
    (
      response => {console.log(response);},
      error => {console.log(error);}
    );
  }

  get400ValidationError()
  {
    //go and get from ProductsController a flatned validation-based 404 error we designed there
    //that happens while passing a string instead of a number to an integer variable:
    this.http.get(this.baseUrl + 'products/fortytwo')
    .subscribe
    (
      response => {console.log(response);},
      //for the validation-based errors, we return with the "error" part we designed, an array of the validations happened, and we called it also errors !
      //look at the picture in the course folder section 11 !
      //to test it, in the test-error.component.ts, getget400ValidatioError(), we logged the the validation array (errors) in the test-errors.component.ts to the conole, and displayed it in test-errors.component.ts without redirecting it (using a routerLink route to any other page when we click on the test button of validatio error there)
      //for real life, we throw this errors arry using the error.interceptor.ts in interceptors folder 
      error => {console.log(error); this.validationErrors=error.errors}
    );
  }



    //there is another error 401 happens when the user is not logged in,
    //while the method has [Authorize] which requiers him to be logged in
    //but we did not write anything for it in the BuggyController !

}
