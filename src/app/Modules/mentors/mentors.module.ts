import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { SharedModule } from '../../core/components/shared.module';
import { MentorsRoutingModule } from './mentors-routing.module';
import { VerifyPhoneComponent } from './verify-phone/verify-phone.component';
import { VerifyEmailComponent } from './verify-email/verify-email.component';
import { VerificationSuccessComponent } from './verification-success/verification-success.component';
import { BasicDetailsComponent } from './basic-details/basic-details.component';
import { SkillsComponent } from './skills/skills.component';
import { BookASlotComponent } from './book-a-slot/book-a-slot.component';
import { ApplicationStatusComponent } from './application-status/application-status.component';
import { ProfileComponent } from './profile/profile.component';
import { PurchaseMembershipComponent } from './purchase-membership/purchase-membership.component';
import { AddPaymentMethodComponent } from './add-payment-method/add-payment-method.component';
import { PurchaseMembershipSuccessComponent } from './purchase-membership-success/purchase-membership-success.component';
import { DashboardComponent } from './dashboard/dashboard.component';
import { MyMembershipComponent } from './my-membership/my-membership.component';
import { MyMembershipPlanComponent } from './my-membership-plan/my-membership-plan.component';
import { BillingMethodsComponent } from './billing-methods/billing-methods.component';
import { AddPaymentMethodPopupComponent } from './add-payment-method-popup/add-payment-method-popup.component';
import { EditProfileComponent } from './edit-profile/edit-profile.component';
import { BookingRequestComponent } from './booking-request/booking-request.component';
import { UpdateBookingRequestComponent } from './update-booking-request/update-booking-request.component';
import { NotificationsComponent } from './notifications/notifications.component';
import { MessagesComponent } from './messages/messages.component';
import { ViewProfileComponent } from './view-profile/view-profile.component';
import { UpgradeMembershipComponent } from './upgrade-membership/upgrade-membership.component';
import { TransactionsComponent } from './transactions/transactions.component';
import { PaymentHistoryComponent } from './payment-history/payment-history.component';
import { JobsComponent } from './jobs/jobs.component';


@NgModule({
  declarations: [VerifyPhoneComponent, VerifyEmailComponent, VerificationSuccessComponent, BasicDetailsComponent, SkillsComponent, BookASlotComponent, ApplicationStatusComponent, ProfileComponent, PurchaseMembershipComponent, AddPaymentMethodComponent, PurchaseMembershipSuccessComponent, DashboardComponent, MyMembershipComponent, MyMembershipPlanComponent, BillingMethodsComponent, AddPaymentMethodPopupComponent, EditProfileComponent, BookingRequestComponent, UpdateBookingRequestComponent, NotificationsComponent, MessagesComponent, ViewProfileComponent, UpgradeMembershipComponent, TransactionsComponent, PaymentHistoryComponent, JobsComponent],
  imports: [
    CommonModule,
    MentorsRoutingModule,
    SharedModule
  ]
})
export class MentorsModule { }
