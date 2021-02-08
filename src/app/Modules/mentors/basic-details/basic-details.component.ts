import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators, ValidatorFn, ValidationErrors, FormControl } from '@angular/forms';
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



export const atLeastOne = (validator: ValidatorFn) => (
  group: FormGroup,
): ValidationErrors | null => {
  const hasAtLeastOne =
    group &&
    group.controls &&
    Object.keys(group.controls).some(k => !validator(group.controls[k]));

  return hasAtLeastOne ? null : { atLeastOne: true };
};


const getMonth = (idx) => {

  var objDate = new Date();
  objDate.setDate(1);
  objDate.setMonth(idx - 1);

  var locale = "en-us",
    month = objDate.toLocaleString(locale, { month: "long" });

  return month;
}

@Component({
  selector: 'app-basic-details',
  templateUrl: './basic-details.component.html',
  styleUrls: ['./basic-details.component.css']
})
export class BasicDetailsComponent implements OnInit {

  private onDestroy$: Subject<void> = new Subject<void>();
  id: any = ''
  mentorDetails: any = {};
  basicDetailsForm: FormGroup;
  isBasicDetailsFormSubmitted: boolean = false

  months = Array(12).fill(0).map((i, idx) => getMonth(idx + 1));
  selectedYear = 2004;
  selectedMonth = 1;
  selectedDay = 1;

  countries: any = [];
  states: any = [];
  cities: any = [];
  zipcodes: any = [];

  countryArray = [{ id: 1, value: 'US' }];

  stateArray = [{ id: 1, value: 'Alabama', country_id: 1 }, { id: 2, value: 'Alaska', country_id: 1 }, { id: 3, value: 'California', country_id: 1 }, { id: 4, value: 'Florida', country_id: 1 }, { id: 5, value: 'Washington', country_id: 1 }];

  cityArray = [{ id: 1, value: 'Abbeville', state_id: 1, country_id: 1 }, { id: 2, value: 'Anniston', state_id: 1, country_id: 1 }, { id: 3, value: 'Bakerhill', state_id: 1, country_id: 1 }, { id: 4, value: 'Bettles', state_id: 2, country_id: 1 }, { id: 5, value: 'Marshall', state_id: 2, country_id: 1 }, { id: 6, value: 'Corona', state_id: 3, country_id: 1 }, { id: 7, value: 'Greenfield', state_id: 3, country_id: 1 }, { id: 8, value: 'Miami', state_id: 4, country_id: 1 }, { id: 9, value: 'Tampa', state_id: 4, country_id: 1 }, { id: 10, value: 'Newcastle', state_id: 5, country_id: 1 }, { id: 11, value: 'Woodland', state_id: 5, country_id: 1 }];

  zipcodeArray = [{ id: 1, value: '70510', city_id: 1 }, { id: 2, value: '70511', city_id: 1 }, { id: 3, value: '36201', city_id: 2 }, { id: 4, value: '36204', city_id: 2 }, { id: 5, value: '36027', city_id: 3 }, { id: 6, value: '99726', city_id: 4 }, { id: 7, value: '56258', city_id: 5 }, { id: 8, value: '92877', city_id: 6 }, { id: 9, value: '92880', city_id: 6 }, { id: 10, value: '46140', city_id: 7 }, { id: 11, value: '33125', city_id: 8 }, { id: 12, value: '33129', city_id: 8 }, { id: 13, value: '33601', city_id: 9 }, { id: 14, value: '33605', city_id: 9 }, { id: 15, value: '73065', city_id: 10 }, { id: 16, value: '73072', city_id: 10 }, { id: 17, value: '95695', city_id: 11 }, { id: 18, value: '95776', city_id: 11 }];

  constructor(private activatedRoute: ActivatedRoute, private formBuilder: FormBuilder, private authService: AuthService, private utilsService: UtilsService, private router: Router) { }

  ngOnInit(): void {
    this.initalizeBasicDetailsForm()
    this.checkQueryParam();
    this.getCountryListing();
  }

  //initalize Basic Detailsform
  private initalizeBasicDetailsForm() {
    this.basicDetailsForm = this.formBuilder.group({
      id: [''],
      email: ['', [Validators.required, Validators.pattern("^[a-z0-9._%+-]+@[a-z0-9.-]+\\.[a-z]{2,4}$")]],
      phone: ['', Validators.required],
      gender: ['', Validators.required],
      tags: new FormControl([{ value: '' }], Validators.compose([Validators.required, Validators.minLength(1)])),
      dob: this.formBuilder.group({
        year: ['', Validators.required],
        month: ['', Validators.required],
        day: ['', Validators.required],
      }),
      address1: ['', Validators.compose([Validators.required, Validators.minLength(2), Validators.maxLength(100)])],
      address2: ['', Validators.compose([Validators.minLength(2), Validators.maxLength(100)])],
      country_id: [{ value: '' }, [Validators.required]],
      state_id: [{ value: '' }, [Validators.required]],
      city_id: [{ value: '' }, [Validators.required]],
      zipcode: [{ value: '' }, Validators.required],
      social_links: this.formBuilder.group({
        linkedin_url: [''],
        twitter_url: [''],
        instagram_url: [''],
      }, { validator: atLeastOne(Validators.required) }),
    });
  }

  // URL Query Param
  private checkQueryParam() {

    this.activatedRoute.params.subscribe((params) => {
      this.id = params['id'];
      this.getMentorDetailsByToken(params['id']);
      this.basicDetailsForm.patchValue({
        id: params['id']
      });
    });
  }

  /**
   * get Mentor Details By Token
  */
  getMentorDetailsByToken(id): void {
    this.utilsService.processPostRequest('getMentorDetails', { userID: this.id }, true).pipe(takeUntil(this.onDestroy$)).subscribe((response) => {
      this.mentorDetails = response;
      //console.log(this.mentorDetails);


      

      if (this.mentorDetails.country_id != '') {
        this.getStateListing(this.mentorDetails.country_id);
      }

      if (this.mentorDetails.state_id != '') {
        this.getCityListing(this.mentorDetails.state_id);
      }

      if (this.mentorDetails.city_id != '') {
        this.getZipcodeListing(this.mentorDetails.city_id);
      }

      this.basicDetailsForm.patchValue({
        email: this.mentorDetails.email,
        phone: this.mentorDetails.phone,
        country_id: this.mentorDetails.country_id,
        state_id: this.mentorDetails.state_id,
        city_id: this.mentorDetails.city_id,
        zipcode: this.mentorDetails.zipcode,
      });

    })
  }

  /**
   * on Submit Basic Details
  */
  onSubmitBasicDetailsForm(): void {

  }

  public get days() {

    const dayCount = this.getDaysInMonth(this.selectedYear, this.selectedMonth);
    return Array(dayCount).fill(0).map((i, idx) => idx + 1)
  }

  public get years() {
    var currentYear = new Date().getFullYear(), years = [];
    let startYear = currentYear - 60;
    while (startYear <= currentYear) {
      years.push(startYear++);
    }
    return years;
  }

  public getDaysInMonth(year: number, month: number) {

    return 32 - new Date(year, month - 1, 32).getDate();
  }

  public onSelectMonth(month) {
    this.basicDetailsForm.controls.dob.get('day').patchValue('');
    this.selectedMonth = month;
  }

  public onSelectYear(year) {
    this.selectedYear = year;
  }

  /**
   * get All Countries
   */
  getCountryListing() {

    this.utilsService.processGetRequest('country/listing', false).pipe(takeUntil(this.onDestroy$)).subscribe((response) => {
      this.countries = response;
    })

    //this.countries = this.countryArray;
    this.resetAllControls('all');
  }

  /**
   * get All States
   */
  getStateListing(countryId) {

    //let countryId = event.target.value;
    this.resetAllControls('state');


    // check Country ID Empty or not
    if (countryId == "") {
      this.resetAllControls('state');
      return;
    }

    /* this.states = this.stateArray.filter(function (el) {
      return el.country_id == countryId;
    });

    if (this.states.length > 0) {
      this.enableStateControl();
    } else {
      this.resetAllControls('state');
    }*/

    this.utilsService.processPostRequest('state/listing', { country_id: countryId }, false).pipe(takeUntil(this.onDestroy$)).subscribe((response) => {
      this.states = response;
      if (this.states.length > 0) {
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

    // check State ID Empty or not
    if (stateId == '') {
      console.log('stateId', stateId)
      this.resetAllControls('city');
      return;
    }

    /* this.cities = this.cityArray.filter(function (el) {
      return el.state_id == stateId;
    });

    if (this.cities.length > 0) {
      this.enableCityControl();
    } else {
      this.resetAllControls('city');
    } */

    this.utilsService.processPostRequest('city/listing', { state_id: stateId }, false).pipe(takeUntil(this.onDestroy$)).subscribe((response) => {
      this.cities = response;
      if (this.cities.length > 0) {
        this.enableCityControl();
      } else {
        this.resetAllControls('city');
      }
    })

  }

  /**
   * get All Zipcodes
   */
  getZipcodeListing(cityId) {
    //let cityId = event.target.value;
    this.resetZipcodeControl();

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
    });

    /*this.zipcodes = this.zipcodeArray.filter(function (el) {
      return el.city_id == cityId;
    });

    if (this.zipcodes.length > 0) {
      this.enableZipcodeControl();
    } else {
      this.resetZipcodeControl();
    } */

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
    let stateControl = this.basicDetailsForm.controls.state_id;
    stateControl.disable(); stateControl.setValue(''); this.states = [];
  }

  /**
  * Reset City Control
  */
  resetCityControl(): void {
    let cityControl = this.basicDetailsForm.controls.city_id;
    cityControl.disable(); cityControl.setValue(''); this.cities = [];
  }

  /**
  * Reset Zipcode Control
  */
  resetZipcodeControl() {
    let zipcodeControl = this.basicDetailsForm.controls.zipcode;
    zipcodeControl.disable(); zipcodeControl.setValue(''); this.zipcodes = [];
  }

  /**
  * Enable State Control
  */
  enableStateControl(): void {
    let stateControl = this.basicDetailsForm.controls.state_id;
    stateControl.enable();
  }

  /**
  * Enable City Control
  */
  enableCityControl(): void {
    let cityControl = this.basicDetailsForm.controls.city_id;
    cityControl.enable();
  }

  /**
  * Enable Zipcode Control
  */
  enableZipcodeControl(): void {
    let zipcodeControl = this.basicDetailsForm.controls.zipcode;
    zipcodeControl.enable();
  }


  //destroy all subscription
  public ngOnDestroy(): void {
    this.onDestroy$.next();
  }

}
