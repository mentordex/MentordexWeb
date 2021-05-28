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

import { NgxUiLoaderService } from 'ngx-ui-loader';

declare var $;

@Component({
  selector: 'app-mentor-profile',
  templateUrl: './mentor-profile.component.html',
  styleUrls: ['./mentor-profile.component.css']
})
export class MentorProfileComponent implements OnInit {

  private onDestroy$: Subject<void> = new Subject<void>();
  id: any = '';
  mentorId: any = '';
  mentorProfileDetails: any = {};
  mentorProfileReviews: any = [];
  profileImagePath: any = 'assets/img/none.png';
  getVideoLink: any = '';
  getVideoType: any = '';

  getMentorCompletedJobsCount: number = 0;
  mentorAlreadySaved:boolean = false;

  minDate: Date;
  maxDate: Date;
  getCurrentDay: any = '';
  getCurrentDate: any = '';
  getSelectedDate: any = '';

  getAvailableSlots: any = [];
  selectedAvailabilityArray: any = [];

  options = { autoHide: false, scrollbarMinSize: 100 };

  constructor(private zone: NgZone, private formBuilder: FormBuilder, private authService: AuthService, private utilsService: UtilsService, private router: Router, private activatedRoute: ActivatedRoute, private dom: DomSanitizer, private ngxLoader: NgxUiLoaderService) {
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
    this.ngxLoader.start();

    this.id = localStorage.getItem('x-user-ID');

    this.activatedRoute.params.subscribe((params) => {
      this.mentorId = params['id'];

      this.zone.run(() => {
        this.getMentorProfileDetailsById(this.id, this.mentorId);
        this.getMentorReviewsById(this.id, this.mentorId);
      });

      //console.log(this.getMentorProfileDetailsById.value);

    });

  }

  /**
   * get Mentor Details By Token
  */
  getMentorProfileDetailsById(id, mentorId): void {



    this.utilsService.processPostRequest('getMentorProfileDetailsById', { userID: id, mentorId: mentorId }, false).pipe(takeUntil(this.onDestroy$)).subscribe((response) => {

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

      this.ngxLoader.stop();

    })
  }

  /**
   * get Mentor Reviews By Token
  */
  getMentorReviewsById(id, mentorId): void {



    this.utilsService.processPostRequest('getMentorReviewsById', { userID: id, mentorId: mentorId }, false).pipe(takeUntil(this.onDestroy$)).subscribe((response) => {

      this.mentorProfileReviews = response['mentorReviews'];
      this.getMentorCompletedJobsCount = response['mentorCompletedJobsCount'];
      this.mentorAlreadySaved = response['mentorAlreadySaved'];

      //console.log(this.mentorAlreadySaved);
      //console.log(this.getMentorCompletedJobsCount);
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

  public saveMentor(mentor_id): void {
    this.ngxLoader.start();
    // check Parent has added the billing method or not.
    this.utilsService.processPostRequest('saveMentor', { userID: this.id, mentorId: mentor_id }, false).pipe(takeUntil(this.onDestroy$)).subscribe((response) => {
      this.mentorAlreadySaved = true;
      this.utilsService.onResponse(environment.MESSGES['MENTOR-SAVED'], true);
      this.ngxLoader.stop();
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
