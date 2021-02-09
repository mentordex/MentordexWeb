import { Component, OnInit, NgZone } from '@angular/core';
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
  isHomePage: boolean = false
  isLoginPage: boolean = false
  isMentorPage: boolean = false
  isParentPage: boolean = false
  isLoggedin: boolean = false
  loginSubscription: Subscription;
  loginType: String = ''
  title = '';

  constructor(private zone: NgZone, private router: Router, private authService: AuthService, private utilsService: UtilsService) {

    //Check Logged In Status
    

      this.loginSubscription = this.authService.checkLoggedinStatus().subscribe((loginStatus) => {

        //console.log('loginStatus', loginStatus)

        if (localStorage.getItem(environment.TOKEN_NAME)) {

          this.loginType = localStorage.getItem('x-user-type');
          this.isLoggedin = true;

        } else {

          this.isLoggedin = false;

        }

        //console.log('loggedIn', this.isLoggedin)

      });
    



    this.loginSubscription = router.events.subscribe((event) => {

      //subscribe the route change and check user is loggedin or not
      if (event instanceof ActivationEnd) {

        if (localStorage.getItem(environment.TOKEN_NAME)) {
          this.loginType = localStorage.getItem('x-user-type')
          this.isLoggedin = true; // check 
          this.zone.run(() => {
            this.isHomePage = false
            this.isLoginPage = true
            this.isMentorPage = false
            this.isParentPage = false
          });
        } else {
          this.isLoggedin = false;
        }
      }


      //check the page url and change title/name on routed page
      if (event instanceof NavigationEnd) {

        if (event.url == '/' || event.url == '/home' || (event.url).includes('quick-links')) {
          //console.log('home');
          this.zone.run(() => {
            this.isHomePage = true
            this.isLoginPage = false
            this.isMentorPage = false
            this.isParentPage = false
          });

        } else if ((event.url).includes('mentor')) {

          this.zone.run(() => {
            this.isHomePage = false
            this.isLoginPage = false
            this.isMentorPage = true
            this.isParentPage = false
          });

          this.title = 'Mentor Login';

          if ((event.url).includes('verify-phone'))
            this.title = 'Verify Phone'

          if ((event.url).includes('verify-email'))
            this.title = 'Verify Email'

        } else if ((event.url).includes('parent')) {
          this.zone.run(() => {
            this.isHomePage = false
            this.isLoginPage = false
            this.isMentorPage = false
            this.isParentPage = true
          });
          this.title = 'Parent Login';

        } else if ((event.url).includes('authorization')) {

          this.zone.run(() => {
            this.isLoginPage = true
            this.isHomePage = false
            this.isMentorPage = false
            this.isParentPage = false
          });

          this.title = 'Login'
          if ((event.url).includes('login'))
            this.title = 'Login'

          if ((event.url).includes('forgot-password'))
            this.title = 'Forgot Password'

          if ((event.url).includes('signup'))
            this.title = 'Signup'

          if ((event.url).includes('reset-password'))
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

  logout() {
    Swal.fire({
      title: 'Are you sure?',
      text: '',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonText: 'Yes, logout me!',
      cancelButtonText: 'No, keep it'
    }).then((result) => {
      if (result.value) {
        this.loginType = ''
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
