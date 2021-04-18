import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { SharedModule } from '../../core/components/shared.module';
import { ParentsRoutingModule } from './parents-routing.module';
import { DashboardComponent } from './dashboard/dashboard.component';
import { SearchComponent } from './search/search.component';


@NgModule({
  declarations: [DashboardComponent, SearchComponent],
  imports: [
    CommonModule,
    ParentsRoutingModule,
    SharedModule
  ]
})
export class ParentsModule { }
