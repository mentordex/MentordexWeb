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
  private onDestroy$: Subject<void> = new Subject<void>();
  isHomePage: boolean = false
  isLoginPage: boolean = false
  isMentorPage: boolean = false
  isParentPage: boolean = false
  isLoggedin: boolean = false
  loginSubscription: Subscription;
  loginType: String = ''
  userUrl: String = ''
  jobUrl: String = ''
  title = '';
  userInfo;
  getMentorSubscriptionStatus: String = 'IN-ACTIVE';

  getNotificationDetails: any = []
  getFiveNotificationDetails: any = []

  profileImagePath: any = 'assets/img/none.png';

  constructor(private zone: NgZone, private router: Router, private authService: AuthService, private utilsService: UtilsService) {

    this.loginSubscription = router.events.subscribe((event) => {

      //subscribe the route change and check user is loggedin or not
      if (event instanceof ActivationEnd) {

        if (localStorage.getItem(environment.TOKEN_NAME)) {
          this.loginType = localStorage.getItem('x-user-type')
          this.fetchUserInfo(localStorage.getItem('x-user-ID'))
          this.getNotifications(localStorage.getItem('x-user-ID'))
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

        if (localStorage.getItem(environment.TOKEN_NAME)) {

          if (localStorage.getItem("x-user-type") == "MENTOR" && event.url.includes('parent')) {
            this.router.navigate(['/']);
            return false;
          } else if (localStorage.getItem("x-user-type") == "PARENT" && event.url.includes('mentor')) {
            this.router.navigate(['/parent/search']);
            return false;
          }
        }


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

          if ((event.url).includes('forgot-password')) {
            this.zone.run(() => {
              this.isLoginPage = false
            });
            this.title = 'Forgot Password'
          }


          if ((event.url).includes('signup'))
            this.title = 'Signup'

          if ((event.url).includes('reset-password'))
            this.title = 'Reset Password'
        }

      }

    });
  }

  fetchUserInfo(userID) {
    this.utilsService.processPostRequest('getUserDetails', { userID: userID }, true).pipe(takeUntil(this.onDestroy$)).subscribe((response) => {
      this.userInfo = response;
      //console.log(this.userInfo);
      if (localStorage.getItem("x-user-type") == "MENTOR") {
        this.getMentorSubscriptionStatus = this.userInfo.subscription_status;
        //console.log(this.getMentorSubscriptionStatus);
      }

      if (this.userInfo.profile_image.length > 0) {
        this.profileImagePath = this.userInfo.profile_image[0].file_path;
      }

      //console.log(this.userInfo);
    })
  }


  ngOnInit() {
    //check user is loggedin or not on page refresh
    if (localStorage.getItem(environment.TOKEN_NAME)) {
      this.isLoggedin = true;
      this.fetchUserInfo(localStorage.getItem('x-user-ID'))
      this.getNotifications(localStorage.getItem('x-user-ID'))
    }
  }

  /**
   * get Mentor Notifications By Token
  */
  getNotifications(id): void {
    this.utilsService.processPostRequest('notifications/getNotifications', { userID: id }, true).pipe(takeUntil(this.onDestroy$)).subscribe((response) => {
      this.getNotificationDetails = response;
      if (this.getNotificationDetails.length > 0) {
        this.getNotificationDetails.forEach((element, index, notificationArray) => {
          if ('profile_image' in element.user && element.user.profile_image.length > 0) {
            this.profileImagePath = element.user.profile_image[0].file_path;
            notificationArray[index]['profileImagePath'] = this.profileImagePath;
          } else {
            notificationArray[index]['profileImagePath'] = this.profileImagePath;
          }
          
          if(this.loginType == 'PARENT'){
            this.userUrl = 'parent';
            this.jobUrl = 'job';
          }else{
            this.userUrl = 'mentor';
            this.jobUrl = 'booking-request';
          }

          if(element.notification_type == 'BOOKING'){
            notificationArray[index]['redirectUrl'] = '/'+ this.userUrl +'/'+ this.jobUrl +'/'+element.job_id;
          }else if(element.notification_type == 'MESSAGE'){
            notificationArray[index]['redirectUrl'] = '/'+ this.userUrl +'/messages/'+element.job_id;
          }else if(element.notification_type == 'SUBSCRIPTION'){
            notificationArray[index]['redirectUrl'] = '/'+ this.userUrl +'/payment-history';
          }else{
            notificationArray[index]['redirectUrl'] = 'javascript:void(0)';
          }

        });

        this.getFiveNotificationDetails = this.getNotificationDetails.slice(0,5);
      }
      //console.log(this.getFiveNotificationDetails);
    })
  }

  logout() {
    Swal.fire({
      title: 'Are you sure you want to log out?',
      text: '',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonText: 'Yes',
      cancelButtonText: 'No'
    }).then((result) => {
      if (result.value) {
        this.loginType = ''
        this.utilsService.logout()

      }
    })
  }

  ngOnDestroy() {
    this.onDestroy$.next();
    // Unsubscribe from the subject
    this.onDestroy$.unsubscribe();
    if (this.loginSubscription) {
      this.loginSubscription.unsubscribe();
    }
  }


}
