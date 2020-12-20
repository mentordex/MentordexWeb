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
