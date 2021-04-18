import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { DashboardComponent } from './dashboard/dashboard.component';
import { BillingMethodsComponent } from './billing-methods/billing-methods.component';
import { MentorProfileComponent } from './mentor-profile/mentor-profile.component';
import { BookingRequestComponent } from './booking-request/booking-request.component';
import { SearchComponent } from './search/search.component';

import { AuthGuard } from '../../core/guards/auth-guard.service';

const routes: Routes = [
  {
    path: 'dashboard',
    component: DashboardComponent,
    data: { title: 'Parent Dashboard' },
    canActivate: [AuthGuard]
  },
  {
    path: 'search',
    component: SearchComponent,
    data: { title: 'Search Mentors' },
    canActivate: [AuthGuard]
  },
  {
    path: 'payment-methods',
    component: BillingMethodsComponent,
    data: { title: 'Parent Saved Billings' },
    canActivate: [AuthGuard]
  },
  {
    path: 'profile-view/:id',
    component: MentorProfileComponent,
    data: { title: 'Mentor Profile' },
    canActivate: [AuthGuard]
  },
  {
    path: 'booking-request/:id',
    component: BookingRequestComponent,
    data: { title: 'Booking Request' },
    canActivate: [AuthGuard]
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class ParentsRoutingModule { }
