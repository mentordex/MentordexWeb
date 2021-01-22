import { Component, OnInit  } from '@angular/core';
import { ActivatedRoute, ActivationEnd, ActivationStart, Router, RouterEvent, NavigationEnd } from "@angular/router";
import { Subscription } from 'rxjs/Subscription';
import { takeUntil } from 'rxjs/operators';
import { Subject } from 'rxjs';

//import services
import { AuthService, UtilsService } from '../../../core/services';

//import enviornment
import { environment } from '../../../../environments/environment';

//import jquery and sweet alert plugin
declare var $;
import Swal from 'sweetalert2'

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.css']
})
export class HeaderComponent implements OnInit {

  destroy$: Subject<boolean> = new Subject<boolean>();
  isHomePage:boolean =false
  isLoginPage:boolean =false
  isLoggedin:boolean = false
  loginSubscription
  title='';
  constructor(private router:Router, private utilsService:UtilsService) { 

    
    this.loginSubscription =  router.events.subscribe((event) => {
     
      //subscribe the route change and check user is loggedin or not
      if (event instanceof ActivationEnd) {
       
        if (localStorage.getItem(environment.TOKEN_NAME)) {
        
          this.isLoggedin = true;          
        }else{
          this.isLoggedin = false;
        }
      }
      

      //check the page url and change title/name on routed page
      if (event instanceof NavigationEnd ) {
        //this.currentUrl = event.url;
        
        if(event.url =='/' || event.url =='/home' || (event.url).includes('quick-links')){
          this.isHomePage = true
        
        }else if((event.url).includes('authorization')){
         
          this.isLoginPage = true
          this.title = 'Login'
          if((event.url).includes('login'))
            this.title = 'Login'
          
          if((event.url).includes('forgot-password'))
            this.title = 'Forgot Password'

          if((event.url).includes('signup'))  
            this.title = 'Signup'

          if((event.url).includes('reset-password'))  
            this.title = 'Reset Password'
        }
      }  
        
    });   
  }

  ngOnInit() {
    //check user is loggedin or not on page refresh
    if (localStorage.getItem(environment.TOKEN_NAME)) {
      this.isLoggedin = true;       
    }      
  } 
  
  logout(){
    Swal.fire({
      title: 'Are you sure?',
      text: 'Your session will be end and redirect to home page!',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonText: 'Yes, logout me!',
      cancelButtonText: 'No, keep it'
    }).then((result) => {
      if (result.value) {        
        this.utilsService.logout()       
      
      }
    })
  }

  ngOnDestroy() {
    this.destroy$.next(true);
    // Unsubscribe from the subject
    this.destroy$.unsubscribe();
    if (this.loginSubscription) {  
      this.loginSubscription.unsubscribe();
    }    
  }


}
