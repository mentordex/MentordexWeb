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


@NgModule({
  declarations: [VerifyPhoneComponent, VerifyEmailComponent, VerificationSuccessComponent, BasicDetailsComponent, SkillsComponent, BookASlotComponent, ApplicationStatusComponent, ProfileComponent, PurchaseMembershipComponent, AddPaymentMethodComponent],
  imports: [
    CommonModule,
    MentorsRoutingModule,
    SharedModule
  ]
})
export class MentorsModule { }
