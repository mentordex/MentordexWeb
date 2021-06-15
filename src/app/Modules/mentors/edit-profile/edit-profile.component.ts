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

import { NgxUiLoaderService } from 'ngx-ui-loader';

import { DropzoneComponent, DropzoneDirective, DropzoneConfigInterface } from 'ngx-dropzone-wrapper';

export const minLengthArray = (min: number) => {
  return (c: AbstractControl): { [key: string]: any } => {
    if (c.value.length >= min)
      return null;

    return { MinLengthArray: true };
  }
}

@Component({
  selector: 'app-edit-profile',
  templateUrl: './edit-profile.component.html',
  styleUrls: ['./edit-profile.component.css']
})

export class EditProfileComponent implements OnInit {


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
  getWizardStep = 1;
  getWizardCompleteStep = 1;
  disabled: boolean = false
  id: any = '';
  mentorProfileDetails: any = {};
  endAcademicyears: any = [];
  endEmploymentyears: any = [];
  endAchievementyears: any = [];
  employmentStartYear: any = '';

  calculateProfilePercentage: any = 0;
  isCurrentlyWorkHereChecked: any = [];

  profileImagePath: any = 'assets/img/none.png';

  public profileImageConfiguration: DropzoneConfigInterface;
  public videoConfiguration: DropzoneConfigInterface;
  base64StringFile: any;

  minDate: Date;
  maxDate: Date;
  getCurrentDay: any = '';
  getCurrentDate: any = '';
  getSelectedDate: any = '';

  slots: any = [];
  selectedAvailabilityArray: any = [];
  selectedSlotsArray: any = [];
  selectedSlot: boolean = false;

  constructor(private zone: NgZone, private formBuilder: FormBuilder, private authService: AuthService, private utilsService: UtilsService, private router: Router, private activatedRoute: ActivatedRoute, private ngxLoader: NgxUiLoaderService) {
    this.minDate = new Date();
    this.maxDate = new Date();
    this.minDate.setDate(this.minDate.getDate());
    this.getCurrentDay = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"][new Date().getDay()]
    this.getCurrentDate = this.minDate.getDate() + '/' + (this.minDate.getMonth() + 1) + '/' + this.minDate.getFullYear();
    this.getSelectedDate = this.getCurrentDate;
    //this.hourlyRateForm.controls.availability.get('date').patchValue(this.getCurrentDate);
  }

  ngOnInit(): void {
    this.initalizeBasicDetailsForm();
    this.initalizeAcademicHistoryForm();
    this.initalizeEmploymentHistoryForm();
    this.initalizeAchievementsForm();
    this.initalizeHourlyRateForm();
    this.initalizeAddSocialLinksForm();
    this.videoIntroductionDropzoneInit();
    this.profileImageDropzoneInit();
    this.initalizeTimeSlots();
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

    this.employmentHistoryForm.patchValue({
      userID: this.id
    });

    this.achievementsForm.patchValue({
      userID: this.id
    });

    this.hourlyRateForm.patchValue({
      userID: this.id
    });

    this.addSocialLinksForm.patchValue({
      userID: this.id
    });

  }

  /**
   * get Mentor Details By Token
  */
  getMentorProfileDetailsByToken(id): void {
    this.utilsService.processPostRequest('getMentorProfileDetails', { userID: this.id }, true).pipe(takeUntil(this.onDestroy$)).subscribe((response) => {
      this.mentorProfileDetails = response;
      //console.log(this.mentorProfileDetails); return;
      if (this.mentorProfileDetails.admin_status == 'APPROVED' && this.mentorProfileDetails.subscription_status == 'ACTIVE') {

        this.basicDetailsForm.patchValue({
          bio: this.mentorProfileDetails.bio,
          tagline: this.mentorProfileDetails.tagline,
          servicable_zipcodes: this.mentorProfileDetails.servicable_zipcodes
        });

        if (this.mentorProfileDetails.bio && this.mentorProfileDetails.bio != "") {
          //console.log('sssss')
          this.calculateProfilePercentage = this.calculateProfilePercentage + 5;
        }

        if (this.mentorProfileDetails.tagline && this.mentorProfileDetails.tagline != "") {
          //console.log('hellwefo')
          this.calculateProfilePercentage = this.calculateProfilePercentage + 5;
        }

        if (this.mentorProfileDetails.servicable_zipcodes && this.mentorProfileDetails.servicable_zipcodes != "") {
          //console.log('hello')
          this.calculateProfilePercentage = this.calculateProfilePercentage + 5;
        }

        if (this.mentorProfileDetails.profile_image.length > 0) {
          //console.log('pello')
          this.profileImageArray.push(new FormControl(this.mentorProfileDetails.profile_image[0]));

          this.profileImagePath = this.mentorProfileDetails.profile_image[0].file_path;

          this.calculateProfilePercentage = this.calculateProfilePercentage + 5;

        }

        if (this.mentorProfileDetails.introduction_video.length > 0) {
          //console.log('yello')
          this.videoIntroudctionArray.push(new FormControl(this.mentorProfileDetails.introduction_video[0]));

          this.calculateProfilePercentage = this.calculateProfilePercentage + 5;
        }

        if (this.mentorProfileDetails.academics.length > 0) {
          //console.log('ayello')

          this.mentorProfileDetails.academics.forEach((element, index, academicsArray) => {
            this.addAcademic();
            this.academics().at(index).patchValue({
              institution_name: academicsArray[index].institution_name,
              grade: academicsArray[index].grade,
              area_of_study: academicsArray[index].area_of_study,
              degree: academicsArray[index].degree,
              start_year: academicsArray[index].start_year,
              end_year: academicsArray[index].end_year,
            })

            if (academicsArray[index].start_year != '') {
              this.onSelectAcademicStartYear(academicsArray[index].start_year, index)
            }

          });

          this.calculateProfilePercentage = this.calculateProfilePercentage + 15;

        } else {
          this.addAcademic();
        }


        if (this.mentorProfileDetails.employments.length > 0) {
          //console.log('aysello')
          this.mentorProfileDetails.employments.forEach((element, index, employmentsArray) => {
            this.addEmployment();
            this.employments().at(index).patchValue({
              company: employmentsArray[index].company,
              state: employmentsArray[index].state,
              city: employmentsArray[index].city,
              title: employmentsArray[index].title,
              description: employmentsArray[index].description,
              start_year: employmentsArray[index].start_year,
              end_year: employmentsArray[index].end_year,
            })

            if (employmentsArray[index].start_year != '') {
              this.employmentStartYear = employmentsArray[index].start_year;
              this.onSelectEmploymentStartYear(employmentsArray[index].start_year, index)
            }

            if (employmentsArray[index].end_year == 'Present') {
              //console.log('hello');

              this.endEmploymentyears[index] = [];
              this.isCurrentlyWorkHereChecked[index] = true;

              this.employments().at(index).patchValue({
                currently_work_here: true
              })


            }

          });

          this.calculateProfilePercentage = this.calculateProfilePercentage + 15;
        } else {
          this.addEmployment();
        }


        /* if ('availability' in this.mentorProfileDetails && this.mentorProfileDetails.availability.length > 0) {
          this.addAvailability();
        } else {
          this.addAvailability();
        } */


        if (this.mentorProfileDetails.achievements.length > 0) {
          //console.log('aysddello')
          this.mentorProfileDetails.achievements.forEach((element, index, achievementsArray) => {
            this.addAchievement();
            this.achievements().at(index).patchValue({
              title: achievementsArray[index].title,
              years_of_learning: achievementsArray[index].years_of_learning,
              associated_with: achievementsArray[index].associated_with,
              issuer: achievementsArray[index].issuer,
              start_year: achievementsArray[index].start_year,
              end_year: achievementsArray[index].end_year,
              description: achievementsArray[index].description,
            })

            if (achievementsArray[index].start_year != '') {
              this.onSelectAchievementStartYear(achievementsArray[index].start_year, index)
            }


          });

          this.calculateProfilePercentage = this.calculateProfilePercentage + 15;

        } else {
          this.addAchievement();
        }


        if (this.mentorProfileDetails.availability.length > 0) {
          this.mentorProfileDetails.availability.forEach((element, index, availabilityArray) => {
            this.availability().push(new FormControl({
              date: element.date,
              slots: element.slots
            }))

            this.selectedAvailabilityArray.push({
              date: element.date,
              slots: element.slots
            })
          })
        }


        this.hourlyRateForm.patchValue({
          hourly_rate: this.mentorProfileDetails.hourly_rate,
        });



        this.addSocialLinksForm.patchValue({
          website: this.mentorProfileDetails.website,
        });

        if (this.mentorProfileDetails.hourly_rate && this.mentorProfileDetails.hourly_rate != "") {
          //console.log('ayssello')
          this.calculateProfilePercentage = this.calculateProfilePercentage + 15;
        }

        if (this.mentorProfileDetails.website && this.mentorProfileDetails.website != "") {
          //console.log('ayselslo')
          this.calculateProfilePercentage = this.calculateProfilePercentage + 15;
        }


      }
      else {
        this.router.navigate(['/']);
      }


    })
  }

  //initalize Basic Detailsform
  private initalizeBasicDetailsForm() {
    this.basicDetailsForm = this.formBuilder.group({
      userID: [''],
      tagline: [''],
      bio: ['', Validators.compose([Validators.minLength(30), Validators.maxLength(1000), Validators.required])],
      servicable_zipcodes: new FormControl([{ value: '' }], minLengthArray(1)),
      profile_image: this.formBuilder.array([]),
      introduction_video: this.formBuilder.array([])
    });
  }


  //initalize Academic History form
  private initalizeAcademicHistoryForm() {
    this.academicHistoryForm = this.formBuilder.group({
      userID: [''],
      academics: this.formBuilder.array([], [minLengthArray(1)]),
    });
  }

  //initalize Academic History form
  private initalizeEmploymentHistoryForm() {
    this.employmentHistoryForm = this.formBuilder.group({
      userID: [''],
      employments: this.formBuilder.array([], [minLengthArray(1)]),
    });
  }

  //initalize Academic History form
  private initalizeAchievementsForm() {
    this.achievementsForm = this.formBuilder.group({
      userID: [''],
      achievements: this.formBuilder.array([], [minLengthArray(1)]),
    });
  }

  //initalize Academic History form
  private initalizeHourlyRateForm() {
    this.hourlyRateForm = this.formBuilder.group({
      userID: [''],
      hourly_rate: [''],
      availability: this.formBuilder.array([])
    });
  }

  //initalize Academic History form
  private initalizeAddSocialLinksForm() {
    this.addSocialLinksForm = this.formBuilder.group({
      userID: [''],
      website: [''],
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

        //componentObj.ngxLoader.start();
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
          //componentObj.utilsService.showPageLoader();//start showing page loader 

        });

        this.on("success", function (file, serverResponse) {
          //console.log('serverResponse', serverResponse);

          componentObj.zone.run(() => {
            componentObj.profileImageArray.push(new FormControl({ file_path: serverResponse.fileLocation, file_name: serverResponse.fileName, file_key: serverResponse.fileKey, file_mimetype: serverResponse.fileMimeType, file_category: 'profile_image' }));

            componentObj.profileImagePath = serverResponse.fileLocation;

            //componentObj.ngxLoader.stop();

          });

          //console.log('letterOfRecommendationPdfArray', componentObj.profileImageArray);
          this.removeFile(file);


        });

        this.on("error", function (file, serverResponse) {
          this.removeFile(file);
          componentObj.utilsService.onError(serverResponse);//hide page loader  
          //componentObj.utilsService.hidePageLoader();//hide page loader
          componentObj.zone.run(() => {
            //componentObj.ngxLoader.stop();
          });
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
        //componentObj.ngxLoader.start();

        if ((componentObj.videoIntroudctionArray.length + 1) > 1) {
          //componentObj.utilsService.onError('You cannot upload any more video.');//hide page loader
          componentObj.ngxLoader.stop();
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

        });

        this.on("success", function (file, serverResponse) {
          //console.log('serverResponse', serverResponse);

          componentObj.zone.run(() => {
            componentObj.videoIntroudctionArray.push(new FormControl({ file_path: serverResponse.fileLocation, file_name: serverResponse.fileName, file_key: serverResponse.fileKey, file_mimetype: serverResponse.fileMimeType, file_category: 'introduction_video' }));

          });

          //console.log('videoIntroudctionArray', componentObj.videoIntroudctionArray);
          this.removeFile(file);
          //componentObj.ngxLoader.stop();

        });

        this.on("error", function (file, serverResponse) {
          this.removeFile(file);
          componentObj.utilsService.onError(serverResponse);//hide page loader  
          //componentObj.ngxLoader.stop();
        });

      }
    };
  }

  /**
   * on Submit Basic Details
  */
  onSubmitBasicDetailsForm() {

    //console.log('basicDetailsForm', this.basicDetailsForm.value); 
    //console.log('basicDetailsForm', this.basicDetailsForm.controls.servicable_zipcodes.value);
    //return;
    if (this.basicDetailsForm.invalid) {
      this.isBasicDetailsFormSubmitted = true
      return false;
    }


    this.calculateProfilePercentage = 0;

    if (this.basicDetailsForm.controls.bio.value != '') {
      //console.log('1')
      this.calculateProfilePercentage = this.calculateProfilePercentage + 5;
    }

    if (this.basicDetailsForm.controls.tagline.value != '') {
      //console.log('1')
      this.calculateProfilePercentage = this.calculateProfilePercentage + 5;
    }


    if (this.basicDetailsForm.controls.servicable_zipcodes.value) {
      //console.log('3')
      this.calculateProfilePercentage = this.calculateProfilePercentage + 5;
    }

    if (this.profileImageArray.length > 0) {
      //console.log('4')
      this.calculateProfilePercentage = this.calculateProfilePercentage + 5;
    }

    if (this.videoIntroudctionArray.length > 0) {
      //console.log('5')
      this.calculateProfilePercentage = this.calculateProfilePercentage + 5;
    }

    this.utilsService.processPostRequest('updateProfileBasicDetails', this.basicDetailsForm.value, true, '').pipe(takeUntil(this.onDestroy$)).subscribe((response) => {
      //console.log(response);
      this.wizard.goToNextStep();
      this.getWizardStep = 2;
      this.getWizardCompleteStep = 2;
    })

  }

  /**
  * on Submit Academic History
 */
  onSubmitAcademicHistoryForm() {
    //console.log(this.checkProperties(this.academics().value));
    //console.log(this.academicHistoryForm.value); return;

    if (this.academicHistoryForm.invalid) {
      this.isAcademicHistoryFormSubmitted = true
      return false;
    }

    if (this.academics().length > 0) {
      this.calculateProfilePercentage = this.calculateProfilePercentage + 15;
    }

    this.utilsService.processPostRequest('updateProfileAcademicHistoryDetails', this.academicHistoryForm.value, true, '').pipe(takeUntil(this.onDestroy$)).subscribe((response) => {
      //console.log(response);
      this.wizard.goToNextStep();
      this.getWizardStep = 3;
      this.getWizardCompleteStep = 3;
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

    if (this.employments().length > 0) {
      this.calculateProfilePercentage = this.calculateProfilePercentage + 15;
    }

    this.utilsService.processPostRequest('updateProfileEmploymentHistoryDetails', this.employmentHistoryForm.value, true, '').pipe(takeUntil(this.onDestroy$)).subscribe((response) => {
      //console.log(response);
      this.wizard.goToNextStep();
      this.getWizardStep = 4;
      this.getWizardCompleteStep = 4;
    })
  }

  /**
  * on Submit Employment History
 */
  onSubmitAchievementsForm() {
    if (this.achievementsForm.invalid) {
      this.isAchievementsFormSubmitted = true
      return false;
    }

    if (this.achievements().length > 0) {
      this.calculateProfilePercentage = this.calculateProfilePercentage + 15;
    }


    //console.log(this.achievementsForm.value); return;

    this.utilsService.processPostRequest('updateProfileAchievementDetails', this.achievementsForm.value, true, '').pipe(takeUntil(this.onDestroy$)).subscribe((response) => {
      //console.log(response);
      this.wizard.goToNextStep();
      this.getWizardStep = 5;
      this.getWizardCompleteStep = 5;
    })
  }

  /**
  * on Submit Employment History
 */
  onSubmitHourlyRateForm() {
    if (this.hourlyRateForm.invalid) {
      this.isHourlyRateFormSubmitted = true
      return false;
    }

    if (this.hourlyRateForm.controls.hourly_rate.value != '') {
      this.calculateProfilePercentage = this.calculateProfilePercentage + 15;
    }

    //console.log(this.hourlyRateForm.value); return;

    this.utilsService.processPostRequest('updateProfileHourlyRateDetails', this.hourlyRateForm.value, true, '').pipe(takeUntil(this.onDestroy$)).subscribe((response) => {
      //console.log(response);
      this.wizard.goToNextStep();
      this.getWizardStep = 6;
      this.getWizardCompleteStep = 6;
    })
  }

  /**
  * on Submit Employment History
 */
  onSubmitAddSocialLinksForm() {
    if (this.addSocialLinksForm.invalid) {
      this.isAddSocialLinksFormSubmitted = true
      return false;
    }

    if (this.addSocialLinksForm.controls.website.value != '') {
      this.calculateProfilePercentage = this.calculateProfilePercentage + 15;
    }

    //console.log(this.achievementsForm.value); return;

    this.utilsService.processPostRequest('updateProfileSocialLinksDetails', this.addSocialLinksForm.value, true, '').pipe(takeUntil(this.onDestroy$)).subscribe((response) => {

      this.router.navigate(['/mentor/my-profile']);
    })
  }


  academics(): FormArray {
    return this.academicHistoryForm.get("academics") as FormArray
  }

  newAcademics(): FormGroup {
    return this.formBuilder.group({
      institution_name: ['', Validators.compose([Validators.minLength(2), Validators.maxLength(100)])],
      grade: [''],
      area_of_study: ['', Validators.compose([Validators.minLength(2), Validators.maxLength(100)])],
      degree: ['', Validators.compose([Validators.minLength(2), Validators.maxLength(100)])],
      start_year: [{ value: '' }],
      end_year: [{ value: '' }],
    })
  }

  addAcademic() {
    this.academics().push(this.newAcademics());
  }

  removeAcademic(i: number) {
    this.academics().removeAt(i);
  }

  achievements(): FormArray {
    return this.achievementsForm.get("achievements") as FormArray
  }

  newAchievement(): FormGroup {
    return this.formBuilder.group({
      title: ['', Validators.compose([Validators.minLength(2), Validators.maxLength(100)])],
      years_of_learning: ['', Validators.compose([Validators.minLength(1), Validators.maxLength(20)])],
      associated_with: ['', Validators.compose([Validators.minLength(2), Validators.maxLength(100)])],
      issuer: ['', Validators.compose([Validators.minLength(2), Validators.maxLength(100)])],
      start_year: [{ value: '' }],
      end_year: [{ value: '' }],
      description: ['', Validators.compose([Validators.minLength(2), Validators.maxLength(500)])],
    })
  }

  addAchievement() {
    this.achievements().push(this.newAchievement());
  }

  removeAchievement(i: number) {
    this.achievements().removeAt(i);
  }

  employments(): FormArray {
    return this.employmentHistoryForm.get("employments") as FormArray
  }

  newEmployments(): FormGroup {
    return this.formBuilder.group({
      company: ['', Validators.compose([Validators.minLength(2), Validators.maxLength(100)])],
      city: ['', Validators.compose([Validators.minLength(2), Validators.maxLength(100)])],
      state: [''],
      title: ['', Validators.compose([Validators.minLength(2), Validators.maxLength(100)])],
      start_year: [''],
      end_year: [''],
      currently_work_here: [false],
      description: ['', Validators.compose([Validators.minLength(2), Validators.maxLength(500)])],
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

  public get years() {
    var currentYear = new Date().getFullYear(), years = [];
    let startYear = currentYear - 60;
    while (startYear <= currentYear) {
      years.push(startYear++);
    }

    //this.endyears = years;

    return years;
  }


  public onSelectAcademicStartYear(start_year, i) {


    this.zone.run(() => {

      if (start_year != '') {
        this.endAcademicyears[i] = [];
        var currentYear = new Date().getFullYear(), years = [];
        let startYear = start_year;
        while (startYear <= currentYear) {
          this.endAcademicyears[i].push(startYear++);
        }
      }
    });
    //
  }

  public onSelectEmploymentStartYear(start_year, i) {


    this.zone.run(() => {

      if (start_year != '') {
        this.endEmploymentyears[i] = [];
        var currentYear = new Date().getFullYear(), years = [];
        let startYear = start_year;
        while (startYear <= currentYear) {
          this.endEmploymentyears[i].push(startYear++);
        }

        this.employmentStartYear = start_year;
        this.isCurrentlyWorkHereChecked[i] = false;

      }
    });
    //
  }

  public onSelectAchievementStartYear(start_year, i) {


    this.zone.run(() => {

      if (start_year != '') {
        this.endAchievementyears[i] = [];
        var currentYear = new Date().getFullYear(), years = [];
        let startYear = start_year;
        while (startYear <= currentYear) {
          this.endAchievementyears[i].push(startYear++);
        }
      }
    });
    //
  }

  onSelectCurrentlyWorkHere(e) {
    let formGroupIndex = e.target.getAttribute('data-formGroupIndex');
    let startYear = e.target.getAttribute('data-startYear');
    if (e.target.checked) {

      this.employments().at(formGroupIndex).patchValue({
        end_year: 'Present',
        currently_work_here: true
      })

      this.endEmploymentyears[formGroupIndex] = [];
      this.isCurrentlyWorkHereChecked[formGroupIndex] = true;

    } else {

      this.employments().at(formGroupIndex).patchValue({
        end_year: '',
        currently_work_here: false
      })

      this.onSelectEmploymentStartYear(startYear, formGroupIndex)
      this.isCurrentlyWorkHereChecked[formGroupIndex] = false;
    }
  }

  availability(): FormArray {
    return this.hourlyRateForm.get("availability") as FormArray
  }

  newAvailability(): FormGroup {
    return this.formBuilder.group({
      date: [''],
      slots: this.formBuilder.array([])
    })
  }

  addAvailability() {
    this.availability().push(this.newAvailability());
  }

  initalizeTimeSlots() {
    for (var i = 0; i < 12; i++) {
      var amTimeFormat = 'AM';
      var pmTimeFormat = 'PM';
      i = (i < 9) ? parseInt(`0${i}`) : i;


      if (i < 9) {
        var j = (i == 0) ? '12' : `0${i}`
        this.slots.push({ slot: `${j}:00 ${amTimeFormat} - 0${i + 1}:00 ${amTimeFormat}`, isChecked: false })
      } else if (i == 9) {
        this.slots.push({ slot: `0${i}:00 ${amTimeFormat} - ${i + 1}:00 ${amTimeFormat}`, isChecked: false })
      } else {
        if (i >= 11) {
          this.slots.push({ slot: `${i}:00 ${amTimeFormat} - ${i + 1}:00 ${pmTimeFormat}`, isChecked: false })
        } else {
          this.slots.push({ slot: `${i}:00 ${amTimeFormat} - ${i + 1}:00 ${amTimeFormat}`, isChecked: false })
        }

      }

    }

    for (var i = 0; i < 12; i++) {
      var amTimeFormat = 'AM';
      var pmTimeFormat = 'PM';
      i = (i < 9) ? parseInt(`0${i}`) : i;


      if (i < 9) {
        var j = (i == 0) ? '12' : `0${i}`
        this.slots.push({ slot: `${j}:00 ${pmTimeFormat} - 0${i + 1}:00 ${pmTimeFormat}`, isChecked: false })
      } else if (i == 9) {
        this.slots.push({ slot: `0${i}:00 ${pmTimeFormat} - ${i + 1}:00 ${pmTimeFormat}`, isChecked: false })
      } else {
        if (i >= 11) {
          this.slots.push({ slot: `${i}:00 ${pmTimeFormat} - ${i + 1}:00 ${amTimeFormat}`, isChecked: false })
        } else {
          this.slots.push({ slot: `${i}:00 ${pmTimeFormat} - ${i + 1}:00 ${pmTimeFormat}`, isChecked: false })
        }

      }

    }

    //console.log(this.slots);

  }

  onCheckboxChange(e) {
    //const slots: FormArray = this.availability().get('slots') as FormArray;
    if (e.target.checked) {
      //slots.push(new FormControl({ value: e.target.value, isChecked: true }));
      this.selectedSlotsArray.push({ value: e.target.value, isChecked: true });
    } else {
      /* let i: number = 0;
      slots.controls.forEach((item: FormControl) => {
        //console.log(item);
        if (item.value.value == e.target.value) {
          slots.removeAt(i);
          return;
        }
        i++;
      }); */

      this.selectedSlotsArray = this.selectedSlotsArray.filter(function (item) {
        return item.value !== e.target.value;
      });
    }

    //console.log(slots);
  }

  onDateChange(value: Date): void {
    let selectedDate = new Date(value);
    let formatDate = selectedDate.getDate() + '/' + (selectedDate.getMonth() + 1) + '/' + selectedDate.getFullYear();
    this.getSelectedDate = formatDate;
    //this.hourlyRateForm.controls.availability.get('date').patchValue(formatDate);
  }

  onSubmitSaveAndAddMore(): void {
    if (this.selectedSlotsArray.length > 0) {
      let found = this.selectedAvailabilityArray.some(el => el.date === this.getSelectedDate);
      if (!found) {
        this.availability().push(new FormControl({
          date: this.getSelectedDate,
          slots: this.selectedSlotsArray
        }))

        this.selectedAvailabilityArray.push({
          date: this.getSelectedDate,
          slots: this.selectedSlotsArray
        })

        this.slots = [];
        this.initalizeTimeSlots();
        this.selectedSlotsArray = [];

      } else {

        //console.log('hello')
        //console.log(this.getSelectedDate)
        //console.log(this.selectedAvailabilityArray);


        let selectedDate = this.getSelectedDate;

        let i: number = 0;
        this.availability().controls.forEach((item: FormControl) => {
          //console.log(item);
          if (item.value.date == this.getSelectedDate) {
            this.availability().removeAt(i);
            return;
          }
          i++;
        });

        this.selectedAvailabilityArray = this.selectedAvailabilityArray.filter(function (item) {
          //console.log(item);
          //console.log(this.getSelectedDate);
          return item.date !== selectedDate;
        });


        this.availability().push(new FormControl({
          date: this.getSelectedDate,
          slots: this.selectedSlotsArray
        }))

        this.selectedAvailabilityArray.push({
          date: this.getSelectedDate,
          slots: this.selectedSlotsArray
        })
        this.slots = [];
        this.initalizeTimeSlots();

        this.selectedSlotsArray = [];


      }


    }
    //console.log(this.availability().value);
    //console.log(this.selectedAvailabilityArray);
  }

  gotoStep(desinationIndex): void {

    if (desinationIndex == 0) {
      this.calculateProfilePercentage = 0;
    } else {
      this.calculateProfilePercentage = this.calculateProfilePercentage - 15
    }

    this.wizard.goToStep(desinationIndex);
  }

  goToSelectedStep(desinationIndex): void {
    //console.log(desinationIndex);
    //this.wizard.goToStep(desinationIndex);
    //this.getWizardStep = desinationIndex + 1;
  }


  /**
* set check object array length.
* @param object
*  @return number
*/
  public checkObjectLength(object): number {
    return Object.keys(object).length;
  }

  public isEmpty(obj) {
    return Object.keys(obj).length === 0;
  }

  public checkProperties(obj) {
    //console.log(obj)
    obj.forEach((element, index) => {
      console.log('element', element);
      return this.isEmpty(element);
    })
    //return false;
  }

  //destroy all subscription
  public ngOnDestroy(): void {
    this.onDestroy$.next();
  }


}
