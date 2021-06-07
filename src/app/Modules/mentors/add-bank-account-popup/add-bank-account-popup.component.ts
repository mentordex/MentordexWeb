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
  selector: 'app-add-bank-account-popup',
  templateUrl: './add-bank-account-popup.component.html',
  styleUrls: ['./add-bank-account-popup.component.css']
})
export class AddBankAccountPopupComponent implements OnInit {

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
    this.checkQueryParam();
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
      bank_details: this.formBuilder.group({
        account_holder_name: ['', Validators.compose([Validators.required, Validators.minLength(2), Validators.maxLength(50), Validators.pattern('^[a-zA-Z ]*$')])],        
        bank_name: ['', Validators.compose([Validators.required, Validators.minLength(2), Validators.maxLength(50), Validators.pattern('^[a-zA-Z ]*$')])],        
        account_number: ['', [Validators.compose([Validators.required])]],
        routing_number: ['', [Validators.compose([Validators.required])]],
        default_card: [true]
      })
    });
  }


  /**
  * Validate Payment Method.
  */
  validateAddPaymentMethodWizard() {

    //console.log('addPaymentWizard', this.addPaymentWizard.value); return

    this.ngxLoader.start();

    this.isPaymentDetailsSubmitted = true;

    // stop here if form is invalid
    if (this.addPaymentWizard.invalid) {
      return;
    }
    

    this.utilsService.processPostRequest('addYourBankAccount', this.addPaymentWizard.value, true, '').pipe(takeUntil(this.onDestroy$)).subscribe((response) => {
      //console.log(response);
      this.utilsService.onResponse(environment.MESSGES['PAYMENT-METHOD-SUCCESSFULL'], true);
      this.close();
      
    })
  }

 

  ngOnChanges(): void {
    //to show the modal popup
    if (this.isOpen) {

      $(this.exampleModal.nativeElement).modal({ backdrop: 'static', keyboard: false, show: true });
      
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
