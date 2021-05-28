import { Component, OnInit, OnDestroy, ViewChild, NgZone, EventEmitter, Output, Input, ElementRef } from '@angular/core';
import { FormBuilder, FormGroup, Validators, ValidatorFn, ValidationErrors, FormControl, FormArray, AbstractControl } from '@angular/forms';
import { Router, ActivatedRoute } from "@angular/router";
import { takeUntil } from 'rxjs/operators';
import { Subject } from 'rxjs';

import { MovingDirection, WizardComponent } from 'angular-archwizard';

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
  selector: 'app-update-job-status',
  templateUrl: './update-job-status.component.html',
  styleUrls: ['./update-job-status.component.css']
})
export class UpdateJobStatusComponent implements OnInit {

  private onDestroy$: Subject<void> = new Subject<void>();
  @Input() isOpen: any;
  @Input() getJobId: any;
  @Input() getMentorId: any;
  @Input() getJobStatus: any;
  //@Input() parentId: any;

  @ViewChild('exampleModal') exampleModal: ElementRef;
  @Output() onClose: EventEmitter<any> = new EventEmitter<any>();
  @Output() hideUpdateBookingRequestPopup: EventEmitter<any> = new EventEmitter<any>();

  id: any = '';
  responseMsg = ''
  updateBookingRequestWizard: FormGroup;
  isBookingRequestSubmitted: boolean = false;

  paymentDetails: any = {};
  paymentDetailsArray: any = [];

  constructor(private zone: NgZone, private formBuilder: FormBuilder, private authService: AuthService, private utilsService: UtilsService, private router: Router, private activatedRoute: ActivatedRoute, private ngxLoader: NgxUiLoaderService) {
    this.updateBookingRequestForm();
    this.checkQueryParam();
  }

  ngOnInit(): void {
  }

  private checkQueryParam() {
    this.id = localStorage.getItem('x-user-ID');
    this.updateBookingRequestWizard.patchValue({
      userID: this.id
    });

    this.getPaymentDetailsByToken(this.id);

  }

  /**
  * Initialize Payment Detail Fields.
  */
  private updateBookingRequestForm() {
    this.updateBookingRequestWizard = this.formBuilder.group({
      userID: ['', Validators.required],
      mentor_id: ['', Validators.required],
      job_status: ['', Validators.required],
      job_id: ['', Validators.required],
      job_message: ['', Validators.compose([Validators.minLength(10), Validators.maxLength(1000), Validators.required])],
    });
  }

  validateBookingRequestWizard(): void {

    this.ngxLoader.start();

    this.isBookingRequestSubmitted = true;

    // stop here if form is invalid
    if (this.updateBookingRequestWizard.invalid) {
      return;
    }
    //this.wizard.goToNextStep();
    if (this.getJobStatus == 'COMPLETED') {
      this.utilsService.processPostRequest('jobs/chargePayment', this.updateBookingRequestWizard.value, true, '').pipe(takeUntil(this.onDestroy$)).subscribe((response) => {
        //console.log(response);
        this.responseMsg = environment.MESSGES['BOOKING-REQUEST-COMPLETED'];
        this.utilsService.onResponse(this.responseMsg, true);
        this.close();
      })
    }

    if (this.getJobStatus == 'CANCELLED') {
      this.utilsService.processPostRequest('jobs/cancelBookingRequest', this.updateBookingRequestWizard.value, true, '').pipe(takeUntil(this.onDestroy$)).subscribe((response) => {
        //console.log(response);
        this.responseMsg = environment.MESSGES['BOOKING-REQUEST-CANCELLED'];
        this.utilsService.onResponse(this.responseMsg, true);
        this.close();
      })
    }


  }

  ngOnChanges(): void {
    //to show the modal popup
    if (this.isOpen) {

      $(this.exampleModal.nativeElement).modal({ backdrop: 'static', keyboard: false, show: true });
      //console.log(this.membershipDetails);
      this.updateBookingRequestWizard.patchValue({
        mentor_id: this.getMentorId,
        job_status: this.getJobStatus,
        job_id: this.getJobId,
      });
    }
  }


  /**
   * get Parent Details By Token
  */
  getPaymentDetailsByToken(id): void {
    this.utilsService.processPostRequest('getSavedPaymentMethod', { userID: this.id }, true).pipe(takeUntil(this.onDestroy$)).subscribe((response) => {
      this.paymentDetails = response;
      //console.log(this.paymentDetails.payment_details);
      this.paymentDetailsArray = this.paymentDetails.payment_details;
      this.paymentDetailsArray = this.paymentDetailsArray.filter(function (item) {
        return item.default === true;
      });

      //console.log(this.paymentDetailsArray);

    })
  }

  close() {
    this.isOpen = false
    this.hideUpdateBookingRequestPopup.emit(false);
    $(this.exampleModal.nativeElement).modal('hide'); // Close the current popup

  }

  //destroy all subscription
  public ngOnDestroy(): void {
    this.onDestroy$.next();
  }

}
