import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';

@Component({
  selector: 'app-pager',
  templateUrl: './pager.component.html',
  styleUrls: ['./pager.component.scss']
})
export class PagerComponent implements OnInit 
{

  //1-properties:
  //those data will get values from properties in a parent component (shop.component.ts) in shop folder:
  @Input() totalCount: number;
  @Input() pageSize: number;
  //now we will use an @Output parameters:
  //the @Input parameter will receive data from parent shop.component.html
  //the @Output parameter will Emitt an output from this child component to the parent one shop.component.ts/.hmtl
  //in particular, sending a value to the method onPageChanged in the shop.component.ts:
  @Output() pageChanged = new EventEmitter<number>();
  //be carefull to the library of the EventEmitter, it is from angular/core not from any other library !!
  //it is generic, so we should specific the data type it will handle, which is simply number
  
  
  //2-constructor:
  constructor() { }


  //3-methods:
  //a-lifecycle methods:
  ngOnInit() {
  }
  //b-method will be used in pager.component.html to sense page change event:
  onPagerchange(event: any)
  {
      this.pageChanged.emit(event);
      //we do not write here .emit(event.page) like in onPageChanged in shop.component.ts 
      //but we use it without .page
  }

}
