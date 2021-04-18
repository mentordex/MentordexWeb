import { Injectable } from '@angular/core';
import { CanActivate } from '@angular/router';
import { Router, NavigationEnd } from '@angular/router';
//modules core services
import { AuthService } from '../../core/services'

@Injectable()
export class AuthGuard implements CanActivate {
  constructor(private router:Router) { 
      
  }
  canActivate() {
    if (localStorage.getItem("x-mentordex-auth-token")) {   
      this.router.events.subscribe((event) => {
        if (event instanceof NavigationEnd) {               
    
            if (localStorage.getItem("x-user-type")=="MENTOR" && event.url.includes('parent')) {
              this.router.navigate(['/']);
              return false;
            }else if(localStorage.getItem("x-user-type")=="PARENT" && event.url.includes('mentor')){
              this.router.navigate(['/parent/search']);
              return false;
            }
          
        }
      })
        // logged in so return true
        return true;
    }
  
      // not logged in so redirect to login page with the return url     
      localStorage.clear();
      //this.authService.isLoggedIn(false);
      this.router.navigate(['/authorization/login']);
      return false;
  }

}