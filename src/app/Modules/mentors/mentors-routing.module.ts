import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { VerifyPhoneComponent } from './verify-phone/verify-phone.component';
import { VerifyEmailComponent } from './verify-email/verify-email.component';
import { VerificationSuccessComponent } from './verification-success/verification-success.component';
import { BasicDetailsComponent } from './basic-details/basic-details.component';
import { SkillsComponent } from './skills/skills.component';
import { BookASlotComponent } from './book-a-slot/book-a-slot.component';
import { ApplicationStatusComponent } from './application-status/application-status.component';
import { ProfileComponent } from './profile/profile.component';
import { PurchaseMembershipComponent } from './purchase-membership/purchase-membership.component';
import { PurchaseMembershipSuccessComponent } from './purchase-membership-success/purchase-membership-success.component';


import { AuthGuard } from '../../core/guards/auth-guard.service';

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
    path: 'basic-details',
    component: BasicDetailsComponent,
    data: { title: 'Basic Details' },
    canActivate: [AuthGuard]
  },
  {
    path: 'skills',
    component: SkillsComponent,
    data: { title: 'Skills' },
    canActivate: [AuthGuard]
  },
  {
    path: 'book-a-slot',
    component: BookASlotComponent,
    data: { title: 'Book a Slot' },
    canActivate: [AuthGuard]
  },
  {
    path: 'application-status',
    component: ApplicationStatusComponent,
    data: { title: 'Application Status' },
    canActivate: [AuthGuard]
  },
  {
    path: 'profile',
    component: ProfileComponent,
    data: { title: 'Profile' },
    canActivate: [AuthGuard]
  },
  {
    path: 'purchase-membership',
    component: PurchaseMembershipComponent,
    data: { title: 'Purchase Membership' },
    canActivate: [AuthGuard]
  },
  {
    path: 'purchase-membership-success',
    component: PurchaseMembershipSuccessComponent,
    data: { title: 'Purchase Membership Success' },
    canActivate: [AuthGuard]
  }

];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class MentorsRoutingModule { }
