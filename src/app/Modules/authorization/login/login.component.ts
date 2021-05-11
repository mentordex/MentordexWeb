import { Component, OnInit, OnDestroy, ViewChild, NgZone } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from "@angular/router";
import { takeUntil } from 'rxjs/operators';
import { Subject } from 'rxjs';

// import fade in animation
import { fadeInAnimation } from '../../../core/animations';
import { AuthService, UtilsService } from '../../../core/services';

//import enviornment
import { environment } from '../../../../environments/environment';

//import custom validators
import { CustomValidators } from '../../../core/custom-validators';

import { MovingDirection, WizardComponent } from 'angular-archwizard';


import { SearchCountryField, TooltipLabel, CountryISO, PhoneNumberFormat } from 'ngx-intl-tel-input';
import { Select2Module, Select2Utils, Select2 } from 'ng-select2-component';

import { SocialAuthService } from "angularx-social-login";
import { FacebookLoginProvider, GoogleLoginProvider } from "angularx-social-login";


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
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit {

  @ViewChild(WizardComponent)
  public wizard: WizardComponent;


  private onDestroy$: Subject<void> = new Subject<void>();
  emailForm: FormGroup;
  isEmailFormSubmitted: boolean = false
  loginForm: FormGroup;
  isLoginFormSubmitted: boolean = false
  isEmailValidated: boolean = false
  authorizedEmail: string = '';

  
  getGoogleLoginId = '';
  signupStep2Form: FormGroup;
  
  isSignupStep2FormSubmitted: boolean = false
  

  SearchCountryField = SearchCountryField;
  TooltipLabel = TooltipLabel;
  CountryISO = CountryISO;
  PhoneNumberFormat = PhoneNumberFormat;
  preferredCountries: CountryISO[] = [CountryISO.UnitedStates];
  onlyCountries: CountryISO[] = [CountryISO.UnitedStates];

  countries: Select2Data = [];
  states: Select2Data = [];
  cities: Select2Data = [];
  zipcodes: Select2Data = [];

  countryArrayListing: any = [];
  stateArrayListing: any = [];
  cityArrayListing: any = [];

  

  stateValue: Select2Value = '';
  cityValue: Select2Value = '';
  zipcodeValue: Select2Value = '';

  gotToSignupStep: boolean = false;

  constructor(private formBuilder: FormBuilder, private authService: AuthService, private utilsService: UtilsService, private router: Router, private socialAuthService: SocialAuthService) { }

  ngOnInit(): void {
    this.utilsService.checkAndRedirect()
    this.initalizeLoginForm()
    this.initalizeEmailForm()
    this.initalizeSignupStep2Form()
  }

  //initalize email form
  private initalizeEmailForm() {
    this.emailForm = this.formBuilder.group({
      email: ['', [Validators.required, Validators.pattern("^[a-z0-9._%+-]+@[a-z0-9.-]+\\.[a-z]{2,4}$")]],
    });
  }

  //initalize login form
  private initalizeLoginForm() {
    this.loginForm = this.formBuilder.group({
      email: ['', [Validators.required, Validators.pattern("^[a-z0-9._%+-]+@[a-z0-9.-]+\\.[a-z]{2,4}$")]],
      password: [null, [Validators.required]]
    });
  }


  //Authorizing email form
  onEmailFormSubmit() {
    if (this.emailForm.invalid) {
      this.isEmailFormSubmitted = true
      return false;
    }
    this.utilsService.processPostRequest('checkEmail', this.emailForm.value, true, '').pipe(takeUntil(this.onDestroy$)).subscribe((response) => {
      this.isEmailValidated = true
      this.authorizedEmail = this.emailForm.get('email').value
      this.loginForm.patchValue({ email: this.authorizedEmail })
    })
  }

  //Authorizing email form
  onLoginFormSubmit() {

    if (this.loginForm.invalid) {
      this.isLoginFormSubmitted = true
      return false;
    }
    //console.log(this.loginForm.value); return;

    this.authService.login(this.loginForm.value).pipe(takeUntil(this.onDestroy$)).subscribe((response) => {

      console.log('response', response); 
      //console.log('response admin_status', response.admin_status); return;

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
            } else if (response.body.admin_status == 'APPROVED' && response.body.subscription_status == 'IN-ACTIVE') {
              this.router.navigate(['/mentor/profile/']);
            }else if (response.body.admin_status == 'APPROVED' && (response.body.subscription_status == 'ACTIVE' || response.body.subscription_status == 'CANCELLED')) {
              this.router.navigate(['/mentor/dashboard/']);
            } else {
              this.router.navigate(['/home']);
            }

          } else {
            this.router.navigate(['/home']);
          }

        } else {
          const responseMessage = 'Great!! ' + response.body.first_name + ', welcome to your dashboard.'
          this.utilsService.onResponse(responseMessage, true);//show page loader 
          this.router.navigate(['/parent/search']);
        }
      }

    })
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

  

  signInWithGoogle(): void {
    //console.log('hello');
    this.socialAuthService.signIn(GoogleLoginProvider.PROVIDER_ID).then(
      (userData: any) => {
        console.log(userData)
        console.log(userData.firstName)

        this.emailForm.patchValue({
          email: userData.email
        });

        this.authService.checkGoogleLogin(this.emailForm.value).pipe(takeUntil(this.onDestroy$)).subscribe((response) => {

          if (response.body.email == false) {

            this.signupStep2Form.patchValue({
              first_name: userData.firstName,
              last_name: userData.lastName,
              email: userData.email,
              googleLoginId: userData.id
            });
            this.getGoogleLoginId = userData.id;
            this.gotToSignupStep = true;

            // get Country Listing
            this.getCountryListing();
            this.updateStep2Settings();
            this.gotToSignupStep = true;
            //this.wizard.goToNextStep();

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
                  } else if (response.body.admin_status == 'APPROVED' && response.body.subscription_status == 'IN-ACTIVE') {
                    this.router.navigate(['/mentor/profile/']);
                  } else if (response.body.admin_status == 'APPROVED' && (response.body.subscription_status == 'ACTIVE' || response.body.subscription_status == 'CANCELLED')) {
                    this.router.navigate(['/mentor/dashboard/']);
                  } else {
                    this.router.navigate(['/home']);
                  }

                } else {
                  this.router.navigate(['/home']);
                }

              } else {
                const responseMessage = 'Great!! ' + response.body.first_name + ', welcome to your dashboard.'
                this.utilsService.onResponse(responseMessage, true);//show page loader 
                this.router.navigate(['/parent/search']);
              }
            }
          }


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

  

  

  //Authorizing Submit form
  onSignupStep2FormSubmit() {


    if (this.signupStep2Form.invalid) {
      this.isSignupStep2FormSubmitted = true
      return false;
    }

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
    })

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
    let stateControl = this.signupStep2Form.controls.state_id;
    

    this.signupStep2Form.controls.state.patchValue({
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
    let cityControl = this.signupStep2Form.controls.city_id;
    

    this.signupStep2Form.controls.city.patchValue({
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
    let zipcodeControl = this.signupStep2Form.controls.zipcode;
    
    zipcodeControl.disable(); zipcodeControl.setValue('');
    
    this.zipcodes = [];
  }

  /**
  * Enable State Control
  */
  enableStateControl(): void {
    let stateControl = this.signupStep2Form.controls.state_id;
   
    stateControl.enable();
    
  }

  /**
  * Enable City Control
  */
  enableCityControl(): void {
    let cityControl = this.signupStep2Form.controls.city_id;
    
    cityControl.enable();
    
  }

  

  /**
  * Enable Zipcode Control
  */
  enableZipcodeControl(): void {
    let zipcodeControl = this.signupStep2Form.controls.zipcode;
    
    zipcodeControl.enable();
    
  }

  
  //destroy all subscription
  public ngOnDestroy(): void {
    this.onDestroy$.next();
  }

}
