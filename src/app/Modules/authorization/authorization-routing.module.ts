import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { LoginComponent } from './login/login.component';
import { SignupComponent } from './signup/signup.component';
import { ForgotPasswordComponent } from './forgot-password/forgot-password.component';
import { ResetPasswordComponent } from './reset-password/reset-password.component';

const routes: Routes = [  
  {
    path: '',
    component: LoginComponent,   
    data: { title: 'Login' }
  },
  {
    path: 'login',
    component: LoginComponent,   
    data: { title: 'Login' }
  },
  {
    path: 'signup',
    component: SignupComponent,   
    data: { title: 'Signup' }
  },
  {
    path: 'forgot-password',
    component: ForgotPasswordComponent,   
    data: { title: 'Forgot password' }
  },
  {
    path: 'reset-password/:token',
    component: ResetPasswordComponent,   
    data: { title: 'Reset Password' }
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class AuthorizationRoutingModule { }
