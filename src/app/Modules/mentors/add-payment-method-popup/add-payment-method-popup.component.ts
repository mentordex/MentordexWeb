import { Component, OnInit, OnDestroy, ViewChild, NgZone, EventEmitter, Output, Input, ElementRef } from '@angular/core';
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

import { CreditCardValidators } from 'angular-cc-library';

import { NgxUiLoaderService } from 'ngx-ui-loader';


declare var $;

@Component({
  selector: 'app-add-payment-method-popup',
  templateUrl: './add-payment-method-popup.component.html',
  styleUrls: ['./add-payment-method-popup.component.css']
})
export class AddPaymentMethodPopupComponent implements OnInit {

  private onDestroy$: Subject<void> = new Subject<void>();
  @Input() isOpen: any;
  @ViewChild('exampleModal') exampleModal: ElementRef;

  @Output() onClose: EventEmitter<any> = new EventEmitter<any>();
  @Output() hidePaymentMethodPopup: EventEmitter<any> = new EventEmitter<any>();

  @ViewChild(WizardComponent)
  public wizard: WizardComponent;
  wizardStep = 0;

  id: any = '';
  addPaymentWizard: FormGroup;
  addAddressWizard: FormGroup;
  isPaymentDetailsSubmitted: boolean = false;
  isAddressDetailsSubmitted: boolean = false;
  yearRange: any = [];
  countries: any = [];

  months = [{ name: "Jan", value: 1 }, { name: "Feb", value: 2 }, { name: "Mar", value: 3 }, { name: "Apr", value: 4 }, { name: "May", value: "5" }, { name: "Jun", value: 6 }, { name: "Jul", value: 7 }, { name: "Aug", value: 8 }, { name: "Sep", value: 9 }, { name: "Oct", value: 10 }, { name: "Nov", value: 11 }, { name: "Dec", value: 12 }];
  currentYear: number = new Date().getFullYear();   // get Current Year
  maxYear: number = 2030;
  minYear: number = this.currentYear;

  

  constructor(private zone: NgZone, private formBuilder: FormBuilder, private authService: AuthService, private utilsService: UtilsService, private router: Router, private activatedRoute: ActivatedRoute, private ngxLoader: NgxUiLoaderService) {
    this.addPaymentForm();
    this.addAddressForm();
    this.checkQueryParam();
    this.getCountryListing();
  }

  ngOnInit(): void {

  }


  private checkQueryParam() {
    this.id = localStorage.getItem('x-user-ID');
    this.addPaymentWizard.patchValue({
      userID: this.id
    });

  }

  /**
  * Initialize Payment Detail Fields.
  */
  private addPaymentForm() {
    this.addPaymentWizard = this.formBuilder.group({
      userID: [''],
      priceId: [''],
      payment_details: this.formBuilder.group({
        credit_card_first_name: ['', Validators.compose([Validators.required, Validators.minLength(2), Validators.maxLength(50), Validators.pattern('^[a-zA-Z ]*$')])],
        credit_card_last_name: ['', Validators.compose([Validators.required, Validators.minLength(2), Validators.maxLength(50), Validators.pattern('^[a-zA-Z ]*$')])],
        credit_card_number: ['', [Validators.compose([Validators.required]), CreditCardValidators.validateCCNumber]],
        expiry_month: ['', [Validators.compose([Validators.required])]],
        expiry_year: ['', [Validators.compose([Validators.required])]],
        cvc_number: ['', Validators.compose([Validators.required, Validators.min(1), Validators.minLength(3), Validators.maxLength(4), Validators.pattern(/^-?(0|[1-9]\d*)?$/)])],
        default_card: [true]
      },
        {
          // check whether our password and confirm password match
          validators: CustomValidators.creditCardExpiryValidator
        })
    });
  }

  /**
  * Initialize Payment Detail Fields.
  */
  private addAddressForm() {
    this.addAddressWizard = this.formBuilder.group({
      billing_details: this.formBuilder.group({
        address1: ['', Validators.compose([Validators.required, Validators.minLength(2), Validators.maxLength(100)])],
        address2: ['', Validators.compose([Validators.minLength(2), Validators.maxLength(100)])],
        country: [{ value: '' }, [Validators.required]],
        state: ['', Validators.compose([Validators.required, Validators.minLength(2), Validators.maxLength(50), Validators.pattern('^[a-zA-Z ]*$')])],
        city: ['', Validators.compose([Validators.required, Validators.minLength(2), Validators.maxLength(50), Validators.pattern('^[a-zA-Z ]*$')])],
        zipcode: ['', Validators.compose([Validators.required, Validators.minLength(5), Validators.maxLength(6)])],
      })
    });
  }

  /**
   * get All Countries
   */
  getCountryListing() {

    this.utilsService.processGetRequest('country/listing', false).pipe(takeUntil(this.onDestroy$)).subscribe((response) => {
      this.countries = response;
    })

  }

  /**
  * Validate Payment Method.
  */
  validateAddPaymentMethodWizard() {

    //console.log('addPaymentWizard', this.addPaymentWizard)

    this.ngxLoader.start();

    this.isPaymentDetailsSubmitted = true;

    // stop here if form is invalid
    if (this.addPaymentWizard.invalid) {
      return;
    }
    //this.wizard.goToNextStep();

    this.utilsService.processPostRequest('addYourPaymentMethod', this.addPaymentWizard.value, true, '').pipe(takeUntil(this.onDestroy$)).subscribe((response) => {
      //console.log(response);
      this.utilsService.onResponse(environment.MESSGES['PAYMENT-METHOD-SUCCESSFULL'], true);
      this.close();
      //this.utilsService.onResponse('Your information updated successfully.', true);
      //this.router.navigate(['/mentor/skills']);
    })
  }

  /**
 * Validate Payment Method.
 */
  validateAddAddressWizard() {

    //console.log('addPaymentWizard', this.addPaymentWizard)

    this.isAddressDetailsSubmitted = true;

    // stop here if form is invalid
    if (this.addAddressWizard.invalid) {
      return;
    }

    var mergePaymentData = Object.assign(this.addPaymentWizard.value, this.addAddressWizard.value);
    //console.log(mergePaymentData); return;
    this.utilsService.processPostRequest('buySubscription', mergePaymentData, true, '').pipe(takeUntil(this.onDestroy$)).subscribe((response) => {
      //console.log(response);
      //this.utilsService.onResponse('Your information updated successfully.', true);
      //this.router.navigate(['/mentor/skills']);
    })

  }

  ngOnChanges(): void {
    //to show the modal popup
    if (this.isOpen) {

      $(this.exampleModal.nativeElement).modal({ backdrop: 'static', keyboard: false, show: true });
      //console.log(this.membershipDetails);
      this.addPaymentWizard.patchValue({
        //priceId: this.membershipDetails
      });
    }
  }

  close() {
    this.isOpen = false
    this.hidePaymentMethodPopup.emit(false);
    $(this.exampleModal.nativeElement).modal('hide'); // Close the current popup

  }

  getYearRange() {
    for (let i = 0; i < 15; i++) {
      this.yearRange.push({
        value: this.currentYear + i
      });
    }
  }

  ngAfterViewInit() {
    this.getYearRange();
  }

  //destroy all subscription
  public ngOnDestroy(): void {
    this.onDestroy$.next();
  }

}
