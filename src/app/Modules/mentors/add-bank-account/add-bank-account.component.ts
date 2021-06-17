import { Component, OnInit, OnDestroy, ElementRef, ViewChild, NgZone } from '@angular/core';
import { FormBuilder, FormGroup, Validators, ValidatorFn, ValidationErrors, FormControl, FormArray, AbstractControl } from '@angular/forms';
import { Router, ActivatedRoute } from "@angular/router";
import { takeUntil } from 'rxjs/operators';
import { Subject } from 'rxjs';

// import fade in animation
import { fadeInAnimation } from '../../../core/animations';
import { AuthService, UtilsService } from '../../../core/services';

//import enviornment
import { environment } from '../../../../environments/environment';

//import custom validators
import { CustomValidators } from '../../../core/custom-validators';

import Swal from 'sweetalert2'

import { NgxUiLoaderService } from 'ngx-ui-loader';

@Component({
  selector: 'app-add-bank-account',
  templateUrl: './add-bank-account.component.html',
  styleUrls: ['./add-bank-account.component.css']
})
export class AddBankAccountComponent implements OnInit {

  private onDestroy$: Subject<void> = new Subject<void>();


  id: any = '';
  paymentDetails: any = {};
  bankDetailsArray: any = [];
  isPaymentMethodModalOpen: boolean = false;
  //selectedPriceId: any = '';


  constructor(private zone: NgZone, private formBuilder: FormBuilder, private authService: AuthService, private utilsService: UtilsService, private router: Router, private activatedRoute: ActivatedRoute, private ngxLoader: NgxUiLoaderService) { }

  ngOnInit(): void {
    this.checkQueryParam();
  }

  private checkQueryParam() {
    this.ngxLoader.start();
    this.id = localStorage.getItem('x-user-ID');
    this.getPaymentDetailsByToken(this.id);
  }

  /**
   * get Mentor Details By Token
  */
  getPaymentDetailsByToken(id): void {
    this.utilsService.processPostRequest('getSavedBankAccounts', { userID: this.id }, true).pipe(takeUntil(this.onDestroy$)).subscribe((response) => {
      this.paymentDetails = response;
      console.log(this.paymentDetails.bank_details);
      this.bankDetailsArray = this.paymentDetails.bank_details;

      this.ngxLoader.stop();
    })
  }

  showPaymentMethodPopup(): void {

    this.isPaymentMethodModalOpen = true;
    //this.selectedPriceId = priceId
  }

  hidePaymentMethodPopup(isOpened: boolean): void {
    // console.log('carDetails', isOpened);
    this.isPaymentMethodModalOpen = isOpened; //set to false which will reset modal to show on click again
    this.checkQueryParam();
  }

  public defaultBankAccount(bank_id):void {
    Swal.fire({
      title: 'Are you sure you want to make this account default?',
      text: '',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonText: 'Yes',
      cancelButtonText: 'No'
    }).then((result) => {
      if (result.value) {
        this.ngxLoader.start();
        this.utilsService.processPostRequest('defaultBankAccount', { userID: this.id, bank_id: bank_id }, false).pipe(takeUntil(this.onDestroy$)).subscribe((response) => {
          this.utilsService.onResponse(environment.MESSGES['DEFAULT-BANK-UPDATE-SUCCESS'], true);
          this.getPaymentDetailsByToken(this.id);
          this.ngxLoader.stop();
        })

      }
    })
  }

  public removeBankAccount(bank_id): void {
    Swal.fire({
      title: 'Are you sure you want to remove this account?',
      text: '',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonText: 'Yes',
      cancelButtonText: 'No'
    }).then((result) => {
      if (result.value) {
        this.ngxLoader.start();
        this.utilsService.processPostRequest('removeBankAccount', { userID: this.id, bank_id: bank_id }, false).pipe(takeUntil(this.onDestroy$)).subscribe((response) => {
          this.utilsService.onResponse(environment.MESSGES['DEFAULT-ACCOUNT-REMOVED'], true);
          this.getPaymentDetailsByToken(this.id);
          this.ngxLoader.stop();
        })

      }
    })
  }

  //destroy all subscription
  public ngOnDestroy(): void {
    this.onDestroy$.next();
  }

}