import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { environment } from 'src/environments/environment';
import { IMessage } from '../shared/models/message';
import { map, take } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class ContactService 
{
  //1-properties:
  //baseurl in the appSettings.Development.json https://localhost:4200/api/
  baseUrl = environment.apiUrl;



  //2-constructor:
  constructor(private http: HttpClient, private router: Router) { }


  //3-methods:
  sendMessage(values: any) 
  {
    return this.http.post(this.baseUrl + 'message/sendmessage', values);
  }
}
