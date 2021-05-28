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

import { NgxUiLoaderService } from 'ngx-ui-loader';

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

  getTransactionDetails: any = []
  getInvoiceDetails: any = []

  totalRecords: Number = 0
  pagination: any = {
    search: '',
    sort_by: 'created_at',
    sort_dir: 'desc',
    filters: [],
    size: 5,
    pageNumber: 1,
  }


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

    this.zone.run(() => {
      this.pagination['userID'] = this.id;
      this.getMentorProfileDetailsById(this.id);
      this.getNotifications(this.id);
      this.getTransactions();
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

      this.ngxLoader.stop();

    })
  }

  /**
     * get Mentor Notifications By Token
    */
  getNotifications(id): void {
    this.ngxLoader.start();
    this.utilsService.processPostRequest('notifications/getNotifications', { userID: id }, true).pipe(takeUntil(this.onDestroy$)).subscribe((response) => {
      this.getNotificationDetails = response;

      if (this.getNotificationDetails.length > 0) {
        this.getNotificationDetails.forEach((element, index, notificationArray) => {
          if (element.notification_type == 'BOOKING') {
            notificationArray[index]['redirectUrl'] = '/mentor/booking-request/' + element.job_id;
          } else if (element.notification_type == 'MESSAGE') {
            notificationArray[index]['redirectUrl'] = '/mentor/messages/' + element.job_id;
          } else if (element.notification_type == 'SUBSCRIPTION') {
            notificationArray[index]['redirectUrl'] = '/mentor/payment-history';
          } else {
            notificationArray[index]['redirectUrl'] = 'javascript:void(0)';
          }
        })

      }

      this.getNotificationDetails = this.getNotificationDetails.slice(0, 5);
      //console.log(this.getNotificationDetails);
      this.ngxLoader.stop();
    })
  }

  /**
   * get Mentor Transactions By Token
  */
  getTransactions(): void {
    //console.log(this.pagination); return;
    this.ngxLoader.start();
    this.utilsService.processPostRequest('transactions/getTransactions', this.pagination, true).pipe(takeUntil(this.onDestroy$)).subscribe((response) => {
      this.getTransactionDetails = response['records'];
      this.totalRecords = response['total_records'];

      if (this.getTransactionDetails.length > 0) {
        this.getTransactionDetails.forEach((element, index, transactionArray) => {
          if ('invoice_id' in element && element.invoice_id != '') {
            this.utilsService.processPostRequest('transactions/fetchInvoicesById', { userID: this.id, invoice_id: element.invoice_id }, true).pipe(takeUntil(this.onDestroy$)).subscribe((response) => {
              this.getInvoiceDetails = response;
              if ('invoice_pdf' in this.getInvoiceDetails) {
                transactionArray[index]['invoice_pdf'] = this.getInvoiceDetails.invoice_pdf;
                transactionArray[index]['invoice_url'] = this.getInvoiceDetails.invoice_url;
                transactionArray[index]['invoice_number'] = this.getInvoiceDetails.invoice_number;
              } else {
                transactionArray[index]['invoice_pdf'] = 'N/A';
                transactionArray[index]['invoice_url'] = 'N/A';
                transactionArray[index]['invoice_number'] = 'N/A';
              }

            })
          }
        });
      }

      this.getTransactionDetails = this.getTransactionDetails.slice(0, 5);

      this.ngxLoader.stop();


      //console.log(this.getTransactionDetails);
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
