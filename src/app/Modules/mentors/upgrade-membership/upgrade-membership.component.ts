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
  selector: 'app-upgrade-membership',
  templateUrl: './upgrade-membership.component.html',
  styleUrls: ['./upgrade-membership.component.css']
})
export class UpgradeMembershipComponent implements OnInit {

  private onDestroy$: Subject<void> = new Subject<void>();

  id: any = '';
  paymentDetails: any = {};
  membershipDetails: any = {};
  paymentDetailsArray: any = [];

  isPaymentMethodModalOpen: boolean = false;
  selectedPriceId: any = '';
  selectedMembershipId: any = '';
  membershipPlans: any = [];

  constructor(private zone: NgZone, private formBuilder: FormBuilder, private authService: AuthService, private utilsService: UtilsService, private router: Router, private activatedRoute: ActivatedRoute) { }

  ngOnInit(): void {
    this.getMembershipListing();
    this.checkQueryParam();
  }

  private checkQueryParam() {
    this.id = localStorage.getItem('x-user-ID');
    this.getPaymentDetailsByToken(this.id);
    this.getMembershipDetailsToken(this.id);
  }

  /**
   * get Payment Details By Token
  */
  getPaymentDetailsByToken(id): void {
    this.utilsService.processPostRequest('getSavedPaymentMethod', { userID: this.id }, true).pipe(takeUntil(this.onDestroy$)).subscribe((response) => {
      this.paymentDetails = response;
      //console.log(this.paymentDetails);
      this.paymentDetailsArray = this.paymentDetails.payment_details;
      this.paymentDetailsArray = this.paymentDetailsArray.filter(function (item) {
        return item.default === true;
      });

      //console.log(this.paymentDetailsArray);

    })
  }

  /**
   * get Mentor Membership Details By Token
  */
  getMembershipDetailsToken(id): void {
    this.utilsService.processPostRequest('getMentorMembershipDetails', { userID: this.id }, true).pipe(takeUntil(this.onDestroy$)).subscribe((response) => {
      console.log(response);
      this.membershipDetails = response;
    })
  }

  /**
   * get All Mmebership Plans
   */
  getMembershipListing() {
    this.utilsService.processGetRequest('membership/getMembershipPlans', false).pipe(takeUntil(this.onDestroy$)).subscribe((response) => {
      //console.log(response);
      this.membershipPlans = response;
    })
  }

  upgradeYourSubscription() {
    Swal.fire({
      title: 'Are you sure, you want to upgrade your subscription?',
      text: 'You will charge automatically from your default payment method',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonText: 'Yes',
      cancelButtonText: 'No'
    }).then((result) => {
      if (result.value) {

        this.utilsService.processPostRequest('upgradeYourSubscription', { userID: this.id }, true).pipe(takeUntil(this.onDestroy$)).subscribe((response) => {
          this.utilsService.onResponse(environment.MESSGES['SUBSCRIPTION-CANCEL'], true);
          this.getMembershipDetailsToken(this.id);

        })

      }
    })
  }

  showPaymentMethodPopup(priceId, membershipId): void {
    //console.log('priceDetails', priceId); console.log('membershipId', membershipId); return;
    this.isPaymentMethodModalOpen = true;
    this.selectedPriceId = priceId
    this.selectedMembershipId = membershipId
  }

  hidePaymentMethodPopup(isOpened: boolean): void {
    // console.log('carDetails', isOpened);
    this.isPaymentMethodModalOpen = isOpened; //set to false which will reset modal to show on click again
    this.selectedPriceId = '';
    this.selectedMembershipId = '';
  }

  //destroy all subscription
  public ngOnDestroy(): void {
    this.onDestroy$.next();
  }


}
