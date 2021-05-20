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
import { MyMembershipPlanComponent } from './my-membership-plan/my-membership-plan.component';
import { BillingMethodsComponent } from './billing-methods/billing-methods.component';
import { EditProfileComponent } from './edit-profile/edit-profile.component';
import { DashboardComponent } from './dashboard/dashboard.component';
import { BookingRequestComponent } from './booking-request/booking-request.component';
import { NotificationsComponent } from './notifications/notifications.component';
import { MessagesComponent } from './messages/messages.component';


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
  },
  {
    path: 'my-membership-plan',
    component: MyMembershipPlanComponent,
    data: { title: 'My Membership Plan' },
    canActivate: [AuthGuard]
  },
  {
    path: 'dashboard',
    component: DashboardComponent,
    data: { title: 'My Dashboard' },
    canActivate: [AuthGuard]
  },
  {
    path: 'billing-methods',
    component: BillingMethodsComponent,
    data: { title: 'My Billing Method' },
    canActivate: [AuthGuard]
  },
  {
    path: 'edit-profile',
    component: EditProfileComponent,
    data: { title: 'Edit Profile' },
    canActivate: [AuthGuard]
  },
  {
    path: 'booking-request/:id',
    component: BookingRequestComponent,
    data: { title: 'Booking Request' },
    canActivate: [AuthGuard]
  },
  {
    path: 'notifications',
    component: NotificationsComponent,
    data: { title: 'Notifications' },
    canActivate: [AuthGuard]
  },
  {
    path: 'messages',
    component: MessagesComponent,
    data: { title: 'Messages' },
    canActivate: [AuthGuard]
  }

];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class MentorsRoutingModule { }
