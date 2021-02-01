import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { VerifyPhoneComponent } from './verify-phone/verify-phone.component';
import { VerifyEmailComponent } from './verify-email/verify-email.component';

const routes: Routes = [
  {
    path: 'verify-phone/:id',
    component: VerifyPhoneComponent,
    data: { title: 'Verify Phone' }
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class MentorsRoutingModule { }
