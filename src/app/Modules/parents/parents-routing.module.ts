import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { DashboardComponent } from './dashboard/dashboard.component';
import { BillingMethodsComponent } from './billing-methods/billing-methods.component';
import { MentorProfileComponent } from './mentor-profile/mentor-profile.component';
import { BookingRequestComponent } from './booking-request/booking-request.component';


const routes: Routes = [
  {
    path: 'dashboard',
    component: DashboardComponent,   
    data: { title: 'Parent Dashboard' }
  },
  {
    path: 'billings',
    component: BillingMethodsComponent,   
    data: { title: 'Parent Saved Billings' }
  },
  {
    path: 'mentor-profile/:id',
    component: MentorProfileComponent,   
    data: { title: 'Mentor Profile' }
  },
  {
    path: 'booking-request/:id',
    component: BookingRequestComponent,   
    data: { title: 'Booking Request' }
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class ParentsRoutingModule { }
