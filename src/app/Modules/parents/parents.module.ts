import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SharedModule } from '../../core/components/shared.module';
import { ParentsRoutingModule } from './parents-routing.module';
import { DashboardComponent } from './dashboard/dashboard.component';
import { AddPaymentMethodComponent } from './add-payment-method/add-payment-method.component';
import { BillingMethodsComponent } from './billing-methods/billing-methods.component';
import { MentorProfileComponent } from './mentor-profile/mentor-profile.component';
import { BookingRequestComponent } from './booking-request/booking-request.component';
import { SearchComponent } from './search/search.component';
import { NotificationsComponent } from './notifications/notifications.component';
import { MessagesComponent } from './messages/messages.component';


@NgModule({
  declarations: [DashboardComponent, AddPaymentMethodComponent, BillingMethodsComponent, MentorProfileComponent, BookingRequestComponent, SearchComponent, NotificationsComponent, MessagesComponent],
  imports: [
    CommonModule,
    ParentsRoutingModule,
    SharedModule
  ]
})
export class ParentsModule { }
