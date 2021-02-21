import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';

//import the http client module to consume the APIs in the API project:
import { HttpClientModule } from '@angular/common/http';

import { CoreModule } from './core/core.module';
import { ShopModule } from './shop/shop.module';


@NgModule({
  declarations: [
    AppComponent,
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    BrowserAnimationsModule,

    //import the http client module to consume the APIs in the API project:
    //HttpClient is used for example in shop.service.ts
    HttpClientModule,

    //import core module, where we declared for example the NaavBar component
    CoreModule,

    //import the shope module:
    ShopModule
  ],
  providers: [],
  bootstrap: [AppComponent]
})

//type script class:
export class AppModule {}


