import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { SharedModule } from '../../core/components/shared.module';
import { MentorsRoutingModule } from './mentors-routing.module';
import { VerifyPhoneComponent } from './verify-phone/verify-phone.component';
import { VerifyEmailComponent } from './verify-email/verify-email.component';


@NgModule({
  declarations: [VerifyPhoneComponent, VerifyEmailComponent],
  imports: [
    CommonModule,
    MentorsRoutingModule,
    SharedModule
  ]
})
export class MentorsModule { }
