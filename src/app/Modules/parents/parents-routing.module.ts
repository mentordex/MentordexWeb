import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { DashboardComponent } from './dashboard/dashboard.component';
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
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class ParentsRoutingModule { }
