import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

//import page not found
import { PageNotFoundComponent } from './page-not-found/page-not-found.component';

//importing guards
import { AuthGuard } from './core/guards/auth-guard.service';

const routes: Routes = [
  {
    path: '',
    redirectTo: 'home',
    pathMatch: 'full'
  },  
  { 
    path: 'home', 
    loadChildren: () => import('./home/home.module').then(m => m.HomeModule) 
  },
  { 
    path: 'authorization', 
    loadChildren: () => import('./Modules/authorization/authorization.module').then(m => m.AuthorizationModule) 
  },
  { 
    path: 'mentor', 
    loadChildren: () => import('./Modules/mentors/mentors.module').then(m => m.MentorsModule) 
  },
  { 
    path: 'quick-links', 
    loadChildren: () => import('./Modules/quick-links/quick-links.module').then(m => m.QuickLinksModule) 
  },
  {
    path: '**',
    component: PageNotFoundComponent,   
    data: { title: 'Sorry!! Page Not Found.' }
  }
  
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
