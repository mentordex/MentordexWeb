import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { VerifyPhoneComponent } from './verify-phone/verify-phone.component';
import { VerifyEmailComponent } from './verify-email/verify-email.component';
import { VerificationSuccessComponent } from './verification-success/verification-success.component';
import { BasicDetailsComponent } from './basic-details/basic-details.component';
import { SkillsComponent } from './skills/skills.component';

const routes: Routes = [
  {
    path: 'verify-phone/:id',
    component: VerifyPhoneComponent,
    data: { title: 'Verify Phone' }
  },
  {
    path: 'verification-success/:id',
    component: VerificationSuccessComponent,
    data: { title: 'Verification Success' }
  },
  {
    path: 'verify-email/:id/:email_token',
    component: VerifyEmailComponent,
    data: { title: 'Verify Email' }
  },
  {
    path: 'basic-details/:id',
    component: BasicDetailsComponent,
    data: { title: 'Basic Details' }
  }

];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class MentorsRoutingModule { }
