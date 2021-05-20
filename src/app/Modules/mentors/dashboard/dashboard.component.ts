import { Component, OnInit, OnDestroy, ViewChild, NgZone } from '@angular/core';
import { FormBuilder, FormGroup, Validators, ValidatorFn, ValidationErrors, FormControl, FormArray, AbstractControl } from '@angular/forms';
import { DomSanitizer } from '@angular/platform-browser';
import { Router, ActivatedRoute } from "@angular/router";
import { takeUntil } from 'rxjs/operators';
import { Subject } from 'rxjs';

// import fade in animation
import { fadeInAnimation } from '../../../core/animations';
import { AuthService, UtilsService } from '../../../core/services';

//import enviornment
import { environment } from '../../../../environments/environment';

//import custom validators
import { CustomValidators } from '../../../core/custom-validators';

declare var $;

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.css']
})
export class DashboardComponent implements OnInit {

  private onDestroy$: Subject<void> = new Subject<void>();
  id: any = '';
  mentorId: any = '';
  mentorProfileDetails: any = {};
  getNotificationDetails: any = {}
  profileImagePath: any = 'assets/img/none.png';
  getVideoLink: any = '';
  getVideoType: any = '';

  minDate: Date;
  maxDate: Date;
  getCurrentDay: any = '';
  getCurrentDate: any = '';
  getSelectedDate: any = '';

  getAvailableSlots: any = [];
  selectedAvailabilityArray: any = [];


  constructor(private zone: NgZone, private formBuilder: FormBuilder, private authService: AuthService, private utilsService: UtilsService, private router: Router, private activatedRoute: ActivatedRoute, private dom: DomSanitizer) {
    this.minDate = new Date();
    this.maxDate = new Date();
    this.minDate.setDate(this.minDate.getDate());
    this.getCurrentDay = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"][new Date().getDay()]
    this.getCurrentDate = this.minDate.getDate() + '/' + (this.minDate.getMonth() + 1) + '/' + this.minDate.getFullYear();
    this.getSelectedDate = this.getCurrentDate;
    //console.log(this.getSelectedDate);
  }

  ngOnInit(): void {
    this.checkQueryParam();
  }

  private checkQueryParam() {
    this.id = localStorage.getItem('x-user-ID');

    this.zone.run(() => {
      this.getMentorProfileDetailsById(this.id);
      this.getNotifications(this.id);
    });

  }

  /**
   * get Mentor Details By Token
  */
  getMentorProfileDetailsById(id): void {
    this.utilsService.processPostRequest('getMentorProfileDetails', { userID: id }, true).pipe(takeUntil(this.onDestroy$)).subscribe((response) => {
      this.mentorProfileDetails = response;
      //console.log(this.mentorProfileDetails);

      if (this.mentorProfileDetails.profile_image.length > 0) {
        //console.log('pello')
        this.profileImagePath = this.mentorProfileDetails.profile_image[0].file_path;
      }

      if (this.mentorProfileDetails.introduction_video.length > 0) {
        //console.log('pello')
        this.getVideoLink = this.mentorProfileDetails.introduction_video[0].file_path;
        this.getVideoType = this.mentorProfileDetails.introduction_video[0].file_mimetype;
      }

      if (this.mentorProfileDetails.availability.length > 0) {
        this.getAvailableSlots = this.mentorProfileDetails.availability;
        let getDate = this.getSelectedDate;

        //console.log(getDate);

        this.selectedAvailabilityArray = this.getAvailableSlots.filter(function (item) {
          return item.date === getDate;
        });

        //console.log(this.selectedAvailabilityArray);

      }

    })
  }

  /**
     * get Mentor Notifications By Token
    */
  getNotifications(id): void {
    this.utilsService.processPostRequest('notifications/getNotifications', { userID: id }, true).pipe(takeUntil(this.onDestroy$)).subscribe((response) => {
      this.getNotificationDetails = response;
      console.log(this.getNotificationDetails);
    })
  }

  public openVideoIntroPopup(video_link): void {
    //this.getVideoLink = this.dom.bypassSecurityTrustResourceUrl(video_link);
    this.getVideoLink = video_link;
    //console.log(this.getVideoLink);
    if (this.getVideoLink != "") {
      $('#videoModal').modal('show')
    }

  }

  public submitMentorBookingRequest(): void {
    // check Parent has added the billing method or not.
    this.utilsService.processPostRequest('checkBillingMethodExists', { userID: this.id }, true).pipe(takeUntil(this.onDestroy$)).subscribe((response) => {


    })
  }

  onDateChange(value: Date): void {
    this.selectedAvailabilityArray = [];

    let selectedDate = new Date(value);

    this.getCurrentDay = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"][selectedDate.getDay()]

    let formatDate = selectedDate.getDate() + '/' + (selectedDate.getMonth() + 1) + '/' + selectedDate.getFullYear();

    this.getSelectedDate = formatDate;

    this.selectedAvailabilityArray = this.getAvailableSlots.filter(function (item) {
      return item.date === formatDate;
    });

    //console.log(this.selectedAvailabilityArray);
  }

  /**
  * set check object array length.
  * @param object
  *  @return number
  */
  public checkObjectLength(object): number {
    return Object.keys(object).length;
  }

  //destroy all subscription
  public ngOnDestroy(): void {
    this.onDestroy$.next();
  }


}
