import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators, ValidatorFn, ValidationErrors, FormControl, AbstractControl, FormArray } from '@angular/forms';
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

export const minLengthArray = (min: number) => {
  return (c: AbstractControl): { [key: string]: any } => {
    if (c.value.length >= min)
      return null;

    return { MinLengthArray: true };
  }
}

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

  countryArrayListing: any = [];
  stateArrayListing: any = [];
  cityArrayListing: any = [];

  checkAdminStatus:any = ['NEW', 'APPROVED', 'RESCHEDULED', 'IN-PROCESS', 'REJECTED'];


  countryArray = [{ id: 1, value: 'US' }];

  stateArray = [{ id: 1, value: 'Alabama', country_id: 1 }, { id: 2, value: 'Alaska', country_id: 1 }, { id: 3, value: 'California', country_id: 1 }, { id: 4, value: 'Florida', country_id: 1 }, { id: 5, value: 'Washington', country_id: 1 }];

  cityArray = [{ id: 1, value: 'Abbeville', state_id: 1, country_id: 1 }, { id: 2, value: 'Anniston', state_id: 1, country_id: 1 }, { id: 3, value: 'Bakerhill', state_id: 1, country_id: 1 }, { id: 4, value: 'Bettles', state_id: 2, country_id: 1 }, { id: 5, value: 'Marshall', state_id: 2, country_id: 1 }, { id: 6, value: 'Corona', state_id: 3, country_id: 1 }, { id: 7, value: 'Greenfield', state_id: 3, country_id: 1 }, { id: 8, value: 'Miami', state_id: 4, country_id: 1 }, { id: 9, value: 'Tampa', state_id: 4, country_id: 1 }, { id: 10, value: 'Newcastle', state_id: 5, country_id: 1 }, { id: 11, value: 'Woodland', state_id: 5, country_id: 1 }];

  zipcodeArray = [{ id: 1, value: '70510', city_id: 1 }, { id: 2, value: '70511', city_id: 1 }, { id: 3, value: '36201', city_id: 2 }, { id: 4, value: '36204', city_id: 2 }, { id: 5, value: '36027', city_id: 3 }, { id: 6, value: '99726', city_id: 4 }, { id: 7, value: '56258', city_id: 5 }, { id: 8, value: '92877', city_id: 6 }, { id: 9, value: '92880', city_id: 6 }, { id: 10, value: '46140', city_id: 7 }, { id: 11, value: '33125', city_id: 8 }, { id: 12, value: '33129', city_id: 8 }, { id: 13, value: '33601', city_id: 9 }, { id: 14, value: '33605', city_id: 9 }, { id: 15, value: '73065', city_id: 10 }, { id: 16, value: '73072', city_id: 10 }, { id: 17, value: '95695', city_id: 11 }, { id: 18, value: '95776', city_id: 11 }];

  validUrl = '(https?://)?([\\da-z.-]+)\\.([a-z.]{2,6})[/\\w .-]*/?';

  

  constructor(private activatedRoute: ActivatedRoute, private formBuilder: FormBuilder, private authService: AuthService, private utilsService: UtilsService, private router: Router) { }

  ngOnInit(): void {
    this.initalizeBasicDetailsForm()
    this.checkQueryParam();
    this.getCountryListing();
  }

  //initalize Basic Detailsform
  private initalizeBasicDetailsForm() {
    this.basicDetailsForm = this.formBuilder.group({
      userID: [''],
      email: ['', [Validators.required, Validators.pattern("^[a-z0-9._%+-]+@[a-z0-9.-]+\\.[a-z]{2,4}$")]],
      phone: ['', Validators.required],
      gender: ['', Validators.required],
      primary_language: new FormControl([{ value: '' }], minLengthArray(1)),
      dob: this.formBuilder.group({
        year: ['', Validators.required],
        month: ['', Validators.required],
        day: ['', Validators.required],
      }),
      address1: ['', Validators.compose([Validators.required, Validators.minLength(2), Validators.maxLength(100)])],
      address2: ['', Validators.compose([Validators.minLength(2), Validators.maxLength(100)])],
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
      country_id: [{ value: '' }, [Validators.required]],
      state_id: [{ value: '' }, [Validators.required]],
      city_id: [{ value: '' }, [Validators.required]],
      zipcode: [{ value: '' }, Validators.required],
      social_links: this.formBuilder.group({
        linkedin_url: ['', [Validators.pattern(this.validUrl)]],
        twitter_url: ['', [Validators.pattern(this.validUrl)]],
        instagram_url: ['', [Validators.pattern(this.validUrl)]],
      }, { validator: atLeastOne(Validators.required) }),
    });
  }

  // URL Query Param
  private checkQueryParam() {
    this.id = localStorage.getItem('x-user-ID');
    this.getMentorDetailsByToken(this.id);
    this.basicDetailsForm.patchValue({
      userID: this.id
    });
  }

  /**
   * get Mentor Details By Token
  */
  getMentorDetailsByToken(id): void {
    this.utilsService.processPostRequest('getMentorDetails', { userID: this.id }, true).pipe(takeUntil(this.onDestroy$)).subscribe((response) => {
      this.mentorDetails = response;
      //console.log(this.mentorDetails);

      if (this.checkAdminStatus.indexOf(this.mentorDetails.admin_status) > -1) {
        this.router.navigate(['/mentor/application-status']);
      }

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
        gender: this.mentorDetails.gender ? this.mentorDetails.gender : '',
        dob: this.mentorDetails.dob ? this.mentorDetails.dob : {},
        primary_language: this.mentorDetails.primary_language ? this.mentorDetails.primary_language : new FormControl({value:''}),
        address1: this.mentorDetails.address1 ? this.mentorDetails.address1 : '',
        address2: this.mentorDetails.address2 ? this.mentorDetails.address2 : '',
        social_links: this.mentorDetails.social_links ? this.mentorDetails.social_links: {},
      });

      this.basicDetailsForm.controls.country.patchValue({
        country_id: this.mentorDetails.country.country_id,
        value: this.mentorDetails.country.value
      });

      this.basicDetailsForm.controls.state.patchValue({
        state_id: this.mentorDetails.state.state_id,
        value: this.mentorDetails.state.value
      });
      this.basicDetailsForm.controls.city.patchValue({
        city_id: this.mentorDetails.city.city_id,
        value: this.mentorDetails.city.value
      });

      //console.log(this.basicDetailsForm.value)

    })
  }

  /**
   * on Submit Basic Details
  */
  onSubmitBasicDetailsForm() {
    
    if (this.basicDetailsForm.invalid) {
      this.isBasicDetailsFormSubmitted = true
      return false;
    }


    //console.log(this.basicDetailsForm.value);
    //return;

    //console.log('basicDetailsForm', this.basicDetailsForm.value);
    this.utilsService.processPostRequest('updateBasicDetails', this.basicDetailsForm.value, true, '').pipe(takeUntil(this.onDestroy$)).subscribe((response) => {
      //console.log(response);
      //this.utilsService.onResponse('Your information updated successfully.', true);
      this.router.navigate(['/mentor/skills']);
    })
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
      this.countryArrayListing = response;
    })

    //this.countries = this.countryArray;
    //this.resetAllControls('all');
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

    this.utilsService.processPostRequest('state/listing', { country_id: countryId }, false).pipe(takeUntil(this.onDestroy$)).subscribe((response) => {
      this.states = response;
      this.stateArrayListing = response;


      if (this.states.length > 0) {
        this.enableStateControl();
      } else {
        this.resetAllControls('state');
      }

      this.countryArrayListing = this.countryArrayListing.filter(function (item) {
        return item._id === countryId;
      });

      //console.log(this.stateArrayListing);

      this.basicDetailsForm.controls.country.patchValue({
        country_id: this.countryArrayListing[0]._id,
        value: this.countryArrayListing[0].title
      });

      //console.log(this.basicDetailsForm.controls.country.value)
    })

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
      //console.log('stateId', stateId)
      this.resetAllControls('city');
      return;
    }

    this.utilsService.processPostRequest('city/listing', { state_id: stateId }, false).pipe(takeUntil(this.onDestroy$)).subscribe((response) => {
      this.cities = response;
      this.cityArrayListing = response;
      //console.log(this.cityArrayListing);
      if (this.cities.length > 0) {
        this.enableCityControl();
      } else {
        this.resetAllControls('city');
      }
      //console.log(this.stateArrayListing);
      this.stateArrayListing = this.stateArrayListing.filter(function (item) {
        return item._id === stateId;
      });
  
      this.basicDetailsForm.controls.state.patchValue({
        state_id: this.stateArrayListing[0]._id,
        value: this.stateArrayListing[0].title
      });

      //console.log(this.basicDetailsForm.controls.state.value)

    })

  }

  /**
   * get All Zipcodes
   */
  getZipcodeListing(cityId) {
    //let cityId = event.target.value;
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


      //console.log(this.stateArrayListing);

      this.basicDetailsForm.controls.city.patchValue({
        city_id: this.cityArrayListing[0]._id,
        value: this.cityArrayListing[0].title
      });

      //console.log(this.basicDetailsForm.controls.city.value)


    });

    

  }

  /**
  * Reset All Control
  */
  resetAllControls(value): void {

    if (value == 'state') {
      //console.log(value)
      this.resetStateControl();
      this.resetCityControl();
      this.resetZipcodeControl();
    }

    if (value == 'city') {
      //console.log(value)
      this.resetCityControl();
      this.resetZipcodeControl();
    }

    if (value == 'all') {
      //console.log(value)
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
    stateControl.disable(); stateControl.patchValue(''); this.states = []; this.stateArrayListing = [];

    this.basicDetailsForm.controls.state.patchValue({
      state_id: '',
        value: ''
    });
  }

  /**
  * Reset City Control
  */
  resetCityControl(): void {
    let cityControl = this.basicDetailsForm.controls.city_id;
    cityControl.disable(); cityControl.patchValue(''); this.cities = []; this.cityArrayListing = [];

    this.basicDetailsForm.controls.city.patchValue({
      city_id: '',
        value: ''
    });
  }

  /**
  * Reset Zipcode Control
  */
  resetZipcodeControl() {
    let zipcodeControl = this.basicDetailsForm.controls.zipcode;
    zipcodeControl.disable(); zipcodeControl.patchValue(''); this.zipcodes = [];
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
