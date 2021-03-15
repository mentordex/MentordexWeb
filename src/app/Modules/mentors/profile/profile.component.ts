import { Component, OnInit, OnDestroy, ViewChild, NgZone } from '@angular/core';
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

import { DropzoneComponent, DropzoneDirective, DropzoneConfigInterface } from 'ngx-dropzone-wrapper';

export const minLengthArray = (min: number) => {
  return (c: AbstractControl): { [key: string]: any } => {
    if (c.value.length >= min)
      return null;

    return { MinLengthArray: true };
  }
}

@Component({
  selector: 'app-profile',
  templateUrl: './profile.component.html',
  styleUrls: ['./profile.component.css']
})
export class ProfileComponent implements OnInit {

  @ViewChild(WizardComponent)
  public wizard: WizardComponent;

  private onDestroy$: Subject<void> = new Subject<void>();
  basicDetailsForm: FormGroup;
  academicHistoryForm: FormGroup;
  employmentHistoryForm: FormGroup;
  achievementsForm: FormGroup;
  hourlyRateForm: FormGroup;
  addSocialLinksForm: FormGroup;

  isBasicDetailsFormSubmitted: boolean = false
  isAcademicHistoryFormSubmitted: boolean = false
  isEmploymentHistoryFormSubmitted: boolean = false
  isAchievementsFormSubmitted: boolean = false
  isHourlyRateFormSubmitted: boolean = false
  isAddSocialLinksFormSubmitted: boolean = false
  wizardStep = 0;
  disabled: boolean = false

  profileImagePath: any = 'assets/img/image.png';

  public profileImageConfiguration: DropzoneConfigInterface;
  public videoConfiguration: DropzoneConfigInterface;
  base64StringFile: any;

  constructor(private zone: NgZone, private formBuilder: FormBuilder, private authService: AuthService, private utilsService: UtilsService, private router: Router, private activatedRoute: ActivatedRoute) { }

  ngOnInit(): void {
    this.initalizeBasicDetailsForm();
    this.initalizeAcademicHistoryForm();
    this.videoIntroductionDropzoneInit();
    this.profileImageDropzoneInit();
  }

  //initalize Basic Detailsform
  private initalizeBasicDetailsForm() {
    this.basicDetailsForm = this.formBuilder.group({
      userID: [''],
      tagline: [''],
      bio: ['', Validators.compose([Validators.minLength(30), Validators.maxLength(500)])],
      profile_image: this.formBuilder.array([]),
      video_introduction: this.formBuilder.array([])
    });
  }


  //initalize Academic History form
  private initalizeAcademicHistoryForm() {
    this.academicHistoryForm = this.formBuilder.group({
      userID: [''],
      academic: this.formBuilder.array([this.newAcademic()], [minLengthArray(2)]),
    });
  }

  get profileImageArray(): FormArray {
    return this.basicDetailsForm.get('profile_image') as FormArray;
  }

  get videoIntroudctionArray(): FormArray {
    return this.basicDetailsForm.get('video_introduction') as FormArray;
  }

  /**
  * Initialize Dropzone Library(Profile Image Upload).
  */
  private profileImageDropzoneInit() {
    const componentObj = this;
    this.profileImageConfiguration = {
      clickable: true,
      paramName: "file",
      uploadMultiple: false,
      url: environment.API_ENDPOINT + "/api/uploadFile",
      maxFiles: 1,
      autoReset: null,
      errorReset: null,
      cancelReset: null,
      acceptedFiles: '.jpg, .png, .jpeg, .svg',
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

        componentObj.profileImageArray.reset();

        /* 
        if ((componentObj.profileImageArray.length + 1) > 1) {
          componentObj.utilsService.onError('You cannot upload any more files.');//hide page loader          
          this.removeFile(file);
          return false;
        }
        */

        const reader = new FileReader();
        reader.onload = function (event) {

          let base64String = reader.result
          let fileExtension = (file.name).split('.').pop();

          componentObj.base64StringFile = reader.result;
          componentObj.utilsService.showPageLoader();//start showing page loader
          done();
        };
        reader.readAsDataURL(file);
      },
      init: function () {


        this.on('sending', function (file, xhr, formData) {

          formData.append('folder', 'profile_image');
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
            componentObj.profileImageArray.push(new FormControl({ file_path: serverResponse.fileLocation, file_name: serverResponse.fileName, file_key: serverResponse.fileKey, file_mimetype: serverResponse.fileMimeType, file_category: 'profile_image' }));

            componentObj.profileImagePath = serverResponse.fileLocation;

          });

          //console.log('letterOfRecommendationPdfArray', componentObj.profileImageArray);
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
  * Initialize Dropzone Library(Video Upload).
  */
  private videoIntroductionDropzoneInit() {
    const componentObj = this;
    this.videoConfiguration = {
      clickable: true,
      paramName: "file",
      uploadMultiple: false,
      url: environment.API_ENDPOINT + "/api/uploadFile",
      maxFiles: 1,
      autoReset: null,
      errorReset: null,
      cancelReset: null,
      acceptedFiles: '.mp4, .mov, .webm, .avi',
      maxFilesize: 5, // MB,
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


        if ((componentObj.videoIntroudctionArray.length + 1) > 1) {
          componentObj.utilsService.onError('You cannot upload any more video.');//hide page loader          
          this.removeFile(file);
          return false;
        }

        const reader = new FileReader();
        reader.onload = function (event) {

          let base64String = reader.result
          let fileExtension = (file.name).split('.').pop();

          componentObj.base64StringFile = reader.result;
          componentObj.utilsService.showPageLoader();//start showing page loader
          done();
        };
        reader.readAsDataURL(file);
      },
      init: function () {


        this.on('sending', function (file, xhr, formData) {

          formData.append('folder', 'video_introduction');
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
            componentObj.videoIntroudctionArray.push(new FormControl({ file_path: serverResponse.fileLocation, file_name: serverResponse.fileName, file_key: serverResponse.fileKey, file_mimetype: serverResponse.fileMimeType, file_category: 'video_introduction' }));
          });

          //console.log('videoIntroudctionArray', componentObj.videoIntroudctionArray);
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
   * on Submit Basic Details
  */
  onSubmitBasicDetailsForm() {

    if (this.basicDetailsForm.invalid) {
      this.isBasicDetailsFormSubmitted = true
      return false;
    }

    this.wizard.goToNextStep();

    //console.log('basicDetailsForm', this.basicDetailsForm.value);
    /*
    this.utilsService.processPostRequest('updateBasicDetails', this.basicDetailsForm.value, true, '').pipe(takeUntil(this.onDestroy$)).subscribe((response) => {
      console.log(response);
      //this.utilsService.onResponse('Your information updated successfully.', true);
      this.router.navigate(['/mentor/skills']);
    })
  
    */
  }

   /**
   * on Submit Basic Details
  */
 onSubmitAcademicHistoryForm() {

  if (this.academicHistoryForm.invalid) {
    this.isAcademicHistoryFormSubmitted = true
    return false;
  }

  this.wizard.goToNextStep();

  
}


  academics(): FormArray {
    return this.academicHistoryForm.get("academic") as FormArray
  }

  newAcademic(): FormGroup {
    return this.formBuilder.group({
      name: ['', Validators.compose([Validators.required, Validators.minLength(2), Validators.maxLength(20)])],
      relation: ['', Validators.compose([Validators.required, Validators.minLength(2), Validators.maxLength(20)])],
      job_title: ['', Validators.compose([Validators.required, Validators.minLength(2), Validators.maxLength(50)])],
      workplace_name: ['', Validators.compose([Validators.required, Validators.minLength(2), Validators.maxLength(50)])],
      contact_number: ['', [Validators.required, Validators.pattern("^[0-9]*$"), Validators.minLength(10), Validators.maxLength(10)]],
      email: ['', [Validators.required, Validators.pattern("^[a-z0-9._%+-]+@[a-z0-9.-]+\\.[a-z]{2,4}$")]],
    })
  }

  addAcademic() {
    this.academics().push(this.newAcademic());
  }

  removeAcademic(i: number) {
    this.academics().removeAt(i);
  }

}
