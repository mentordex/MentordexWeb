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

@Component({
  selector: 'app-purchase-membership',
  templateUrl: './purchase-membership.component.html',
  styleUrls: ['./purchase-membership.component.css']
})
export class PurchaseMembershipComponent implements OnInit {

  private onDestroy$: Subject<void> = new Subject<void>();

  

  isPaymentMethodModalOpen: boolean = false;
  selectedPriceId: any = '';
  selectedMembershipId: any = '';
  membershipPlans:any = [];

  constructor(private zone: NgZone, private formBuilder: FormBuilder, private authService: AuthService, private utilsService: UtilsService, private router: Router, private activatedRoute: ActivatedRoute) { }

  ngOnInit(): void {
    this.getMembershipListing();
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
