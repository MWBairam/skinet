import { Component, Input, OnInit } from '@angular/core';

@Component({
  selector: 'app-paging-header',
  templateUrl: './paging-header.component.html',
  styleUrls: ['./paging-header.component.scss']
})
export class PagingHeaderComponent implements OnInit 
{
  //1-properties:
  //those data will get values from properties in a parent component (shop.component.ts) in shop folder 
  @Input() pageNumber: number;
  @Input() pageSize: number;
  @Input() totalCount: number;
  

  //constructor:
  constructor() { }
 

  //methods:
  ngOnInit() {
  }

}
