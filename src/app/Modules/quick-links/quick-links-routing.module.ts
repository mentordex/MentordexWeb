import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { ResourceComponent } from './resource/resource.component';
import { CategoriesComponent } from './categories/categories.component';
import { FaqComponent } from './faq/faq.component';
import { HowItWorksParentsComponent } from './how-it-works-parents/how-it-works-parents.component';
import { HowItWorksMentorsComponent } from './how-it-works-mentors/how-it-works-mentors.component';
import { AboutUsComponent } from './about-us/about-us.component';
import { TeamComponent } from './team/team.component';
import { CareerComponent } from './career/career.component';
import { ContactUsComponent } from './contact-us/contact-us.component';

const routes: Routes = [  
  {
    path: 'FAQs',
    component: FaqComponent,   
    data: { title: 'FAQs' }
  },
  {
    path: 'about-us',
    component: AboutUsComponent,   
    data: { title: 'About Us' }
  },
  {
    path: 'contact-us',
    component: ContactUsComponent,   
    data: { title: 'Contact Us' }
  },
  {
    path: 'our-team',
    component: TeamComponent,   
    data: { title: 'Our Team' }
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class QuickLinksRoutingModule { }
