import { Component, OnInit, OnDestroy, ViewChild, NgZone } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
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
import { Select2Module, Select2Utils, Select2 } from 'ng-select2-component';

import { SocialAuthService } from "angularx-social-login";
import { FacebookLoginProvider, GoogleLoginProvider } from "angularx-social-login";

import { NgxUiLoaderService } from 'ngx-ui-loader';


type Select2Data = (Select2Option)[];

export interface Select2Option {
  /** value  */
  value: Select2Value;
  /** label of option */
  label: string;
  /** no selectable is disabled */
  disabled?: boolean;
  /** for identification */
  id?: string;
  /** add classes  */
  classes?: string;
  /** template id  */
  templateId?: string;
  /** template data  */
  data?: any;
}

export type Select2UpdateValue = Select2Value | Select2Value[];

export interface Select2UpdateEvent<U extends Select2UpdateValue = Select2Value> {
  component: Select2;
  value: U;
  options: Select2Option[];
}

type Select2Value = string | number | boolean;

@Component({
  selector: 'app-signup',
  templateUrl: './signup.component.html',
  styleUrls: ['./signup.component.css'],
  animations: [fadeInAnimation],
  host: { '[@fadeInAnimation]': '' }
})

export class SignupComponent implements OnInit {

  @ViewChild(WizardComponent)
  public wizard: WizardComponent;

  private onDestroy$: Subject<void> = new Subject<void>();
  signupStep1Form: FormGroup;
  signupStep2Form: FormGroup;
  signupStep3Form: FormGroup;
  isSignupStep1FormSubmitted: boolean = false
  isSignupStep2FormSubmitted: boolean = false
  isSignupStep3FormSubmitted: boolean = false
  getEmailValue: string = '';

  SearchCountryField = SearchCountryField;
  TooltipLabel = TooltipLabel;
  CountryISO = CountryISO;
  PhoneNumberFormat = PhoneNumberFormat;
  preferredCountries: CountryISO[] = [CountryISO.UnitedStates, CountryISO.India];
  onlyCountries: CountryISO[] = [CountryISO.UnitedStates, CountryISO.India];

  countries: Select2Data = [];
  states: Select2Data = [];
  cities: Select2Data = [];
  zipcodes: Select2Data = [];

  countryArrayListing: any = [];
  stateArrayListing: any = [];
  cityArrayListing: any = [];

  states2: any = [];
  cities2: any = [];
  zipcodes2: any = [];
  categories: any = [];
  subcategories1: any = [];
  subcategories2: any = [];
  subcategories3: any = [];

  selectedCategory1Name: any = '';
  selectedCategory2Name: any = '';
  selectedCategory3Name: any = '';

  selectedSubCategory1Value: any = '';
  selectedSubCategory2Value: any = '';
  selectedSubCategory3Value: any = '';

  parentDetails: any = {};
  wizardStep = 0

  stateValue: Select2Value = '';
  cityValue: Select2Value = '';
  zipcodeValue: Select2Value = '';

  getGoogleLoginId = '';




  constructor(private zone: NgZone, private formBuilder: FormBuilder, private authService: AuthService, private utilsService: UtilsService, private router: Router, private activatedRoute: ActivatedRoute, private socialAuthService: SocialAuthService, private ngxLoader: NgxUiLoaderService) { }

  ngOnInit(): void {
    this.initalizeSignupStep1Form()
    this.initalizeSignupStep2Form()
    this.initalizeSignupStep3Form()

    this.activatedRoute.params.subscribe((params) => {
      const userID = ('userID' in params) ? params['userID'] : ''
      if (userID) {

        this.wizardStep = 2
        this.getParentDetailsByToken(userID)
      } else {
        this.utilsService.checkAndRedirect();
      }

    })
  }

  //initalize Step 1 form
  private initalizeSignupStep1Form() {
    this.signupStep1Form = this.formBuilder.group({
      email: ['', [Validators.required, Validators.pattern("^[a-z0-9._%+-]+@[a-z0-9.-]+\\.[a-z]{2,4}$")]],
      //phone: ['', [Validators.required, Validators.pattern("^((\\+91-?)|0)?[0-9]{10}$")]]      
    });
  }

  //initalize Step 2 form
  private initalizeSignupStep2Form() {
    this.signupStep2Form = this.formBuilder.group({
      first_name: ['', Validators.compose([Validators.required, Validators.minLength(2), Validators.maxLength(20)])],
      last_name: ['', Validators.compose([Validators.required, Validators.minLength(2), Validators.maxLength(20)])],
      email: ['', [Validators.required, Validators.pattern("^[a-z0-9._%+-]+@[a-z0-9.-]+\\.[a-z]{2,4}$")]],
      password: ['', Validators.compose([
        Validators.required,
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
      googleLoginId: [''],
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
      country_id: ['', [Validators.required]],
      state_id: [{ value: '' }, [Validators.required]],
      city_id: [{ value: '' }, [Validators.required]],
      zipcode: [{ value: '' }, [Validators.required]],
      role: ['', [Validators.required]],
      agree_terms: [false, Validators.requiredTrue],
      newsletter: [false],
    });
  }

  //initalize Step 3 form
  private initalizeSignupStep3Form() {
    this.signupStep3Form = this.formBuilder.group({
      user_id: [''],
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
      category1: this.formBuilder.group({
        category_id: ['', [Validators.required]],
        value: ['', [Validators.required]],
      }),
      category2: this.formBuilder.group({
        category_id: ['', [Validators.required]],
        value: ['', [Validators.required]],
      }),
      category3: this.formBuilder.group({
        category_id: ['', [Validators.required]],
        value: ['', [Validators.required]],
      }),
      subcategory1: this.formBuilder.group({
        subcategory_id: ['', [Validators.required]],
        value: ['', [Validators.required]],
      }),
      subcategory2: this.formBuilder.group({
        subcategory_id: ['', [Validators.required]],
        value: ['', [Validators.required]],
      }),
      subcategory3: this.formBuilder.group({
        subcategory_id: ['', [Validators.required]],
        value: ['', [Validators.required]],
      }),
      category_id1: [''],
      subcategory_id1: [''],
      category_id2: [''],
      subcategory_id2: [''],
      category_id3: [''],
      subcategory_id3: [''],
    });
  }

  signInWithGoogle(): void {
    //console.log('hello');

    this.socialAuthService.signIn(GoogleLoginProvider.PROVIDER_ID).then(
      (userData: any) => {
        //console.log(userData)
        //console.log(userData.firstName)
        this.ngxLoader.start();

        this.signupStep1Form.patchValue({
          email: userData.email
        });

        this.authService.checkGoogleLogin(this.signupStep1Form.value).pipe(takeUntil(this.onDestroy$)).subscribe((response) => {

          if (response.body.email == false) {

            this.signupStep2Form.patchValue({
              first_name: userData.firstName,
              last_name: userData.lastName,
              email: userData.email,
              googleLoginId: userData.id
            });
            this.getGoogleLoginId = userData.id;

            // get Country Listing
            this.getCountryListing();
            this.updateStep2Settings();
            this.wizard.goToNextStep();

          } else {
            if (response.body.verify_phone == false) {
              this.router.navigate(['/mentor/verify-phone/' + response.body._id]);
            } else {

              this.authService.isLoggedIn(true);
              localStorage.setItem('x-user-ID', response.body._id)
              localStorage.setItem(environment.TOKEN_NAME, response.headers.get(environment.TOKEN_NAME))
              localStorage.setItem('x-user-type', response.body.role)

              if (response.body.role == 'MENTOR') {
                this.utilsService.onResponse(environment.MESSGES['LOGIN-SUCCESS'], true);//show page loader
                // Check if a active Mentor or Not
                if (response.body.is_active == false) {

                  if (response.body.admin_status == 'PENDING') {
                    this.router.navigate(['/mentor/basic-details/']);
                  } else if (response.body.admin_status == 'NEW') {
                    this.router.navigate(['/mentor/application-status/']);
                  } else {
                    this.router.navigate(['/home']);
                  }
      
                } else {
                  if (response.body.admin_status == 'APPROVED' && response.body.subscription_status == 'IN-ACTIVE') {
                    this.router.navigate(['/mentor/profile/']);
                  } else if (response.body.admin_status == 'APPROVED' && (response.body.subscription_status == 'ACTIVE' || response.body.subscription_status == 'CANCELLED')) {
                    this.router.navigate(['/mentor/dashboard/']);
                  } else {
                    this.router.navigate(['/home']);
                  }
                }

              } else {
                const responseMessage = 'Success! ' + response.body.first_name + ', welcome to your personalized dashboard.'
                this.utilsService.onResponse(responseMessage, true);//show page loader 
                this.router.navigate(['/parent/search']);
              }
            }
          }

          this.ngxLoader.stop();

        });






      });
  }

  updateStep2Settings(): void {

    if (this.getGoogleLoginId != '') {
      this.signupStep2Form.patchValue({
        password: 'Test@1234'
      });
    }

  }

  selectSubcategory1(event) {
    this.signupStep3Form.patchValue({
      subcategory_id1: event.target.value
    });

    this.selectedSubCategory1Value = event.target.value;

    this.signupStep3Form.controls.subcategory1.patchValue({ subcategory_id: event.target.value, value: event.target.getAttribute('data-subCategoryName') });
  }

  selectSubcategory2(event) {
    this.signupStep3Form.patchValue({
      subcategory_id2: event.target.value
    });

    this.signupStep3Form.controls.subcategory2.patchValue({ subcategory_id: event.target.value, value: event.target.getAttribute('data-subCategoryName') });
  }

  selectSubcategory3(event) {
    this.signupStep3Form.patchValue({
      subcategory_id3: event.target.value
    });

    this.signupStep3Form.controls.subcategory3.patchValue({ subcategory_id: event.target.value, value: event.target.getAttribute('data-subCategoryName') });

  }

  //Authorizing Submit form
  onSignupStep1FormSubmit() {

    if (this.signupStep1Form.invalid) {
      this.isSignupStep1FormSubmitted = true
      return false;
    }

    this.ngxLoader.start();

    // Check Email Exists or not
    this.utilsService.processPostRequest('checkEmailExists', this.signupStep1Form.value, true, '').pipe(takeUntil(this.onDestroy$)).subscribe((response) => {
      //console.log('response', response);
      this.getEmailValue = this.signupStep1Form.controls.email.value;
      this.signupStep2Form.patchValue({
        email: this.signupStep1Form.controls.email.value
      });
      // get Country Listing
      this.getCountryListing();
      this.ngxLoader.stop();
      this.wizard.goToNextStep();

    })


  }

  //Authorizing Submit form
  onSignupStep2FormSubmit() {


    if (this.signupStep2Form.invalid) {
      this.isSignupStep2FormSubmitted = true
      return false;
    }

    this.ngxLoader.start();

    let phoneJson = this.signupStep2Form.controls.phone.value;

    this.signupStep2Form.patchValue({
      phone: phoneJson.e164Number
    });


    //console.log('signupStep2Form', this.signupStep2Form.value);
    //return;

    this.utilsService.processSignupRequest('signup', this.signupStep2Form.value, true, '').pipe(takeUntil(this.onDestroy$)).subscribe((response) => {


      if (this.signupStep2Form.get('role').value == 'PARENT') {


        localStorage.setItem('x-user-ID', response.body['_id']);
        localStorage.setItem(environment.TOKEN_NAME, response.headers.get(environment.TOKEN_NAME));
        localStorage.setItem('x-user-type', 'PARENT');

        this.router.navigateByUrl('/', { skipLocationChange: true }).then(() =>

          this.router.navigate(['/authorization/signup/' + response.body['_id']]))


      } else {

        //localStorage.setItem('x-user-type', 'MENTOR')
        this.utilsService.onResponse(environment.MESSGES['REGISTERED-SUCCESSFULLY'], true);
        this.router.navigate(['/mentor/verify-phone/' + response.body['_id']]);

      }

      this.ngxLoader.stop();

    })

  }

  getParentDetailsByToken(id): void {
    this.ngxLoader.start();
    this.utilsService.processPostRequest('getParentDetails', { userID: id }, true).pipe(takeUntil(this.onDestroy$)).subscribe((response) => {
      this.parentDetails = response;

      //console.log(this.parentDetails);

      this.getCategoryListing(); // get Category Listing

      if (this.parentDetails.country_id != '') {
        this.getStatesInStep3(this.parentDetails.country_id);
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

      this.signupStep3Form.patchValue({
        user_id: this.parentDetails._id,
        country_id: this.parentDetails.country_id,
        state_id: this.parentDetails.state_id,
        city_id: this.parentDetails.city_id,
        zipcode: this.parentDetails.zipcode
      });

      this.signupStep3Form.controls.country.patchValue({
        country_id: this.parentDetails.country.country_id,
        value: this.parentDetails.country.value
      });

      this.signupStep3Form.controls.state.patchValue({
        state_id: this.parentDetails.state.state_id,
        value: this.parentDetails.state.value
      });
      this.signupStep3Form.controls.city.patchValue({
        city_id: this.parentDetails.city.city_id,
        value: this.parentDetails.city.value
      });

      //console.log(this.signupStep3Form.value)

      this.ngxLoader.stop();

    })
  }

  onSignupStep3FormSubmit() {

    //console.log(this.signupStep3Form.value); return;
    this.ngxLoader.start();
    this.utilsService.processPostRequest('updateParentInfo', this.signupStep3Form.value, true, '').pipe(takeUntil(this.onDestroy$)).subscribe((response) => {
      this.utilsService.onResponse('Your information updated successfully.', true);
      this.router.navigate(['/parent/search']);
      this.ngxLoader.stop();
    })
  }

  /**
   * get All categories
   */
  getCategoryListing() {

    this.utilsService.processGetRequest('category/listing', false).pipe(takeUntil(this.onDestroy$)).subscribe((response) => {
      this.categories = response;
    })
  }

  /**
   * get All categories
   */
  getSubcategory1Listing(event) {
    let categoryID = event.target.value

    this.subcategories1 = []
    this.signupStep3Form.patchValue({
      subcategory_id1: ''
    });

    if (categoryID) {

      this.selectedCategory1Name = [event.target.options[event.target.selectedIndex].getAttribute('data-categoryName')];


      this.signupStep3Form.controls.category1.patchValue({
        category_id: categoryID,
        value: this.selectedCategory1Name[0]
      })

      this.utilsService.processPostRequest('subcategory/listing', { category_id: categoryID }, false).pipe(takeUntil(this.onDestroy$)).subscribe((response) => {
        this.subcategories1 = response;

        let selectedSubCategory2 = this.signupStep3Form.controls.subcategory_id2.value;
        let selectedSubCategory3 = this.signupStep3Form.controls.subcategory_id3.value;

        this.subcategories1 = this.subcategories1.filter(function (item) {
          return item._id !== selectedSubCategory2;
        });
        this.subcategories1 = this.subcategories1.filter(function (item) {
          return item._id !== selectedSubCategory3;
        });

      })
    } else {
      this.signupStep3Form.controls.category1.patchValue({
        category_id: '',
        value: ''
      })
    }

  }

  getSubcategory2Listing(event) {
    let categoryID = event.target.value
    this.subcategories2 = []
    this.signupStep3Form.patchValue({
      subcategory_id2: ''
    });
    if (categoryID) {

      this.selectedCategory2Name = [event.target.options[event.target.selectedIndex].getAttribute('data-categoryName')];

      this.signupStep3Form.controls.category2.patchValue({
        category_id: categoryID,
        value: this.selectedCategory2Name[0]
      })


      this.utilsService.processPostRequest('subcategory/listing', { category_id: categoryID }, false).pipe(takeUntil(this.onDestroy$)).subscribe((response) => {


        this.subcategories2 = response;


        let selectedSubCategory1 = this.signupStep3Form.controls.subcategory_id1.value;
        let selectedSubCategory3 = this.signupStep3Form.controls.subcategory_id3.value;

        if (this.signupStep3Form.controls.subcategory_id1.value != '') {
          this.subcategories2 = this.subcategories2.filter(function (item) {
            return item._id !== selectedSubCategory1;
          });
          this.subcategories2 = this.subcategories2.filter(function (item) {
            return item._id !== selectedSubCategory3;
          });
        }


      })
    }

  }

  getSubcategory3Listing(event) {
    let categoryID = event.target.value
    this.subcategories3 = []
    this.signupStep3Form.patchValue({
      subcategory_id3: ''
    });
    if (categoryID) {
      this.selectedCategory3Name = [event.target.options[event.target.selectedIndex].getAttribute('data-categoryName')];

      this.signupStep3Form.controls.category3.patchValue({
        category_id: categoryID,
        value: this.selectedCategory3Name[0]
      })

      this.utilsService.processPostRequest('subcategory/listing', { category_id: categoryID }, false).pipe(takeUntil(this.onDestroy$)).subscribe((response) => {
        this.subcategories3 = response;

        let selectedSubCategory1 = this.signupStep3Form.controls.subcategory_id1.value;
        let selectedSubCategory2 = this.signupStep3Form.controls.subcategory_id2.value;

        if (this.signupStep3Form.controls.subcategory_id1.value != '') {
          this.subcategories3 = this.subcategories3.filter(function (item) {
            return item._id !== selectedSubCategory1;
          });

          this.subcategories3 = this.subcategories3.filter(function (item) {
            return item._id !== selectedSubCategory2;
          });
        }

      })
    }

  }


  /**
   * get All Countries
   */
  getCountryListing() {

    this.utilsService.processGetRequest('country/listing', false).pipe(takeUntil(this.onDestroy$)).subscribe((response) => {
      let countriesArray: any = [];
      let countryArrayOptions = [];
      let countryArray = [];

      countriesArray = response;

      countriesArray.forEach(element => {
        countryArrayOptions.push({ value: element._id, label: element.title });
      });

      countryArray.push({ options: countryArrayOptions })

      this.countries = JSON.parse(JSON.stringify(countryArray));
      this.countryArrayListing = countriesArray;

      //console.log(this.countries)

    })

    this.resetAllControls('all');
  }

  /**
   * get All States
   */
  getStateListing(event: Select2UpdateEvent<string>) {

    //console.log('event', event);

    let countryId = event.value

    //console.log(event.options)
    this.resetAllControls('state');


    // check Country ID Empty or not
    if (countryId == "" || countryId == undefined) {
      this.resetAllControls('state');
      return;
    }

    this.utilsService.processPostRequest('state/listing', { country_id: countryId }, false).pipe(takeUntil(this.onDestroy$)).subscribe((response) => {
      let statesArray: any = [];
      let stateArrayOptions = [];
      let stateArray = [];

      statesArray = response;

      statesArray.forEach(element => {
        stateArrayOptions.push({ value: element._id, label: element.title });
      });

      stateArray.push({ options: stateArrayOptions })

      this.states = JSON.parse(JSON.stringify(stateArray));

      this.stateArrayListing = statesArray;

      if (this.states.length > 0) {
        this.enableStateControl();
      } else {
        this.resetAllControls('state');
      }

      //console.log(this.stateArrayListing);


      this.countryArrayListing = this.countryArrayListing.filter(function (item) {
        return item._id === countryId;
      });

      //console.log(this.countryArrayListing);

      this.signupStep2Form.controls.country.patchValue({
        country_id: this.countryArrayListing[0]._id,
        value: this.countryArrayListing[0].title
      });

      //console.log(this.signupStep2Form.controls.country.value);

    })

  }



  /**
   * get All States
   */
  onUpdateState(event: Select2UpdateEvent<string>) {

    let stateId = event.value;

    // check State ID Empty or not
    if (stateId == '' || stateId == undefined) {
      this.resetAllControls('city');
      return;
    }

    this.utilsService.processPostRequest('city/listing', { state_id: stateId }, false).pipe(takeUntil(this.onDestroy$)).subscribe((response) => {

      let citiesArray: any = [];
      let cityArrayOptions = [];
      let cityArray = [];

      citiesArray = response;

      citiesArray.forEach(element => {
        cityArrayOptions.push({ value: element._id, label: element.title });
      });

      cityArray.push({ options: cityArrayOptions })

      this.cities = JSON.parse(JSON.stringify(cityArray));


      this.cityArrayListing = citiesArray;


      if (this.cities.length > 0) {
        this.enableCityControl();
      } else {
        this.resetAllControls('city');
      }



      this.stateArrayListing = this.stateArrayListing.filter(function (item) {
        return item._id === stateId;
      });


      //console.log(this.stateArrayListing);

      this.signupStep2Form.controls.state.patchValue({
        state_id: this.stateArrayListing[0]._id,
        value: this.stateArrayListing[0].title
      });

      //console.log(this.stateArrayListing);

    })
  }

  /**
   * get All States
   */
  getCitiesInStep3(stateId) {



    // check State ID Empty or not
    if (stateId == '' || stateId == undefined) {
      this.resetAllControls('city');
      return;
    }

    this.utilsService.processPostRequest('city/listing', { state_id: stateId }, false).pipe(takeUntil(this.onDestroy$)).subscribe((response) => {

      let citiesArray: any = [];
      let cityArrayOptions = [];
      let cityArray = [];

      citiesArray = response;

      citiesArray.forEach(element => {
        cityArrayOptions.push({ value: element._id, label: element.title });
      });

      cityArray.push({ options: cityArrayOptions })

      this.cities = JSON.parse(JSON.stringify(cityArray));


      if (this.cities.length > 0) {
        this.enableCityControl();
      } else {
        this.resetAllControls('city');
      }
    })
  }


  /**
   * get All States
   */
  getStatesInStep3(countryId) {
    this.resetAllControls('state');
    // check Country ID Empty or not
    if (countryId == "" || countryId == undefined) {
      this.resetAllControls('state');
      return;
    }

    this.utilsService.processPostRequest('state/listing', { country_id: countryId }, false).pipe(takeUntil(this.onDestroy$)).subscribe((response) => {


      this.states2 = response;
      this.stateArrayListing = response;
      //console.log(this.states2);

      if (this.states2.length > 0) {
        this.enableStateControl();
      } else {
        this.resetAllControls('state');
      }
    })

  }

  /**
   * get All Cities
   */
  getCityListing(stateId) {

    //let stateId = event.target.value
    this.resetAllControls('city');

    this.stateArrayListing = this.states2;


    // check State ID Empty or not
    if (stateId == '') {
      this.resetAllControls('city');
      return;
    }


    this.utilsService.processPostRequest('city/listing', { state_id: stateId }, false).pipe(takeUntil(this.onDestroy$)).subscribe((response) => {

      this.cities2 = response;
      this.cityArrayListing = response;


      if (this.cities2.length > 0) {
        this.enableCityControl();
      } else {
        this.resetAllControls('city');
      }


      //console.log(this.states2);
      this.stateArrayListing = this.stateArrayListing.filter(function (item) {
        return item._id === stateId;
      });

      this.signupStep3Form.controls.state.patchValue({
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
    this.cityArrayListing = this.cities2;

    // check State ID Empty or not
    if (cityId == "") {
      this.resetZipcodeControl();
      return;
    }

    this.utilsService.processPostRequest('city/cityInfo', { city_id: cityId }, false).pipe(takeUntil(this.onDestroy$)).subscribe((response) => {
      this.zipcodes2 = (response) ? response['zipcodes'] : [];
      if (this.zipcodes2.length > 0) {
        this.enableZipcodeControl();
      } else {
        this.resetZipcodeControl();
      }

      this.cityArrayListing = this.cityArrayListing.filter(function (item) {
        return item._id === cityId;
      });

      this.signupStep3Form.controls.city.patchValue({
        city_id: this.cityArrayListing[0]._id,
        value: this.cityArrayListing[0].title
      });

    })



  }

  /**
   * get All Zipcodes
   */
  onUpdateCity(event: Select2UpdateEvent<string>) {

    let cityId = event.value;
    //let cityId = event.target.value
    this.resetZipcodeControl();


    // check State ID Empty or not
    if (cityId == "" || cityId == undefined) {
      this.resetZipcodeControl();
      return;
    }

    this.utilsService.processPostRequest('city/cityInfo', { city_id: cityId }, false).pipe(takeUntil(this.onDestroy$)).subscribe((response) => {

      let zipcodesArray: any = [];
      let zipcodeArrayOptions = [];
      let zipcodeArray = [];

      zipcodesArray = response['zipcodes'];

      zipcodesArray.forEach(element => {
        zipcodeArrayOptions.push({ value: element.value, label: element.value });
      });

      zipcodeArray.push({ options: zipcodeArrayOptions })

      this.zipcodes = JSON.parse(JSON.stringify(zipcodeArray));

      if (this.zipcodes.length > 0) {
        this.enableZipcodeControl();
      } else {
        this.resetZipcodeControl();
      }


      this.cityArrayListing = this.cityArrayListing.filter(function (item) {
        return item._id === cityId;
      });

      this.signupStep2Form.controls.city.patchValue({
        city_id: this.cityArrayListing[0]._id,
        value: this.cityArrayListing[0].title
      });

      //console.log(this.cityArrayListing);

    })



  }

  /**
   * get All Zipcodes
   */
  getZipcodesInStep3(cityId) {


    //let cityId = event.target.value
    this.resetZipcodeControl();


    // check State ID Empty or not
    if (cityId == "" || cityId == undefined) {
      this.resetZipcodeControl();
      return;
    }

    this.utilsService.processPostRequest('city/cityInfo', { city_id: cityId }, false).pipe(takeUntil(this.onDestroy$)).subscribe((response) => {

      let zipcodesArray: any = [];
      let zipcodeArrayOptions = [];
      let zipcodeArray = [];

      zipcodesArray = response['zipcodes'];

      zipcodesArray.forEach(element => {
        zipcodeArrayOptions.push({ value: element.value, label: element.value });
      });

      zipcodeArray.push({ options: zipcodeArrayOptions })

      this.zipcodes = JSON.parse(JSON.stringify(zipcodeArray));

      if (this.zipcodes.length > 0) {
        this.enableZipcodeControl();
      } else {
        this.resetZipcodeControl();
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

    if (value == 'city2') {
      this.resetCity2Control();
      this.resetZipcode2Control();
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
    let stateControl = this.signupStep2Form.controls.state_id;
    let stateControl2 = this.signupStep3Form.controls.state_id;

    this.signupStep2Form.controls.state.patchValue({
      state_id: '',
      value: ''
    });

    stateControl.disable(); stateControl.setValue('');
    stateControl2.disable(); stateControl2.setValue('');

    this.states = [];
  }

  /**
  * Reset City Control
  */
  resetCity2Control(): void {
    let cityControl = this.signupStep3Form.controls.lcity_id;
    cityControl.disable(); cityControl.setValue(''); this.cities2 = [];
  }

  /**
  * Reset Zipcode Control
  */
  resetZipcode2Control() {
    let zipcodeControl = this.signupStep3Form.controls.lzipcode;
    zipcodeControl.disable(); zipcodeControl.setValue(''); this.zipcodes2 = [];
  }

  /**
  * Reset City Control
  */
  resetCityControl(): void {
    let cityControl = this.signupStep2Form.controls.city_id;
    let cityControl2 = this.signupStep3Form.controls.city_id;

    this.signupStep2Form.controls.city.patchValue({
      city_id: '',
      value: ''
    });

    cityControl.disable(); cityControl.setValue('');
    cityControl2.disable(); cityControl2.setValue('');

    this.cities = [];
  }

  /**
  * Reset Zipcode Control
  */
  resetZipcodeControl() {
    let zipcodeControl = this.signupStep2Form.controls.zipcode;
    let zipcodeControl2 = this.signupStep3Form.controls.zipcode;
    zipcodeControl.disable(); zipcodeControl.setValue('');
    zipcodeControl2.disable(); zipcodeControl2.setValue('');
    this.zipcodes = [];
  }

  /**
  * Enable State Control
  */
  enableStateControl(): void {
    let stateControl = this.signupStep2Form.controls.state_id;
    let stateControl2 = this.signupStep3Form.controls.state_id;
    stateControl.enable();
    stateControl2.enable();
  }

  /**
  * Enable City Control
  */
  enableCityControl(): void {
    let cityControl = this.signupStep2Form.controls.city_id;
    let cityControl2 = this.signupStep3Form.controls.city_id;
    cityControl.enable();
    cityControl2.enable();
  }

  /**
  * Enable City Control
  */
  enableCity2Control(): void {
    let cityControl = this.signupStep3Form.controls.lcity_id;
    cityControl.enable();
  }

  /**
  * Enable Zipcode Control
  */
  enableZipcodeControl(): void {
    let zipcodeControl = this.signupStep2Form.controls.zipcode;
    let zipcodeControl2 = this.signupStep3Form.controls.zipcode;
    zipcodeControl.enable();
    zipcodeControl2.enable();
  }

  /**
  * Enable Zipcode Control
  */
  enableZipcode2Control(): void {
    let zipcodeControl = this.signupStep3Form.controls.lzipcode;
    zipcodeControl.enable();
  }



  //destroy all subscription
  public ngOnDestroy(): void {
    this.onDestroy$.next();
  }

}
