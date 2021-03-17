import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { IMessage } from '../shared/models/message';
import { ContactService } from './contact.service';

@Component({
  selector: 'app-contact',
  templateUrl: './contact.component.html',
  styleUrls: ['./contact.component.scss']
})

//we will use here and in the html file the Reactive angular form to collect data from the contact html page.
//I will not explain anything here, it is jist how we did it in register.component.ts/html 
//and widder explanation in login.component.ts/html 

export class ContactComponent implements OnInit 
{
  //1-properties:
  messageForm: FormGroup;
  buttonIsDisabled = false;

  //2-constructor:
  constructor(private fb: FormBuilder, private contactService: ContactService, private router: Router, private toastr: ToastrService) { }

  //3-methods:
  //a-lifecycle methods:
  ngOnInit() 
  {
    this.createMessageForm();
  }
  //b-message methods:
  createMessageForm()
  {
    this.messageForm = this.fb.group
    (
      {
      firstName: [null, [Validators.required]],
      lastName: [null, [Validators.required]],
      address: [null, [Validators.required]],
      email: [null,[Validators.required, Validators.pattern('^[\\w-\\.]+@([\\w-]+\\.)+[\\w-]{2,4}$')]],
      message: [null, [Validators.required]]
      }
    );
  }
  onSubmit() 
  {
    this.buttonIsDisabled = true;
    this.contactService.sendMessage(this.messageForm.value)
    .subscribe
    (
      (response: IMessage)  => 
      {
        this.toastr.success('Message has been sent successflly. We will reply to '+ response.email + ' as soon as possible.');
        this.router.navigateByUrl('/');
        this.buttonIsDisabled = false;
      
      }, 
        error => {console.log(error);}
    );
  }

}
