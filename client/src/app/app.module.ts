import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';

//import the http client module to consume the APIs in the API project:
import { HttpClientModule, HTTP_INTERCEPTORS } from '@angular/common/http';

import { CoreModule } from './core/core.module';
import { ShopModule } from './shop/shop.module';
import { HomeModule } from './home/home.module';
import { ErrorInterceptor } from './core/interceptors/error.interceptor';
import { NgxSpinner } from 'ngx-spinner/lib/ngx-spinner.enum';
import { NgxSpinnerModule } from 'ngx-spinner';
import { LoadingInterceptor } from './core/interceptors/loading.interceptor';


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





    //import oue src/app module:
    //import core module, where we declared for example the NaavBar component
    CoreModule,
    //import the Home module:
    HomeModule,
    //import the shope module:
    //ShopModule
    //but since we used the concept of routes lazy loading explained in app-routing.module.ts, no need to import this here


    //we want to display a loading indicator before displaying any result related to what the user requested:
    NgxSpinnerModule
    //remember that we delayed any http response for 1000 millisecond in the core folder -> interceptors -> loading.interceptor since this intercepts any response
    //and during this time will display the spinner !
    //and we used for that the busy.service.ts service in the app/core/services folder
    //and do not forget to add it below to the list of providers:

  ],
  //in the Provider array, add the Http Interceptor we created in the core folder -> error.interceptor.ts:
  //to read about HttpInterceptor, read the notes there !
  //indeed, angular as well has its own interceptor, so add it also
  //the add ours in useClass:
  //then say both of these to be used by saying multi is true 

  //also add the loading interceptor we spoke about above in the import section !
  providers: [
    {provide: HTTP_INTERCEPTORS, useClass: ErrorInterceptor, multi: true},
    {provide: HTTP_INTERCEPTORS, useClass: LoadingInterceptor, multi: true}
  ],


  bootstrap: [AppComponent]
})

//type script class:
export class AppModule {}


