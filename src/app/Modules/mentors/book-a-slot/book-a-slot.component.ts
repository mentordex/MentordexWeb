import { Component, OnInit, OnDestroy, ViewChild, NgZone } from '@angular/core';

import { FormBuilder, FormGroup, Validators, ValidatorFn, ValidationErrors, FormControl, FormArray, AbstractControl } from '@angular/forms';
import { Router, ActivatedRoute } from "@angular/router";
import { takeUntil } from 'rxjs/operators';
import { Subject } from 'rxjs';

// import fade in animation
import { fadeInAnimation } from '../../../core/animations';
import { AuthService, UtilsService } from '../../../core/services';

//import custom validators
import { CustomValidators } from '../../../core/custom-validators';

//import enviornment
import { environment } from '../../../../environments/environment';

import { DropzoneComponent, DropzoneDirective, DropzoneConfigInterface } from 'ngx-dropzone-wrapper';

export const minLengthArray = (min: number) => {
  return (c: AbstractControl): { [key: string]: any } => {
    if (c.value.length >= min)
      return null;

    return { MinLengthArray: true };
  }
}

@Component({
  selector: 'app-book-a-slot',
  templateUrl: './book-a-slot.component.html',
  styleUrls: ['./book-a-slot.component.css']
})
export class BookASlotComponent implements OnInit {

  private onDestroy$: Subject<void> = new Subject<void>();
  id: any = ''
  mentorDetails: any = {};

  bookASlotForm: FormGroup;
  isBookASlotFormSubmitted: boolean = false

  
  minDate: Date;
  maxDate: Date;
  base64StringFile: any;
  disabled: boolean = false
  getCurrentDay: any = '';
  getCurrentDate: any = '';

  getAvailableSlots: any = [];

  public letterOfRecommendationConfiguration: DropzoneConfigInterface;

  constructor(private activatedRoute: ActivatedRoute, private formBuilder: FormBuilder, private authService: AuthService, private utilsService: UtilsService, private router: Router, private zone: NgZone) {

    this.minDate = new Date();
    this.maxDate = new Date();
    this.minDate.setDate(this.minDate.getDate());
    this.maxDate.setDate(this.maxDate.getDate() + 7);
    this.getCurrentDay = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"][new Date().getDay()]
    this.getCurrentDate = this.minDate.getDate() + '/' + (this.minDate.getMonth() + 1) + '/' + this.minDate.getFullYear();
    
  }

  ngOnInit(): void {
    this.initalizeBookASlotForm();
    this.checkQueryParam();
    this.letterOfRecommendationDropzoneInit();
    this.getAvailableSlotsByDay(this.getCurrentDay, this.getCurrentDate);
  }

  private checkQueryParam() {
    this.id = localStorage.getItem('x-user-ID');
    this.getMentorDetailsByToken(this.id);
    this.bookASlotForm.patchValue({
      userID: this.id
    });

  }

  //initalize Basic Detailsform
  private initalizeBookASlotForm() {
    this.bookASlotForm = this.formBuilder.group({
      userID: [''],
      appointment_date: ['', [Validators.required]],
      appointment_time: ['', [Validators.required]],
      references: this.formBuilder.array([this.newReferences()], [minLengthArray(2)]),
      letter_of_recommendation: this.formBuilder.array([])

    });
  }

  get letterOfRecommendationPdfArray(): FormArray {
    return this.bookASlotForm.get('letter_of_recommendation') as FormArray;
  }

  references(): FormArray {
    return this.bookASlotForm.get("references") as FormArray
  }

  newReferences(): FormGroup {
    return this.formBuilder.group({
      name: ['', Validators.compose([Validators.required, Validators.minLength(2), Validators.maxLength(20)])],
      relation: ['', Validators.compose([Validators.required, Validators.minLength(2), Validators.maxLength(20)])],
      job_title: ['', Validators.compose([Validators.required, Validators.minLength(2), Validators.maxLength(50)])],
      workplace_name: ['', Validators.compose([Validators.required, Validators.minLength(2), Validators.maxLength(50)])],
      contact_number: ['', [Validators.required, Validators.pattern("^[0-9]*$"), Validators.minLength(10), Validators.maxLength(10)]],
      email: ['', [Validators.required, Validators.pattern("^[a-z0-9._%+-]+@[a-z0-9.-]+\\.[a-z]{2,4}$")]],
    })
  }

  addReference() {
    this.references().push(this.newReferences());
  }

  removeReference(i: number) {
    this.references().removeAt(i);
  }

  /**
  * Initialize Dropzone Library(Image Upload).
  */
  private letterOfRecommendationDropzoneInit() {
    const componentObj = this;
    this.letterOfRecommendationConfiguration = {
      clickable: true,
      paramName: "file",
      uploadMultiple: false,
      url: environment.API_ENDPOINT + "/api/uploadFile",
      maxFiles: 3,
      autoReset: null,
      errorReset: null,
      cancelReset: null,
      acceptedFiles: '.pdf',
      maxFilesize: 2, // MB,
      dictDefaultMessage: '<span class="button actual-upload-btn"><svg class="mr-2" width="15" height="15" viewBox="0 0 15 15" fill="none"><path d="M7.49961 1.59998L10.9663 4.79998M7.49961 1.59998L4.29961 4.79998M7.49961 1.59998V11.7333M13.8996 7.46664V14.4H1.09961V7.46664" stroke="#384047"></path></svg>Upload File</span>',
      //previewsContainer: "#offerInHandsPreview",
      addRemoveLinks: true,
      //resizeWidth: 125,
      //resizeHeight: 125,
      //createImageThumbnails:false,
      dictInvalidFileType: 'Only valid jpeg, jpg, png and pdf file is accepted.',
      dictFileTooBig: 'Maximum upload file size limit is 2MB',
      dictCancelUpload: '<i class="fa fa-times" aria-hidden="true"></i>',
      dictRemoveFile: '<i class="fa fa-times" aria-hidden="true"></i>',
      headers: {
        'Cache-Control': null,
        'X-Requested-With': null,
      },

      accept: function (file, done) {


        if ((componentObj.letterOfRecommendationPdfArray.length + 1) > 3) {
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

          formData.append('folder', 'LOR');
          formData.append('fileType', file.type);
          formData.append('base64StringFile', componentObj.base64StringFile);
          componentObj.utilsService.showPageLoader();//start showing page loader 
        });


        this.on("totaluploadprogress", function (progress) {
          componentObj.utilsService.showPageLoader('Uploading file ' + parseInt(progress) + '%')
          if (progress >= 100) {
            componentObj.utilsService.hidePageLoader();//hide page loader
          }
        })

        this.on("success", function (file, serverResponse) {
          console.log('serverResponse', serverResponse);

          componentObj.zone.run(() => {
            componentObj.letterOfRecommendationPdfArray.push(new FormControl({ file_path: serverResponse.fileLocation, file_name: serverResponse.fileName, file_key: serverResponse.fileKey, file_mimetype: serverResponse.fileMimeType, file_category: 'LOR' }));
          });
          console.log('letterOfRecommendationPdfArray', componentObj.letterOfRecommendationPdfArray);
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
   
    this.letterOfRecommendationPdfArray.removeAt(index);  

    this.removeFileFromBucket(file_key);
  }

  /**
   * remove image from AWS Bucket
   * @param filePath image url
   * @param bucket s3 bucket name
   */
  removeFileFromBucket(file_key){    

    const params = { fileKey : file_key }

    this.utilsService.processPostRequest('deleteObject', params, true).pipe(takeUntil(this.onDestroy$)).subscribe((response) => {
      console.log(response);
    })
  } 

  /**
   * get Mentor Details By Token
  */
  getMentorDetailsByToken(id): void {
    this.utilsService.processPostRequest('getMentorDetails', { userID: this.id }, true).pipe(takeUntil(this.onDestroy$)).subscribe((response) => {
      
       if (this.mentorDetails.admin_status == 'NEW') {
        this.router.navigate(['/mentor/application-status']);
      }
      this.mentorDetails = response;
    })
  }

  /**
    * on Submit Basic Details
   */
  onSubmitBookASlotDetailsForm() {

    if (this.bookASlotForm.invalid) {
      this.isBookASlotFormSubmitted = true
      return false;
    }

    //console.log(this.bookASlotForm.value); return;

    this.utilsService.processPostRequest('updateBookASlotDetails', this.bookASlotForm.value, true, '').pipe(takeUntil(this.onDestroy$)).subscribe((response) => {

      this.router.navigate(['/mentor/application-status']);
    })
  }

  /**
   * get Available Slots By Day
  */
  getAvailableSlotsByDay(day, getSelectedDate): void {

    this.utilsService.processPostRequest('dayTimeslot/getAvailableSlots', { day: day, getSelectedDate: getSelectedDate }, true).pipe(takeUntil(this.onDestroy$)).subscribe((response) => {
      //console.log('response', response);
      let getSlots = response['slots'];
      if (getSlots == false) {
        this.getAvailableSlots = [];
      } else {
        this.getAvailableSlots = getSlots.filter(function (item) {
          return item.isChecked !== false;
        });
      }
      //console.log('response', this.getAvailableSlots);
    })

  }

  onDateChange(value: Date): void {


    let selectedDate = new Date(value);


    let formatDate = selectedDate.getDate() + '/' + (selectedDate.getMonth()+1) + '/' + selectedDate.getFullYear();
    this.bookASlotForm.controls.appointment_date.patchValue(formatDate);

    let selectedDay = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"][selectedDate.getDay()];

    let getSelectedYear = selectedDate.getFullYear();
    let getSelectedMonth = selectedDate.getMonth() + 1;
    let getSelectedDate = selectedDate.getDate();
    //this.getCurrentDay = ["Sunday","Monday","Tuesday","Wednesday","Thursday","Friday","Saturday"][new Date().getDay()]
    this.getAvailableSlotsByDay(selectedDay, formatDate);
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
