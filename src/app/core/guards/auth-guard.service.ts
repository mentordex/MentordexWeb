import { Injectable } from '@angular/core';
import { CanActivate, CanActivateChild } from '@angular/router';
import { Router } from "@angular/router";
//modules core services
import { AuthService } from '../../core/services'

@Injectable()
export class AuthGuard implements CanActivate, CanActivateChild {
    constructor(private router:Router) { 
        
    }
  canActivate() {
    if (localStorage.getItem("dexmentor-auth-token")) {
        // logged in so return true
        return true;
      }
  
      // not logged in so redirect to login page with the return url     
      localStorage.clear();
      //this.authService.isLoggedIn(false);
      this.router.navigate(['/authorization/login']);
      return false;
  }

  canActivateChild() {
    if (localStorage.getItem("dexmentor-auth-token")) {
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