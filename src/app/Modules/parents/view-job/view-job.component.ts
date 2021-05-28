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


@Component({
  selector: 'app-view-job',
  templateUrl: './view-job.component.html',
  styleUrls: ['./view-job.component.css']
})
export class ViewJobComponent implements OnInit {

  private onDestroy$: Subject<void> = new Subject<void>();
  id: any = '';
  getJobId: any = '';
  getMentorId: any = '';
  getJobStatus: any = 'ACCEPTED';
  jobDetails: any = {};

  isBookingMethodModalOpen: boolean = false;

  isReviewFormSubmitted: boolean = false;
  reviewForm: FormGroup;

  constructor(private zone: NgZone, private formBuilder: FormBuilder, private authService: AuthService, private utilsService: UtilsService, private router: Router, private activatedRoute: ActivatedRoute, private ngxLoader: NgxUiLoaderService) { }

  ngOnInit(): void {
    this.initalizeReviewForm();
    this.checkQueryParam();
  }

  //initalize Message Form
  private initalizeReviewForm() {
    this.reviewForm = this.formBuilder.group({
      userID: ['', Validators.compose([Validators.required])],
      job_id: ['', Validators.compose([Validators.required])],
      mentor_id: ['', Validators.compose([Validators.required])],
      rating: [1, Validators.compose([Validators.required])],
      review: ['', Validators.compose([Validators.minLength(1), Validators.maxLength(5000), Validators.required])]
    });
  }

  private checkQueryParam() {
    this.id = localStorage.getItem('x-user-ID');
    this.ngxLoader.start();
    this.activatedRoute.params.subscribe((params) => {
      this.getJobId = params['id'];
      this.zone.run(() => {
        this.getParentJobDetails(this.id, this.getJobId);
      });
      //console.log(this.priceValuationForm.value);
    });
  }

  /**
   * get Parent Job Details By Token
  */
 getParentJobDetails(id, getJobId): void {
    this.utilsService.processPostRequest('jobs/getParentJobDetails', { userID: id, jobId: getJobId }, true).pipe(takeUntil(this.onDestroy$)).subscribe((response) => {
      this.jobDetails = response;

      this.reviewForm.patchValue({
        userID: id,
        job_id: getJobId,
        mentor_id: this.jobDetails.mentor_id
      })

      this.ngxLoader.stop();
      //let newDate = new Date(this.jobDetails.booking_date);
      //console.log(newDate);
      //console.log(this.jobDetails);
    })
  }


  showUpdateBookingRequestPopup(jobId, mentorId, jobStatus): void {
    this.isBookingMethodModalOpen = true;
    this.getJobId = jobId
    this.getMentorId = mentorId
    this.getJobStatus = jobStatus
  }

  hideUpdateBookingRequestPopup(isOpened: boolean): void {
    
    this.isBookingMethodModalOpen = isOpened; //set to false which will reset modal to show on click again
    this.getParentJobDetails(this.id, this.getJobId);
    this.ngxLoader.stop();
  }

  OnSelectRating(e): void {
    this.reviewForm.patchValue({
      rating: e
    })
  }

  onSubmitReviewForm() {

    this.ngxLoader.start();

    if (this.reviewForm.invalid) {
      this.isReviewFormSubmitted = true
      return false;
    }

    //console.log(this.reviewForm.value); return;

    this.utilsService.processPostRequest('jobs/saveMentorReview', this.reviewForm.value, false, '').pipe(takeUntil(this.onDestroy$)).subscribe((response) => {
      //console.log(response);
      this.checkQueryParam();
      this.ngxLoader.stop();
      
    })
  }

  //destroy all subscription
  public ngOnDestroy(): void {
    this.onDestroy$.next();
  }

}
