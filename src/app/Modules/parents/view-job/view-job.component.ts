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

  constructor(private zone: NgZone, private formBuilder: FormBuilder, private authService: AuthService, private utilsService: UtilsService, private router: Router, private activatedRoute: ActivatedRoute) { }

  ngOnInit(): void {
    this.checkQueryParam();
  }

  private checkQueryParam() {
    this.id = localStorage.getItem('x-user-ID');
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
      let newDate = new Date(this.jobDetails.booking_date);
      console.log(newDate);
      console.log(this.jobDetails);
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
  }

  //destroy all subscription
  public ngOnDestroy(): void {
    this.onDestroy$.next();
  }

}
