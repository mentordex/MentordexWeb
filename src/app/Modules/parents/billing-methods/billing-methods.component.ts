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

@Component({
  selector: 'app-billing-methods',
  templateUrl: './billing-methods.component.html',
  styleUrls: ['./billing-methods.component.css']
})
export class BillingMethodsComponent implements OnInit {

  private onDestroy$: Subject<void> = new Subject<void>();


  id: any = '';
  paymentDetails: any = {};
  paymentDetailsArray: any = [];
  isPaymentMethodModalOpen: boolean = false;
  //selectedPriceId: any = '';


  constructor(private zone: NgZone, private formBuilder: FormBuilder, private authService: AuthService, private utilsService: UtilsService, private router: Router, private activatedRoute: ActivatedRoute) { }

  ngOnInit(): void {
    this.checkQueryParam();
  }

  private checkQueryParam() {
    this.id = localStorage.getItem('x-user-ID');
    this.getPaymentDetailsByToken(this.id);
  }

  /**
   * get Mentor Details By Token
  */
  getPaymentDetailsByToken(id): void {
    this.utilsService.processPostRequest('getSavedPaymentMethod', { userID: this.id }, true).pipe(takeUntil(this.onDestroy$)).subscribe((response) => {
      this.paymentDetails = response;
      //console.log(this.paymentDetails.payment_details);
      this.paymentDetailsArray = this.paymentDetails.payment_details;
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

  public defaultCard(card_id): void {
    Swal.fire({
      title: 'Are you sure you want to make this card default?',
      text: '',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonText: 'Yes',
      cancelButtonText: 'No'
    }).then((result) => {
      if (result.value) {

        this.utilsService.processPostRequest('defaultCard', { userID: this.id, card_id: card_id }, false).pipe(takeUntil(this.onDestroy$)).subscribe((response) => {
          this.utilsService.onResponse(environment.MESSGES['DEFAULT-CARD-UPDATE-SUCCESS'], true);
          this.getPaymentDetailsByToken(this.id);

        })

      }
    })
  }

  public removeCard(card_id): void {
    Swal.fire({
      title: 'Are you sure you want to remove this card default?',
      text: '',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonText: 'Yes',
      cancelButtonText: 'No'
    }).then((result) => {
      if (result.value) {

        this.utilsService.processPostRequest('removeCard', { userID: this.id, card_id: card_id }, false).pipe(takeUntil(this.onDestroy$)).subscribe((response) => {
          this.utilsService.onResponse(environment.MESSGES['DEFAULT-CARD-REMOVED'], true);
          this.getPaymentDetailsByToken(this.id);

        })

      }
    })
  }

  //destroy all subscription
  public ngOnDestroy(): void {
    this.onDestroy$.next();
  }


}
