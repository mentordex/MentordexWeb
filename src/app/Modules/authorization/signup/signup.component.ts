import { Component, OnInit, OnDestroy } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from "@angular/router";
import { takeUntil } from 'rxjs/operators';
import { Subject } from 'rxjs';

// import fade in animation
import { fadeInAnimation } from '../../../core/animations';
import { AuthService, UtilsService } from '../../../core/services';

//import enviornment
import { environment } from '../../../../environments/environment';

import { SearchCountryField, TooltipLabel, CountryISO, PhoneNumberFormat } from 'ngx-intl-tel-input';

@Component({
  selector: 'app-signup',
  templateUrl: './signup.component.html',
  styleUrls: ['./signup.component.css']
})
export class SignupComponent implements OnInit {

  private onDestroy$: Subject<void> = new Subject<void>();
  signupStep1Form: FormGroup;
  signupStep2Form: FormGroup;
  isSignupStep1FormSubmitted: boolean = false
  isSignupStep2FormSubmitted: boolean = false
  getEmailValue: string = '';

  SearchCountryField = SearchCountryField;
  TooltipLabel = TooltipLabel;
  CountryISO = CountryISO;
  PhoneNumberFormat = PhoneNumberFormat;
  preferredCountries: CountryISO[] = [CountryISO.UnitedStates];

  countries: any = [];
  states: any = [];
  cities: any = [];
  zipcodes: any = [];

  countryArray = [{ id: 1, value: 'US' }];

  stateArray = [{ id: 1, value: 'Alabama', country_id: 1 }, { id: 2, value: 'Alaska', country_id: 1 }, { id: 3, value: 'California', country_id: 1 }, { id: 4, value: 'Florida', country_id: 1 }, { id: 5, value: 'Washington', country_id: 1 }];

  cityArray = [{ id: 1, value: 'Abbeville', state_id: 1, country_id: 1 }, { id: 2, value: 'Anniston', state_id: 1, country_id: 1 }, { id: 3, value: 'Bakerhill', state_id: 1, country_id: 1 }, { id: 4, value: 'Bettles', state_id: 2, country_id: 1 }, { id: 5, value: 'Marshall', state_id: 2, country_id: 1 }, { id: 6, value: 'Corona', state_id: 3, country_id: 1 }, { id: 7, value: 'Greenfield', state_id: 3, country_id: 1 }, { id: 8, value: 'Miami', state_id: 4, country_id: 1 }, { id: 9, value: 'Tampa', state_id: 4, country_id: 1 }, { id: 10, value: 'Newcastle', state_id: 5, country_id: 1 }, { id: 11, value: 'Woodland', state_id: 5, country_id: 1 }];

  zipcodeArray = [{ id: 1, value: '70510', city_id: 1 }, { id: 2, value: '70511', city_id: 1 }, { id: 3, value: '36201', city_id: 2 }, { id: 4, value: '36204', city_id: 2 }, { id: 5, value: '36027', city_id: 3 }, { id: 6, value: '99726', city_id: 4 }, { id: 7, value: '56258', city_id: 5 }, { id: 8, value: '92877', city_id: 6 }, { id: 9, value: '92880', city_id: 6 }, { id: 10, value: '46140', city_id: 7 }, { id: 11, value: '33125', city_id: 8 }, { id: 12, value: '33129', city_id: 8 }, { id: 13, value: '33601', city_id: 9 }, { id: 14, value: '33605', city_id: 9 }, { id: 15, value: '73065', city_id: 10 }, { id: 16, value: '73072', city_id: 10 }, { id: 17, value: '95695', city_id: 11 }, { id: 18, value: '95776', city_id: 11 }];

  constructor(private formBuilder: FormBuilder, private authService: AuthService, private utilsService: UtilsService, private router: Router) { }

  ngOnInit(): void {
    this.initalizeSignupStep1Form()
    this.initalizeSignupStep2Form()
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
        /*// check whether the entered password has a number
        CustomValidator.patternValidator(/\d/, {
          hasNumber: true
        }),
        // check whether the entered password has upper case letter
        CustomValidator.patternValidator(/[A-Z]/, {
          hasCapitalCase: true
        }),
        // check whether the entered password has a lower case letter
        CustomValidator.patternValidator(/[a-z]/, {
          hasSmallCase: true
        }),
        // check whether the entered password has a special character
        CustomValidator.patternValidator(
          /[ !@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]/,
          {
            hasSpecialCharacters: true
          }
        ) */
      ])
      ],
      phone: [undefined, [Validators.required]],
      country_id: ['', [Validators.required]],
      state_id: [{ value: '' }, [Validators.required]],
      city_id: [{ value: '' }, [Validators.required]],
      zipcode: [{ value: '' }, [Validators.required]],
      role: ['', [Validators.required]],
      agree_terms: [false, Validators.requiredTrue],
    });
  }

  //Authorizing Submit form
  onSignupStep1FormSubmit() {
    if (this.signupStep1Form.invalid) {
      this.isSignupStep1FormSubmitted = true
      return false;
    }

    this.getEmailValue = this.signupStep1Form.controls.email.value;
    this.signupStep2Form.patchValue({
      email: this.signupStep1Form.controls.email.value
    });

    // get Country Listing
    this.getCountryListing();

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

    //console.log(this.signupStep2Form.value);
    //return;

    this.utilsService.processPostRequest('signup', this.signupStep2Form.value, true, '').pipe(takeUntil(this.onDestroy$)).subscribe((response) => {
      //console.log('response', response);
      this.utilsService.onResponse(environment.MESSGES['REGISTERED-SUCCESSFULLY'], true);
    })
  }


  /**
   * get All Countries
   */
  getCountryListing() {
    this.countries = this.countryArray;
    this.resetAllControls('all');
  }

  /**
   * get All States
   */
  getStateListing(countryId) {
    this.resetAllControls('state');


    // check Country ID Empty or not
    if (countryId == "") {
      this.resetAllControls('state');
      return;
    }

    this.states = this.stateArray.filter(function (el) {
      return el.country_id == countryId;
    });

    if (this.states.length > 0) {
      this.enableStateControl();
    } else {
      this.resetAllControls('state');
    }

  }

  /**
   * get All Cities
   */
  getCityListing(stateId) {
    this.resetAllControls('city');



    // check State ID Empty or not
    if (stateId == '') {
      console.log('stateId', stateId)
      this.resetAllControls('city');
      return;
    }

    this.cities = this.cityArray.filter(function (el) {
      return el.state_id == stateId;
    });

    if (this.cities.length > 0) {
      this.enableCityControl();
    } else {
      this.resetAllControls('city');
    }

  }

  /**
   * get All Cities
   */
  getZipcodeListing(cityId) {
    this.resetZipcodeControl();


    // check State ID Empty or not
    if (cityId == "") {
      this.resetZipcodeControl();
      return;
    }

    this.zipcodes = this.zipcodeArray.filter(function (el) {
      return el.city_id == cityId;
    });

    if (this.zipcodes.length > 0) {
      this.enableZipcodeControl();
    } else {
      this.resetZipcodeControl();
    }

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
    stateControl.disable(); stateControl.setValue(''); this.states = [];
  }

  /**
  * Reset City Control
  */
  resetCityControl(): void {
    let cityControl = this.signupStep2Form.controls.city_id;
    cityControl.disable(); cityControl.setValue(''); this.cities = [];
  }

  /**
  * Reset Zipcode Control
  */
  resetZipcodeControl() {
    let zipcodeControl = this.signupStep2Form.controls.zipcode;
    zipcodeControl.disable(); zipcodeControl.setValue(''); this.zipcodes = [];
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
