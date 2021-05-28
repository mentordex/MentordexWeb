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

import { SearchCountryField, TooltipLabel, CountryISO, PhoneNumberFormat } from 'ngx-intl-tel-input';

import { DropzoneComponent, DropzoneDirective, DropzoneConfigInterface } from 'ngx-dropzone-wrapper';

import { NgxUiLoaderService } from 'ngx-ui-loader';

@Component({
  selector: 'app-profile',
  templateUrl: './profile.component.html',
  styleUrls: ['./profile.component.css'],
  animations: [fadeInAnimation],
  host: { '[@fadeInAnimation]': '' }
})
export class ProfileComponent implements OnInit {

  private onDestroy$: Subject<void> = new Subject<void>();
  id: any = '';

  profileForm: FormGroup;
  isProfileFormSubmitted: boolean = false

  SearchCountryField = SearchCountryField;
  TooltipLabel = TooltipLabel;
  CountryISO = CountryISO;
  PhoneNumberFormat = PhoneNumberFormat;
  preferredCountries: CountryISO[] = [CountryISO.UnitedStates];
  onlyCountries: CountryISO[] = [CountryISO.UnitedStates];

  countryArrayListing: any = [];
  stateArrayListing: any = [];
  cityArrayListing: any = [];

  countries: any = [];
  states: any = [];
  cities: any = [];
  zipcodes: any = [];
  parentDetails: any = {};

  stateValue: any = '';
  cityValue: any = '';
  zipcodeValue: any = '';

  profileImagePath: any = 'assets/img/none.png';

  public profileImageConfiguration: DropzoneConfigInterface;
  base64StringFile: any;
  disabled: boolean = false

  constructor(private zone: NgZone, private formBuilder: FormBuilder, private authService: AuthService, private utilsService: UtilsService, private router: Router, private activatedRoute: ActivatedRoute, private ngxLoader: NgxUiLoaderService) { }

  ngOnInit(): void {
    this.initalizeProfileForm();
    this.checkQueryParam();
    this.getCountryListing();
    this.profileImageDropzoneInit();
  }

  private checkQueryParam() {
    this.ngxLoader.start();

    this.id = localStorage.getItem('x-user-ID');

    this.getParentDetailsByToken(this.id);

    
  }

  private initalizeProfileForm() {
    this.profileForm = this.formBuilder.group({
      userID: [''],
      first_name: ['', Validators.compose([Validators.required, Validators.minLength(2), Validators.maxLength(20)])],
      last_name: ['', Validators.compose([Validators.required, Validators.minLength(2), Validators.maxLength(20)])],
      email: ['', [Validators.required, Validators.pattern("^[a-z0-9._%+-]+@[a-z0-9.-]+\\.[a-z]{2,4}$")]],
      profile_image: this.formBuilder.array([]),
      password: ['', Validators.compose([
        Validators.minLength(8),
        Validators.maxLength(50),
        // check whether the entered password has a number
        CustomValidators.patternValidator(/\d/, {
          hasNumber: true
        }),
        // check whether the entered password has upper case letter
        CustomValidators.patternValidator(/[A-Z]/, {
          hasCapitalCase: true
        }),
        // check whether the entered password has a lower case letter
        CustomValidators.patternValidator(/[a-z]/, {
          hasSmallCase: true
        }),
        // check whether the entered password has a special character
        CustomValidators.patternValidator(
          /[ !@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]/,
          {
            hasSpecialCharacters: true
          }
        )
      ])
      ],
      phone: [undefined, [Validators.required]],
      country: this.formBuilder.group({
        country_id: ['', [Validators.required]],
        value: ['', [Validators.required]],
      }),
      state: this.formBuilder.group({
        state_id: ['', [Validators.required]],
        value: ['', [Validators.required]],
      }),
      city: this.formBuilder.group({
        city_id: ['', [Validators.required]],
        value: ['', [Validators.required]],
      }),
      country_id: [''],
      state_id: [{ value: '' }],
      city_id: [{ value: '' }],
      zipcode: [{ value: '' }],
    });
  }

  get profileImageArray(): FormArray {
    return this.profileForm.get('profile_image') as FormArray;
  }

  /**
   * on Submit Basic Details
  */
  onSubmitProfileForm() {

    //console.log('basicDetailsForm', this.profileForm.value); 
    this.ngxLoader.start();
    //return;
    if (this.profileForm.invalid) {
      this.isProfileFormSubmitted = true
      return false;
    }

    this.utilsService.processPostRequest('updateParentProfile', this.profileForm.value, false, '').pipe(takeUntil(this.onDestroy$)).subscribe((response) => {
      //console.log(response);
      this.ngxLoader.stop();
      this.utilsService.onResponse(environment.MESSGES['PROFILE-UPDATED'], true);
      this.checkQueryParam();
    })

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

  getParentDetailsByToken(id): void {
    this.utilsService.processPostRequest('getParentDetails', { userID: id }, true).pipe(takeUntil(this.onDestroy$)).subscribe((response) => {
      this.parentDetails = response;

      //console.log(this.parentDetails);

      if (this.parentDetails.country_id != '') {
        this.getStatesListing(this.parentDetails.country_id);
      }

      if (this.parentDetails.state_id != '') {
        this.stateValue = this.parentDetails.state_id;
        this.getCityListing(this.parentDetails.state_id);
      }

      if (this.parentDetails.city_id != '') {
        this.cityValue = this.parentDetails.city_id;
        this.zipcodeValue = this.parentDetails.zipcode;
        this.getZipcodeListing(this.parentDetails.city_id);
      }

      if (this.parentDetails.profile_image.length > 0) {
        //console.log('pello')
        this.profileImageArray.push(new FormControl(this.parentDetails.profile_image[0]));

        this.profileImagePath = this.parentDetails.profile_image[0].file_path;

      }

      this.profileForm.patchValue({
        userID: this.parentDetails._id,
        first_name: this.parentDetails.first_name,
        last_name: this.parentDetails.last_name,
        email: this.parentDetails.email,
        phone: this.parentDetails.phone,
        country_id: this.parentDetails.country_id,
        state_id: this.parentDetails.state_id,
        city_id: this.parentDetails.city_id,
        zipcode: this.parentDetails.zipcode
      });

      this.profileForm.controls.country.patchValue({
        country_id: this.parentDetails.country.country_id,
        value: this.parentDetails.country.value
      });

      this.profileForm.controls.state.patchValue({
        state_id: this.parentDetails.state.state_id,
        value: this.parentDetails.state.value
      });

      this.profileForm.controls.city.patchValue({
        city_id: this.parentDetails.city.city_id,
        value: this.parentDetails.city.value
      });

      this.ngxLoader.stop();
      //console.log(this.signupStep3Form.value)

    })
  }

  /**
   * get All Countries
   */
  getCountryListing() {

    this.utilsService.processGetRequest('country/listing', false).pipe(takeUntil(this.onDestroy$)).subscribe((response) => {
      this.countries = response;
    })

    this.resetAllControls('all');
  }

  /**
   * get All Cities
   */
  getCityListing(stateId) {

    //let stateId = event.target.value
    this.resetAllControls('city');

    this.stateArrayListing = this.states;


    // check State ID Empty or not
    if (stateId == '') {
      this.resetAllControls('city');
      return;
    }


    this.utilsService.processPostRequest('city/listing', { state_id: stateId }, false).pipe(takeUntil(this.onDestroy$)).subscribe((response) => {

      this.cities = response;
      this.cityArrayListing = response;


      if (this.cities.length > 0) {
        this.enableCityControl();
      } else {
        this.resetAllControls('city');
      }


      //console.log(this.stateArrayListing);
      this.stateArrayListing = this.stateArrayListing.filter(function (item) {
        return item._id === stateId;
      });

      this.profileForm.controls.state.patchValue({
        state_id: this.stateArrayListing[0]._id,
        value: this.stateArrayListing[0].title
      });



    })


  }

  /**
   * get All Zipcodes
   */
  getZipcodeListing(cityId) {
    //let cityId = event.target.value
    this.resetZipcodeControl();
    this.cityArrayListing = this.cities;

    // check State ID Empty or not
    if (cityId == "") {
      this.resetZipcodeControl();
      return;
    }

    this.utilsService.processPostRequest('city/cityInfo', { city_id: cityId }, false).pipe(takeUntil(this.onDestroy$)).subscribe((response) => {
      this.zipcodes = (response) ? response['zipcodes'] : [];
      if (this.zipcodes.length > 0) {
        this.enableZipcodeControl();
      } else {
        this.resetZipcodeControl();
      }

      this.cityArrayListing = this.cityArrayListing.filter(function (item) {
        return item._id === cityId;
      });

      this.profileForm.controls.city.patchValue({
        city_id: this.cityArrayListing[0]._id,
        value: this.cityArrayListing[0].title
      });

    })

  }

  /**
   * get All States
   */
  getStatesListing(countryId) {
    this.resetAllControls('state');
    // check Country ID Empty or not
    if (countryId == "" || countryId == undefined) {
      this.resetAllControls('state');
      return;
    }

    this.utilsService.processPostRequest('state/listing', { country_id: countryId }, false).pipe(takeUntil(this.onDestroy$)).subscribe((response) => {
      this.states = response;
      this.stateArrayListing = this.states;
      //console.log(this.stateArrayListing);

      if (this.states.length > 0) {
        this.enableStateControl();
      } else {
        this.resetAllControls('state');
      }
    })

  }

  /**
  * Reset All Control
  */
  resetAllControls(value): void {
    if (value == 'state') {
      this.resetStateControl();
      this.resetCityControl();
      this.resetZipcodeControl();
    }

    if (value == 'city') {
      this.resetCityControl();
      this.resetZipcodeControl();
    }

    if (value == 'all') {
      this.resetStateControl();
      this.resetCityControl();
      this.resetZipcodeControl();
    }
  }

  /**
  * Reset City Control
  */
  resetStateControl(): void {
    let stateControl = this.profileForm.controls.state_id;
    this.profileForm.controls.state.patchValue({
      state_id: '',
      value: ''
    });

    stateControl.disable(); stateControl.setValue('');
    this.states = [];
  }

  /**
  * Reset City Control
  */
  resetCityControl(): void {
    let cityControl = this.profileForm.controls.city_id;
    this.profileForm.controls.city.patchValue({
      city_id: '',
      value: ''
    });
    cityControl.disable(); cityControl.setValue('');
    this.cities = [];
  }

  /**
  * Reset Zipcode Control
  */
  resetZipcodeControl() {
    let zipcodeControl = this.profileForm.controls.zipcode;
    zipcodeControl.disable(); zipcodeControl.setValue('');
    this.zipcodes = [];
  }

  /**
  * Enable State Control
  */
  enableStateControl(): void {
    let stateControl = this.profileForm.controls.state_id;
    stateControl.enable();

  }

  /**
  * Enable City Control
  */
  enableCityControl(): void {
    let cityControl = this.profileForm.controls.city_id;
    cityControl.enable();
  }

  /**
  * Enable Zipcode Control
  */
  enableZipcodeControl(): void {
    let zipcodeControl = this.profileForm.controls.zipcode;
    zipcodeControl.enable();
  }

}
