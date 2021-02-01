import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
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

@Component({
  selector: 'app-verify-phone',
  templateUrl: './verify-phone.component.html',
  styleUrls: ['./verify-phone.component.css']
})
export class VerifyPhoneComponent implements OnInit {

  private onDestroy$: Subject<void> = new Subject<void>();
  id: any = ''
  mentorDetails: any = {};

  constructor(private activatedRoute: ActivatedRoute, private formBuilder: FormBuilder, private authService: AuthService, private utilsService: UtilsService, private router: Router) { }

  ngOnInit(): void {
    this.checkQueryParam();
  }

  private checkQueryParam() {
    this.activatedRoute.params.subscribe((params) => {
      this.id = params['id'];
      this.getMentorDetailsByToken(params['id']);
      //console.log(this.priceValuationForm.value);

    });
  }

  /**
   * get Mentor Details By Token
  */
  getMentorDetailsByToken(id) {
    this.utilsService.processPostRequest('getMentorDetails', { userID: this.id }, true).pipe(takeUntil(this.onDestroy$)).subscribe((response) => {
      this.mentorDetails = response;
      console.log(this.mentorDetails);
    })
  }

  /**
   * Resend Email Verification
  */
  resendEmailVerification(id) {
    this.utilsService.processPostRequest('resendMentorEmailVerification', { userID: this.id }, true).pipe(takeUntil(this.onDestroy$)).subscribe((response) => {
      this.utilsService.onResponse(environment.MESSGES['RESEND-EMAIL-VERIFICATION'], true);
    })
  }

  /**
   * Resend Phone Verification
  */
  resendPhoneVerification(id) {
    this.utilsService.processPostRequest('resendMentorPhoneVerification', { userID: this.id }, true).pipe(takeUntil(this.onDestroy$)).subscribe((response) => {
      this.utilsService.onResponse(environment.MESSGES['RESEND-PHONE-VERIFICATION'], true);
    })
  }

}
