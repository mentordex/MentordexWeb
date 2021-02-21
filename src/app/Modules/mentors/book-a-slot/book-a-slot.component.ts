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
  getCurrentDate: Date = new Date();
  minDate: Date = new Date();
  maxDate: Date;
  base64StringFile: any;
  disabled: boolean = false

  public letterOfRecommendationConfiguration: DropzoneConfigInterface;

  constructor(private activatedRoute: ActivatedRoute, private formBuilder: FormBuilder, private authService: AuthService, private utilsService: UtilsService, private router: Router, private zone: NgZone) { }

  ngOnInit(): void {
    this.initalizeBookASlotForm();
    this.checkQueryParam();
    this.letterOfRecommendationDropzoneInit();
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
      references: this.formBuilder.array([this.newReferences()]),
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
      contact_number: [undefined, [Validators.required]],
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
      url: environment.API_ENDPOINT + "/api/uploadImage",
      maxFiles: 3,
      autoReset: null,
      errorReset: null,
      cancelReset: null,
      acceptedFiles: '.jpg, .png, .jpeg, .pdf',
      maxFilesize: 2, // MB,
      dictDefaultMessage: '<span class="button">Upload File</span>',
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
          //componentObj.commonUtilsService.onError('You cannot upload any more files.');
          //this.removeFile(file);
          return false;
        }

        const reader = new FileReader();
        const _this = this
        reader.onload = function (event) {

          let base64String = reader.result
          let fileExtension = (file.name).split('.').pop();

          componentObj.base64StringFile = reader.result;
          if (fileExtension == "pdf") {
            componentObj.base64StringFile = componentObj.base64StringFile.replace('data:application/pdf;base64,', '');
          }
          //componentObj.pageLoaderService.pageLoader(true);//start showing page loader
          done();

        };
        reader.readAsDataURL(file);
      },
      init: function () {


        this.on('sending', function (file, xhr, formData) {

          formData.append('folder', 'LOR');
          formData.append('fileType', file.type);
          formData.append('base64StringFile', componentObj.base64StringFile);
        });


        this.on("totaluploadprogress", function (progress) {
          //componentObj.pageLoaderService.pageLoader(true);//start showing page loader
          //componentObj.pageLoaderService.setLoaderText('Uploading file ' + parseInt(progress) + '%');//setting loader text
          if (progress >= 100) {
            //componentObj.pageLoaderService.pageLoader(false); //hide page loader
          }
        })

        this.on("success", function (file, serverResponse) {


          componentObj.zone.run(() => {
            componentObj.letterOfRecommendationPdfArray.push(new FormControl({ file_path: serverResponse.fileLocation, file_name: serverResponse.fileName, file_key: serverResponse.fileKey, file_mimetype: serverResponse.fileMimeType, file_category: 'LOR' }));
          });

          this.removeFile(file);

          //componentObj.pageLoaderService.pageLoader(false); //hide page loader
        });

        this.on("error", function (file, serverResponse) {
          this.removeFile(file);
          //componentObj.pageLoaderService.pageLoader(false);//hide page loader  
          //componentObj.toastr.errorToastr(serverResponse, 'Oops!');
        });

      }
    };
  }

  /**
   * get Mentor Details By Token
  */
  getMentorDetailsByToken(id): void {
    this.utilsService.processPostRequest('getMentorDetails', { userID: this.id }, true).pipe(takeUntil(this.onDestroy$)).subscribe((response) => {


    })
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
