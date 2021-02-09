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

@Component({
  selector: 'app-signup',
  templateUrl: './signup.component.html',
  styleUrls: ['./signup.component.css']
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
  preferredCountries: CountryISO[] = [CountryISO.UnitedStates];

  countries: any = [];
  states: any = [];
  cities: any = [];
  cities2: any = []
  zipcodes: any = [];
  zipcodes2: any = [];
  categories: any = [];
  subcategories1: any = [];
  subcategories2: any = [];
  subcategories3: any = [];

  selectedCategory1Name: any = '';
  selectedCategory2Name: any = '';
  selectedCategory3Name: any = '';

  parentDetails: any = {};
  wizardStep = 0

  constructor(private zone: NgZone, private formBuilder: FormBuilder, private authService: AuthService, private utilsService: UtilsService, private router: Router, private activatedRoute:ActivatedRoute) { }

  ngOnInit(): void {
    this.utilsService.onRequest('yes')
    //this.utilsService.checkAndRedirect();
    this.initalizeSignupStep1Form()
    this.initalizeSignupStep2Form()
    this.initalizeSignupStep3Form()

    this.activatedRoute.params.subscribe((params) => {  
      const userID =  ('userID' in params)?params['userID']:''
      if(userID){
      
        this.wizardStep = 2
        this.getParentDetailsByToken(userID)
      }else{
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
      country_id: ['', [Validators.required]],
      state_id: [{ value: '' }, [Validators.required]],
      city_id: [{ value: '' }, [Validators.required]],
      zipcode: [{ value: '' }, [Validators.required]],
      role: ['', [Validators.required]],
      agree_terms: [false, Validators.requiredTrue],
    });
  }

  //initalize Step 3 form
  private initalizeSignupStep3Form() {
    this.signupStep3Form = this.formBuilder.group({
      user_id: [''],
      country_id: [''],
      state_id: [{ value: '' }],
      city_id: [{ value: '' }],
      zipcode: [{ value: '' }],
      category_id1: [''],
      subcategory_id1: [''],
      category_id2: [''],
      subcategory_id2: [''],
      category_id3: [''],
      subcategory_id3: [''],
    });
  }

  selectSubcategory1(event) {
    this.signupStep3Form.patchValue({
      subcategory_id1: event.target.value
    });
  }

  selectSubcategory2(event) {
    this.signupStep3Form.patchValue({
      subcategory_id2: event.target.value
    });
  }

  selectSubcategory3(event) {
    this.signupStep3Form.patchValue({
      subcategory_id3: event.target.value
    });
  }

  //Authorizing Submit form
  onSignupStep1FormSubmit() {

    if (this.signupStep1Form.invalid) {
      this.isSignupStep1FormSubmitted = true
      return false;
    }


    // Check Email Exists or not
    this.utilsService.processPostRequest('checkEmailExists', this.signupStep1Form.value, true, '').pipe(takeUntil(this.onDestroy$)).subscribe((response) => {
      //console.log('response', response);
      this.getEmailValue = this.signupStep1Form.controls.email.value;
      this.signupStep2Form.patchValue({
        email: this.signupStep1Form.controls.email.value
      });
      // get Country Listing
      this.getCountryListing();
      this.wizard.goToNextStep();
    })


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

    this.utilsService.processSignupRequest('signup', this.signupStep2Form.value, true, '').pipe(takeUntil(this.onDestroy$)).subscribe((response) => {
      //console.log('response', response);

      if (this.signupStep2Form.get('role').value == 'PARENT') {

        
        localStorage.setItem('x-user-ID', response.body['_id']);
        localStorage.setItem(environment.TOKEN_NAME, response.headers.get(environment.TOKEN_NAME));
        localStorage.setItem('x-user-type', 'PARENT');

        this.router.navigateByUrl('/', {skipLocationChange: true}).then(()=>

         this.router.navigate(['/authorization/signup/'+response.body['_id']]))
        /*this.zone.run(() => {
          this.authService.isLoggedIn(true); // Parent Login
        });

        //this.utilsService.onResponse(environment.MESSGES['PARENT-REGISTERED-SUCCESSFULLY'], true);
        this.wizard.goToNextStep();*/

      } else {

        //localStorage.setItem('x-user-type', 'MENTOR')
        this.utilsService.onResponse(environment.MESSGES['REGISTERED-SUCCESSFULLY'], true);
        this.router.navigate(['/mentor/verify-phone/' + response.body['_id']]);

      }
    })

  }

  getParentDetailsByToken(id): void {
    this.utilsService.processPostRequest('getMentorDetails', { userID: id }, true).pipe(takeUntil(this.onDestroy$)).subscribe((response) => {
      this.parentDetails = response;

        //console.log(this.parentDetails);

        this.getCategoryListing(); // get Category Listing

        if (this.parentDetails.country_id != '') {
          this.getStateListing(this.parentDetails.country_id);
        }

        if (this.parentDetails.state_id != '') {
          this.getCityListing(this.parentDetails.state_id);
        }

        if (this.parentDetails.city_id != '') {
          this.getZipcodeListing(this.parentDetails.city_id);
        }

        this.signupStep3Form.patchValue({
          user_id: this.parentDetails._id,
          country_id: this.parentDetails.country_id,
          state_id: this.parentDetails.state_id,
          city_id: this.parentDetails.city_id,
          zipcode: this.parentDetails.zipcode,
        });

      console.log(this.signupStep3Form.value)

    })
  }

  onSignupStep3FormSubmit() {

    this.utilsService.processPostRequest('updateParentInfo', this.signupStep3Form.value, true, '').pipe(takeUntil(this.onDestroy$)).subscribe((response) => {
      this.utilsService.onResponse('Your information updated successfully.', true);
      this.router.navigate(['/parent/dashboard']);
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

      this.utilsService.processPostRequest('subcategory/listing', { category_id: categoryID }, false).pipe(takeUntil(this.onDestroy$)).subscribe((response) => {
        this.subcategories1 = response;
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
      this.utilsService.processPostRequest('subcategory/listing', { category_id: categoryID }, false).pipe(takeUntil(this.onDestroy$)).subscribe((response) => {
        this.subcategories2 = response;
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

      this.utilsService.processPostRequest('subcategory/listing', { category_id: categoryID }, false).pipe(takeUntil(this.onDestroy$)).subscribe((response) => {
        this.subcategories3 = response;
      })
    }

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
   * get All States
   */
  getStateListing(countryId) {
    //let countryId = event.target.value
    this.resetAllControls('state');


    // check Country ID Empty or not
    if (countryId == "") {
      this.resetAllControls('state');
      return;
    }

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
      //console.log('stateId', stateId)
      this.resetAllControls('city');
      return;
    }


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
   * get All Cities
   */
  getCity2Listing(event) {
    let stateId = event.target.value
    this.resetAllControls('city2');
    // check State ID Empty or not
    if (stateId == '') {
      //console.log('stateId', stateId)
      this.resetAllControls('city2');
      return;
    }


    this.utilsService.processPostRequest('city/listing', { state_id: stateId }, false).pipe(takeUntil(this.onDestroy$)).subscribe((response) => {
      this.cities2 = response;
      if (this.cities2.length > 0) {
        this.enableCityControl();
      } else {
        this.resetAllControls('city2');
      }
    })
    if (this.cities.length > 0) {
      this.enableCity2Control();
    } else {
      this.resetAllControls('city2');
    }
  }

  /**
   * get All Cities
   */
  getZipcode2Listing(event) {
    let cityId = event.target.value
    this.resetZipcode2Control();


    // check State ID Empty or not
    if (cityId == "") {
      this.resetZipcode2Control();
      return;
    }

    this.utilsService.processPostRequest('city/cityInfo', { city_id: cityId }, false).pipe(takeUntil(this.onDestroy$)).subscribe((response) => {
      this.zipcodes2 = (response) ? response['zipcodes'] : [];
      if (this.zipcodes2.length > 0) {
        this.enableZipcode2Control();
      } else {
        this.resetZipcode2Control();
      }
    })

    if (this.zipcodes2.length > 0) {
      this.enableZipcodeControl();
    } else {
      this.resetZipcodeControl();
    }

  }
  /**
   * get All Cities
   */
  getZipcodeListing(cityId) {
    //let cityId = event.target.value
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
    stateControl.disable(); stateControl.setValue(''); this.states = [];
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
    zipcodeControl.enable();
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
