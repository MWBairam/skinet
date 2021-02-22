import { Component, Input, OnInit } from '@angular/core';

@Component({
  selector: 'app-product-item',
  templateUrl: './product-item.component.html',
  styleUrls: ['./product-item.component.scss']
})
export class ProductItemComponent implements OnInit 
{

  //1-properties:
  //the following is an input property decorated with @, 
  //and it allow us to use this property in product-item.component.html:
  @Input() product: IProduct; 
  //the type of this property is IProduct model from the models folder in the shared folder


  //2-constructor:
  constructor() { }


  //3-methods:
  //a-lifecycle methods:
  ngOnInit() {
  }

}
