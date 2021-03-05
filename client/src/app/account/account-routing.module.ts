import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, Routes } from '@angular/router';
import { LoginComponent } from './login/login.component';
import { RegisterComponent } from './register/register.component';


//the following array of routes are implemented and loaded in the belwo RouterModule in the imports part,
//this account-routing.module.ts has parent routes in app-routing.module.ts 
//we could wrote all the routes in app-routing.module.ts, but we want to implement the lazy loading concept, so account.module.ts is not loaded until we click on the button of login/register
//we identified the concept of angular lazyLoading in app-routing.module.ts in the comment there
//also read notes there related to this in app-routing.module.ts and shop-routing.module.ts 
const routes: Routes = [
  {path: 'login', component: LoginComponent},
  {path: 'register', component: RegisterComponent}
];

@NgModule({
  declarations: [],
  imports: [
    RouterModule.forChild(routes)
  ],
  exports: [RouterModule]
})
export class AccountRoutingModule { }
