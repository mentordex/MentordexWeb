import { Component, OnInit, OnDestroy, ViewChild, NgZone } from '@angular/core';
import { FormBuilder, FormGroup, Validators, ValidatorFn, ValidationErrors, FormControl, FormArray, AbstractControl } from '@angular/forms';
import { DomSanitizer } from '@angular/platform-browser';
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
  selector: 'app-my-membership-plan',
  templateUrl: './my-membership-plan.component.html',
  styleUrls: ['./my-membership-plan.component.css']
})
export class MyMembershipPlanComponent implements OnInit {

  private onDestroy$: Subject<void> = new Subject<void>();
  id: any = '';
  paymentDetails: any = {};
  paymentDetailsArray: any = [];

  constructor(private zone: NgZone, private formBuilder: FormBuilder, private authService: AuthService, private utilsService: UtilsService, private router: Router, private activatedRoute: ActivatedRoute) { }

  ngOnInit(): void {
    this.checkQueryParam();
  }

  private checkQueryParam() {
    this.id = localStorage.getItem('x-user-ID');
    this.getPaymentDetailsByToken(this.id);
    this.getMembershipDetailsToken(this.id);
  }

  /**
   * get Parent Details By Token
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

    })
  }

  cancelYourSubscription() {
    Swal.fire({
      title: 'Are you sure, you want to cancel your subscription?',
      text: '',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonText: 'Yes',
      cancelButtonText: 'No'
    }).then((result) => {
      if (result.value) {

        this.utilsService.processPostRequest('cancelYourSubscription', { userID: this.id }, true).pipe(takeUntil(this.onDestroy$)).subscribe((response) => {
          console.log(response);

        })

      }
    })
  }

  //destroy all subscription
  public ngOnDestroy(): void {
    this.onDestroy$.next();
  }

}