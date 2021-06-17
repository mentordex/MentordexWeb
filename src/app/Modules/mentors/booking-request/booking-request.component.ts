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
  selector: 'app-booking-request',
  templateUrl: './booking-request.component.html',
  styleUrls: ['./booking-request.component.css']
})
export class BookingRequestComponent implements OnInit {

  private onDestroy$: Subject<void> = new Subject<void>();
  id: any = '';
  getJobId: any = '';
  getParentId: any = '';
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
      parent_id: ['', Validators.compose([Validators.required])],
      rating: [1, Validators.compose([Validators.required])],
      review: ['', Validators.compose([Validators.minLength(1), Validators.maxLength(5000), Validators.required])]
    });
  }

  private checkQueryParam() {
    this.ngxLoader.start();
    this.id = localStorage.getItem('x-user-ID');
    this.activatedRoute.params.subscribe((params) => {
      this.getJobId = params['id'];
      this.zone.run(() => {
        this.getMentorJobDetails(this.id, this.getJobId);
      });
      //console.log(this.priceValuationForm.value);
    });
  }

  /**
   * get Mentor Details By Token
  */
  getMentorJobDetails(id, getJobId): void {
    this.utilsService.processPostRequest('jobs/getMentorJobDetails', { userID: id, jobId: getJobId }, true).pipe(takeUntil(this.onDestroy$)).subscribe((response) => {
      this.jobDetails = response;

      this.reviewForm.patchValue({
        userID: id,
        job_id: getJobId,
        parent_id: this.jobDetails.parent_id
      })

      this.ngxLoader.stop();
      //console.log(this.jobDetails);
    })
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

    this.utilsService.processPostRequest('jobs/saveParentReview', this.reviewForm.value, false, '').pipe(takeUntil(this.onDestroy$)).subscribe((response) => {
      this.checkQueryParam();
      //console.log(response);
      this.ngxLoader.stop();
    })
  }


  showUpdateBookingRequestPopup(jobId, parentId, jobStatus): void {
    this.isBookingMethodModalOpen = true;
    this.getJobId = jobId
    this.getParentId = parentId
    this.getJobStatus = jobStatus
  }

  hideUpdateBookingRequestPopup(isOpened: boolean): void {
    this.ngxLoader.start();
    this.isBookingMethodModalOpen = isOpened; //set to false which will reset modal to show on click again
    this.getMentorJobDetails(this.id, this.getJobId);
  }

  //destroy all subscription
  public ngOnDestroy(): void {
    this.onDestroy$.next();
  }

}
