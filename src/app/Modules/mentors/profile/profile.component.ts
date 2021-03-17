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
  id: any = '';
  mentorProfileDetails: any = {};

  profileImagePath: any = 'assets/img/image.png';

  public profileImageConfiguration: DropzoneConfigInterface;
  public videoConfiguration: DropzoneConfigInterface;
  base64StringFile: any;

  constructor(private zone: NgZone, private formBuilder: FormBuilder, private authService: AuthService, private utilsService: UtilsService, private router: Router, private activatedRoute: ActivatedRoute) { }

  ngOnInit(): void {

    this.initalizeBasicDetailsForm();
    this.initalizeAcademicHistoryForm();
    this.initalizeEmploymentHistoryForm();
    this.videoIntroductionDropzoneInit();
    this.profileImageDropzoneInit();
    this.checkQueryParam();
  }

  private checkQueryParam() {
    this.id = localStorage.getItem('x-user-ID');
    this.getMentorProfileDetailsByToken(this.id);
    this.basicDetailsForm.patchValue({
      userID: this.id
    });

    this.academicHistoryForm.patchValue({
      userID: this.id
    });

  }

  /**
   * get Mentor Details By Token
  */
  getMentorProfileDetailsByToken(id): void {
    this.utilsService.processPostRequest('getMentorProfileDetails', { userID: this.id }, true).pipe(takeUntil(this.onDestroy$)).subscribe((response) => {
      this.mentorProfileDetails = response;
      console.log(response);
      this.basicDetailsForm.patchValue({
        bio: this.mentorProfileDetails.bio,
        tagline: this.mentorProfileDetails.tagline,
        servicable_zipcodes: this.mentorProfileDetails.servicable_zipcodes
      });

      if(this.mentorProfileDetails.profile_image.length > 0){
        this.profileImageArray.push(new FormControl(this.mentorProfileDetails.profile_image[0]));

        this.profileImagePath = this.mentorProfileDetails.profile_image[0].file_path;
      }

      if(this.mentorProfileDetails.introduction_video.length > 0){
        this.videoIntroudctionArray.push(new FormControl(this.mentorProfileDetails.introduction_video[0]));
      }
      /*
      this.academicHistoryForm.patchValue({
        academics: this.mentorProfileDetails.academics
      }); 
      */

     const formGroups = this.mentorProfileDetails.academics.map(x => ({
      institution_name: x.institution_name
     }));

    console.log(formGroups)
    this.academics().push(formGroups)
      
      //const academics: FormArray = this.academicHistoryForm.get('academics') as FormArray;
      /*this.mentorProfileDetails.academics.forEach(element => {
        //console.log(element)

        this.academics().get('institution_name').patchValue(element.institution_name);

        this.academics().push(new FormControl({
          institution_name: element.institution_name
        }));
      }); */
      
      

      console.log(this.academicHistoryForm.value);
    })
  }

  //initalize Basic Detailsform
  private initalizeBasicDetailsForm() {
    this.basicDetailsForm = this.formBuilder.group({
      userID: [''],
      tagline: [''],
      bio: ['', Validators.compose([Validators.minLength(30), Validators.maxLength(500), Validators.required])],
      servicable_zipcodes: new FormControl([{ value: '' }], minLengthArray(1)),
      profile_image: this.formBuilder.array([]),
      introduction_video: this.formBuilder.array([])
    });
  }


  //initalize Academic History form
  private initalizeAcademicHistoryForm() {
    this.academicHistoryForm = this.formBuilder.group({
      userID: [''],
      academics: this.formBuilder.array([this.newAcademics()], [minLengthArray(1)]),
    });
  }

  //initalize Academic History form
  private initalizeEmploymentHistoryForm() {
    this.employmentHistoryForm = this.formBuilder.group({
      userID: [''],
      employments: this.formBuilder.array([this.newEmployments()], [minLengthArray(1)]),
    });
  }

  get profileImageArray(): FormArray {
    return this.basicDetailsForm.get('profile_image') as FormArray;
  }

  get videoIntroudctionArray(): FormArray {
    return this.basicDetailsForm.get('introduction_video') as FormArray;
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
      dictDefaultMessage: '<span class="button actual-upload-btn"><svg class="mr-2" width="15" height="15" viewBox="0 0 15 15" fill="none"><path d="M7.49961 1.59998L10.9663 4.79998M7.49961 1.59998L4.29961 4.79998M7.49961 1.59998V11.7333M13.8996 7.46664V14.4H1.09961V7.46664" stroke="#384047"></path></svg><span>Upload File</span></span>',
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
      dictDefaultMessage: '<span class="button actual-upload-btn"><svg class="mr-2" width="15" height="15" viewBox="0 0 15 15" fill="none"><path d="M7.49961 1.59998L10.9663 4.79998M7.49961 1.59998L4.29961 4.79998M7.49961 1.59998V11.7333M13.8996 7.46664V14.4H1.09961V7.46664" stroke="#384047"></path></svg><span>Upload File</span></span>',
      //previewsContainer: "#offerInHandsPreview",
      addRemoveLinks: true,
      //resizeWidth: 125,
      //resizeHeight: 125,
      //createImageThumbnails:false,
      dictInvalidFileType: 'Only valid mp4, mov, webm and avi file is accepted.',
      dictFileTooBig: 'Maximum upload file size limit is 5MB',
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

          formData.append('folder', 'introduction_video');
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
          //console.log('serverResponse', serverResponse);

          componentObj.zone.run(() => {
            componentObj.videoIntroudctionArray.push(new FormControl({ file_path: serverResponse.fileLocation, file_name: serverResponse.fileName, file_key: serverResponse.fileKey, file_mimetype: serverResponse.fileMimeType, file_category: 'introduction_video' }));
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

    //console.log('basicDetailsForm', this.basicDetailsForm.value); return;
    if (this.basicDetailsForm.invalid) {
      this.isBasicDetailsFormSubmitted = true
      return false;
    }
    this.utilsService.processPostRequest('updateProfileBasicDetails', this.basicDetailsForm.value, true, '').pipe(takeUntil(this.onDestroy$)).subscribe((response) => {
      //console.log(response);
      this.wizard.goToNextStep();
    })

  }

  /**
  * on Submit Academic History
 */
  onSubmitAcademicHistoryForm() {
    console.log(this.academicHistoryForm.value); return;

    if (this.academicHistoryForm.invalid) {
      this.isAcademicHistoryFormSubmitted = true
      return false;
    }

    this.utilsService.processPostRequest('updateProfileAcademicHistoryDetails', this.academicHistoryForm.value, true, '').pipe(takeUntil(this.onDestroy$)).subscribe((response) => {
      //console.log(response);

      this.wizard.goToNextStep();
    })
  }

  /**
  * on Submit Employment History
 */
  onSubmitEmploymentHistoryForm() {
    if (this.employmentHistoryForm.invalid) {
      this.isEmploymentHistoryFormSubmitted = true
      return false;
    }

    this.utilsService.processPostRequest('updateProfileEmploymentHistoryDetails', this.employmentHistoryForm.value, true, '').pipe(takeUntil(this.onDestroy$)).subscribe((response) => {
      //console.log(response);
      this.wizard.goToNextStep();
    })
  }


  academics(): FormArray {
    return this.academicHistoryForm.get("academics") as FormArray
  }

  newAcademics(): FormGroup {
    return this.formBuilder.group({
      institution_name: ['', Validators.compose([Validators.required, Validators.minLength(2), Validators.maxLength(100)])],
      grade: [''],
      area_of_study: ['', Validators.compose([Validators.minLength(2), Validators.maxLength(100)])],
      degree: ['', Validators.compose([Validators.minLength(2), Validators.maxLength(100)])],
      start_year: [''],
      end_year: [''],
    })
  }

  addAcademic() {
    this.academics().push(this.newAcademics());
  }

  removeAcademic(i: number) {
    this.academics().removeAt(i);
  }

  employments(): FormArray {
    return this.employmentHistoryForm.get("employments") as FormArray
  }

  newEmployments(): FormGroup {
    return this.formBuilder.group({
      company: ['', Validators.compose([Validators.required, Validators.minLength(2), Validators.maxLength(100)])],
      city: ['', Validators.compose([Validators.required, Validators.minLength(2), Validators.maxLength(100)])],
      state: ['', Validators.compose([Validators.required])],
      title: ['', Validators.compose([Validators.required, Validators.minLength(2), Validators.maxLength(100)])],
      start_year: [''],
      end_year: [''],
      description: ['', Validators.compose([Validators.required, Validators.minLength(2), Validators.maxLength(200)])],
    })
  }

  addEmployment() {
    this.employments().push(this.newEmployments());
  }

  removeEmployment(i: number) {
    this.employments().removeAt(i);
  }

  /**
   * remove PDF
   * @param index index of the image array
   * @return  boolean
   */
  removeFile(index, file_category, file_key): void {

    this.videoIntroudctionArray.removeAt(index);
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
      this.videoIntroudctionArray.reset();
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
