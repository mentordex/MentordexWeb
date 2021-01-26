import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SharedModule } from '../../core/components/shared.module';

import { QuickLinksRoutingModule } from './quick-links-routing.module';
import { ResourceComponent } from './resource/resource.component';
import { CategoriesComponent } from './categories/categories.component';
import { FaqComponent } from './faq/faq.component';
import { HowItWorksParentsComponent } from './how-it-works-parents/how-it-works-parents.component';
import { HowItWorksMentorsComponent } from './how-it-works-mentors/how-it-works-mentors.component';
import { AboutUsComponent } from './about-us/about-us.component';
import { TeamComponent } from './team/team.component';
import { CareerComponent } from './career/career.component';
import { ContactUsComponent } from './contact-us/contact-us.component';
import { BlogsComponent } from './blogs/blogs.component';
import { BlogDetailComponent } from './blog-detail/blog-detail.component';


@NgModule({
  declarations: [ResourceComponent, CategoriesComponent, FaqComponent, HowItWorksParentsComponent, HowItWorksMentorsComponent, AboutUsComponent, TeamComponent, CareerComponent, ContactUsComponent, BlogsComponent, BlogDetailComponent],
  imports: [
    CommonModule,
    QuickLinksRoutingModule,
    SharedModule
  ]
})
export class QuickLinksModule { }
