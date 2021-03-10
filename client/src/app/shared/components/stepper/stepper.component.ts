import { Component, OnInit, Input } from '@angular/core';
import { CdkStepper } from '@angular/cdk/stepper';



@Component({
  selector: 'app-stepper',
  templateUrl: './stepper.component.html',
  styleUrls: ['./stepper.component.scss'],
  //add this providers array so we can extend (inherit) this component from the CdkStepper component as we did below: 
  providers: [{provide: CdkStepper, useExisting: StepperComponent}]
})

//we will use in the checkout.component.ts a stepper wizard so we can guide the user to add his data step by step,
//we will use the stepper from the installed CDK from angular repo,
//stepper package was imported/exported in shared.module.ts, and this component is exported in shared.module.ts as well
//so we can use use this in the checkout.component.ts 

//extend this class functionalities to cover the Cdk Stepper.
//extends in angular means inherit the component (like class1 : class2 in C#)
//and we need the providers array above in the @component decorator 

export class StepperComponent extends CdkStepper implements OnInit 
{
  //1-properties:
  //this is an input property, which means we will pass to it a value from a parent component (checkout.component.ts).
  //in this stepper, we can ask the user to fill in data, then move to the next step to fill another data.
  //we can prevent him from moving to the next step unless he complets the first step, orr allow that.
  //so we will pass true or false to this, then in below ngOnInit, we will send this value to the "linear" property came from CdkStepper inherited component.
  @Input() linearModeSelected: boolean;

  //no constructor is used or needed. any way, if we want to write a one, we should also inherit the one from CdkStepper.
  //I wrote a sample of that in the note file in this folder, becuase writing that in a comment caused a problem in vs code !!!!!!

  //3-methods:
  ngOnInit() 
  {
    //"linear" is a property property came from CdkStepper inherited component.
    //please read the note above the @Input property.    
    this.linear = this.linearModeSelected;
  }
  onClick(index: number) 
  {
    //selectedIndex is a property came from CdkStepper inherited component.
    //we will set its value to the passed "index" parameter, 
    //so we can update and keep tracking the step index
    this.selectedIndex = index; //and also by this way, we move to the step we clicked on (li we clicked on in the html) (for example we are in the "Address" step (tab), and we click on "Review" step (tab) so we move to it)
    //and log that to console so we can see that:
    console.log(this.selectedIndex);
  }

}