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

import { DropzoneComponent, DropzoneDirective, DropzoneConfigInterface } from 'ngx-dropzone-wrapper';

import { NgxUiLoaderService } from 'ngx-ui-loader';

@Component({
  selector: 'app-booking-request',
  templateUrl: './booking-request.component.html',
  styleUrls: ['./booking-request.component.css']
})
export class BookingRequestComponent implements OnInit {

  private onDestroy$: Subject<void> = new Subject<void>();
  id: any = '';
  mentorId: any = '';
  mentorProfileDetails: any = {};

  bookARequestForm: FormGroup;
  isbookARequestFormSubmitted: boolean = false

  base64StringFile: any;
  public jobFileConfiguration: DropzoneConfigInterface;

  minDate: Date;
  maxDate: Date;
  disabled: boolean = false
  getCurrentDay: any = '';
  getCurrentDate: any = '';

  slots: any = [];
  getAvailableSlots: any = [];

  paymentDetails: any = {};
  paymentDetailsArray: any = [];
  isPaymentMethodModalOpen: boolean = false;

  selectedSpeciality: any = '';

  constructor(private zone: NgZone, private formBuilder: FormBuilder, private authService: AuthService, private utilsService: UtilsService, private router: Router, private activatedRoute: ActivatedRoute, private dom: DomSanitizer, private ngxLoader: NgxUiLoaderService) {
    this.minDate = new Date();
    this.maxDate = new Date();
    this.minDate.setDate(this.minDate.getDate());
    this.maxDate.setDate(this.maxDate.getDate() + 7);
    this.getCurrentDay = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"][new Date().getDay()]
    this.getCurrentDate = this.minDate.getDate() + '/' + (this.minDate.getMonth() + 1) + '/' + this.minDate.getFullYear();

  }

  ngOnInit(): void {
    this.initalizeBookARequestForm();
    this.checkQueryParam();
    this.jobFileDropzoneInit();
    this.initalizeTimeSlots();
  }

  private checkQueryParam() {
    this.ngxLoader.start();

    this.id = localStorage.getItem('x-user-ID');

    this.activatedRoute.params.subscribe((params) => {
      this.mentorId = params['id'];
      this.zone.run(() => {
        this.getMentorProfileDetailsById(this.id, this.mentorId);
      });
      //console.log(this.priceValuationForm.value);
    });

    this.getPaymentDetailsByToken(this.id);

    this.ngxLoader.stop();
  }

  //initalize Book Requestform
  private initalizeBookARequestForm() {
    this.bookARequestForm = this.formBuilder.group({
      parent_id: [''],
      mentor_id: [''],
      job_title: ['', Validators.compose([Validators.required, Validators.minLength(2), Validators.maxLength(100)])],
      job_description: ['', Validators.compose([Validators.required, Validators.minLength(2), Validators.maxLength(2000)])],
      category_id: ['', [Validators.required]],
      hourly_rate: ['', [Validators.required]],
      subcategory_id: ['', [Validators.required]],
      booking_date: ['', [Validators.required]],
      booking_time: ['', [Validators.required]],
      job_file: this.formBuilder.array([]),
      agree_terms: [false, Validators.requiredTrue],
      payment_method_added: [false, Validators.requiredTrue],
    });
  }

  /**
 * Validate Payment Method.
 */
  validateBookARequestForm() {

    this.isbookARequestFormSubmitted = true;

    // stop here if form is invalid
    if (this.bookARequestForm.invalid) {
      return;
    }
    //console.log(this.bookARequestForm.value); return;
    this.utilsService.processPostRequest('jobs/newBookingRequest', this.bookARequestForm.value, true, '').pipe(takeUntil(this.onDestroy$)).subscribe((response) => {

      this.ngxLoader.start();

      //console.log(response);
      this.utilsService.onResponse(environment.MESSGES['BOOKING-REQUEST-SENT'], true);
      this.router.navigate(['/parent/search']);

      this.ngxLoader.stop();

    })

  }

  /**
   * get Mentor Profile Details By Token
  */
  getMentorProfileDetailsById(id, mentorId): void {
    this.utilsService.processPostRequest('getMentorProfileDetailsById', { userID: id, mentorId: mentorId }, true).pipe(takeUntil(this.onDestroy$)).subscribe((response) => {
      this.mentorProfileDetails = response;
      this.bookARequestForm.patchValue({
        hourly_rate: this.mentorProfileDetails.hourly_rate,
        //category_id: this.mentorProfileDetails.category_id,
        parent_id: id,
        mentor_id: mentorId,
      });
      //console.log(this.mentorProfileDetails);
    })
  }

  onDateChange(value: Date): void {
    this.ngxLoader.start();

    let selectedDate = new Date(value);


    let formatDate = selectedDate.getDate() + '/' + (selectedDate.getMonth() + 1) + '/' + selectedDate.getFullYear();
    this.bookARequestForm.controls.booking_date.patchValue(formatDate);

    let selectedDay = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"][selectedDate.getDay()];

    let getSelectedYear = selectedDate.getFullYear();
    let getSelectedMonth = selectedDate.getMonth() + 1;
    let getSelectedDate = selectedDate.getDate();
    //this.getCurrentDay = ["Sunday","Monday","Tuesday","Wednesday","Thursday","Friday","Saturday"][new Date().getDay()]
    this.getAvailableSlotsByDate(selectedDay, formatDate);
  }

  onCategoryChange(event): void {
    this.bookARequestForm.patchValue({ category_id: event.target.getAttribute('data-categoryId'), subcategory_id: event.target.getAttribute('data-subCategoryId') });
    //console.log(this.bookARequestForm.value);

    this.selectedSpeciality = event.target.getAttribute('data-subCategoryValue');
  }

  /**
   * get Available Slots By Date
  */
  getAvailableSlotsByDate(day, getSelectedDate): void {

    this.utilsService.processPostRequest('getMentorSlotsByDate', { userID: this.id, day: day, getSelectedDate: getSelectedDate, mentorId: this.mentorId }, true).pipe(takeUntil(this.onDestroy$)).subscribe((response) => {
      //console.log('response', response);
      let getSlots = response;
      if ('slots' in getSlots) {
        this.getAvailableSlots = [];
      } else {
        this.getAvailableSlots = getSlots['availableSlots'];
      }
      //console.log('response', this.getAvailableSlots);
      this.ngxLoader.stop();
    })

  }

  get jobFileArray(): FormArray {
    return this.bookARequestForm.get('job_file') as FormArray;
  }

  /**
  * Initialize Dropzone Library(Image Upload).
  */
  private jobFileDropzoneInit() {
    const componentObj = this;
    this.jobFileConfiguration = {
      clickable: true,
      paramName: "file",
      uploadMultiple: false,
      url: environment.API_ENDPOINT + "/api/uploadFile",
      maxFiles: 1,
      autoReset: null,
      errorReset: null,
      cancelReset: null,
      acceptedFiles: '.pdf',
      maxFilesize: 2, // MB,
      dictDefaultMessage: '<label for="attachment" class="primary--button cursor-pointer d-inline-block py-2 px-4"><svg class="mr-1" width="21" height="23" viewBox="0 0 21 23" fill="none"><path fill-rule="evenodd" clip-rule="evenodd" d="M10.7643 1.54895C11.6798 0.633458 12.9215 0.119141 14.2162 0.119141C16.9123 0.119141 19.0979 2.30475 19.0979 5.00083C19.0979 6.29554 18.5836 7.53722 17.6681 8.45271L9.22397 16.8968C8.69746 17.4234 7.98336 17.7191 7.23876 17.7191C5.68822 17.7191 4.43125 16.4622 4.43125 14.9116C4.43125 14.167 4.72704 13.4529 5.25355 12.9264L13.446 4.73393L14.4831 5.77102L6.29064 13.9635C6.03918 14.215 5.89792 14.556 5.89792 14.9116C5.89792 15.6522 6.49823 16.2525 7.23876 16.2525C7.59438 16.2525 7.93543 16.1112 8.18688 15.8597L16.631 7.41562C17.2715 6.77518 17.6313 5.90656 17.6313 5.00083C17.6313 3.11477 16.1023 1.58581 14.2162 1.58581C13.3105 1.58581 12.4419 1.9456 11.8014 2.58604L3.10567 11.2818C2.07624 12.3112 1.49792 13.7074 1.49792 15.1633C1.49792 18.1949 3.95552 20.6525 6.98712 20.6525C8.44295 20.6525 9.83915 20.0742 10.8686 19.0447L19.3127 10.6006L20.3498 11.6377L11.9057 20.0818C10.6012 21.3863 8.83193 22.1191 6.98712 22.1191C3.1455 22.1191 0.03125 19.0049 0.03125 15.1633C0.03125 13.3185 0.764099 11.5492 2.06858 10.2447L10.7643 1.54895Z" fill="white"/></svg>Attach File</label>',
      //previewsContainer: "#offerInHandsPreview",
      addRemoveLinks: true,
      //resizeWidth: 125,
      //resizeHeight: 125,
      //createImageThumbnails:false,
      dictInvalidFileType: 'Only valid pdf file is accepted.',
      dictFileTooBig: 'Maximum upload file size limit is 2MB',
      dictCancelUpload: '<i class="fa fa-times" aria-hidden="true"></i>',
      dictRemoveFile: '<i class="fa fa-times" aria-hidden="true"></i>',
      headers: {
        'Cache-Control': null,
        'X-Requested-With': null,
      },

      accept: function (file, done) {



        if ((componentObj.jobFileArray.length + 1) > 1) {

          componentObj.utilsService.onError('You cannot upload any more files.');//hide page loader          
          this.removeFile(file);
          return false;
        }

        const reader = new FileReader();
        reader.onload = function (event) {

          let base64String = reader.result
          let fileExtension = (file.name).split('.').pop();

          componentObj.base64StringFile = reader.result;

          if (fileExtension == "pdf") {
            componentObj.base64StringFile = componentObj.base64StringFile.replace('data:application/pdf;base64,', '');
          }

          componentObj.utilsService.showPageLoader();//start showing page loader
          done();
        };
        reader.readAsDataURL(file);
      },
      init: function () {


        this.on('sending', function (file, xhr, formData) {

          formData.append('folder', 'Jobs');
          formData.append('fileType', file.type);
          formData.append('base64StringFile', componentObj.base64StringFile);

          componentObj.utilsService.showPageLoader();//start showing page loader 
        });


        this.on("success", function (file, serverResponse) {
          //console.log('serverResponse', serverResponse);

          componentObj.zone.run(() => {
            componentObj.jobFileArray.push(new FormControl({ file_path: serverResponse.fileLocation, file_name: serverResponse.fileName, file_key: serverResponse.fileKey, file_mimetype: serverResponse.fileMimeType, file_category: 'Jobs' }));
          });

          this.removeFile(file);
          componentObj.utilsService.hidePageLoader();//hide page loader
        });

        this.on("error", function (file, serverResponse) {

          this.removeFile(file);
          componentObj.utilsService.onError(serverResponse);//hide page loader  
          componentObj.utilsService.hidePageLoader();//hide page loader
        });

      }
    };
  }

  /**
   * remove PDF
   * @param index index of the image array
   * @return  boolean
   */
  removeFile(index, file_category, file_key): void {

    this.jobFileArray.removeAt(index);

    this.removeFileFromBucket(file_key);
  }

  /**
   * remove image from AWS Bucket
   * @param filePath image url
   * @param bucket s3 bucket name
   */
  removeFileFromBucket(file_key) {

    const params = { fileKey: file_key }

    this.utilsService.processPostRequest('deleteObject', params, true).pipe(takeUntil(this.onDestroy$)).subscribe((response) => {
      //console.log(response);
    })
  }

  initalizeTimeSlots() {
    for (var i = 0; i < 24; i++) {
      var timeFormat = (i <= 11) ? 'AM' : 'PM'
      i = (i < 9) ? parseInt(`0${i}`) : i;


      if (i < 9) {
        var j = (i == 0) ? '12' : `0${i}`
        this.slots.push({ slot: `${j}:00 ${timeFormat} - 0${i + 1}:00 ${timeFormat}`, isChecked: false })
      } else if (i == 9) {
        this.slots.push({ slot: `0${i}:00 ${timeFormat} - ${i + 1}:00 ${timeFormat}`, isChecked: false })
      } else {
        this.slots.push({ slot: `${i}:00 ${timeFormat} - ${i + 1}:00 ${timeFormat}`, isChecked: false })
      }

    }
  }

  /**
   * get Parent Details By Token
  */
  getPaymentDetailsByToken(id): void {
    this.ngxLoader.start();
    this.utilsService.processPostRequest('getSavedPaymentMethod', { userID: this.id }, true).pipe(takeUntil(this.onDestroy$)).subscribe((response) => {
      this.paymentDetails = response;
      //console.log(this.paymentDetails.payment_details);
      this.paymentDetailsArray = this.paymentDetails.payment_details;
      if (this.paymentDetailsArray.length > 0) {
        this.bookARequestForm.patchValue({
          payment_method_added: true
        });
      } else {
        this.bookARequestForm.patchValue({
          payment_method_added: false
        });
      }

      this.paymentDetailsArray = this.paymentDetailsArray.filter(function (item) {
        return item.default === true;
      });

      this.ngxLoader.stop();
    })
  }

  showPaymentMethodPopup(): void {

    this.isPaymentMethodModalOpen = true;

    //this.selectedPriceId = priceId
  }

  hidePaymentMethodPopup(isOpened: boolean): void {
    // console.log('carDetails', isOpened);
    this.ngxLoader.stop();
    this.isPaymentMethodModalOpen = isOpened; //set to false which will reset modal to show on click again
    this.getPaymentDetailsByToken(this.id);
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
