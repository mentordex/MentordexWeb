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
  selector: 'app-verify-email',
  templateUrl: './verify-email.component.html',
  styleUrls: ['./verify-email.component.css']
})
export class VerifyEmailComponent implements OnInit {

  private onDestroy$: Subject<void> = new Subject<void>();
  id: any = ''
  email_token: any = ''
  mentorDetails: any = {};

  constructor(private activatedRoute: ActivatedRoute, private formBuilder: FormBuilder, private authService: AuthService, private utilsService: UtilsService, private router: Router) { }

  ngOnInit(): void {
    this.utilsService.checkAndRedirect();
    this.checkQueryParam();
  }

  // URL Query Param
  private checkQueryParam() {

    this.activatedRoute.params.subscribe((params) => {
      this.id = params['id'];
      this.email_token = params['email_token'];
      this.verifyMentorEmailByToken(params['id']);
      //console.log(this.priceValuationForm.value);

    });
  }

  /**
   * get Mentor Details By Token
  */
 verifyMentorEmailByToken(id): void {
    this.utilsService.processPostRequest('verifyMentorEmail', { userID: this.id, emailToken: this.email_token }, true).pipe(takeUntil(this.onDestroy$)).subscribe((response) => {
      this.mentorDetails = response;
      if(this.mentorDetails.email_verify == false){
        this.utilsService.onResponse(this.mentorDetails.message, false);
        this.router.navigate(['/']);
      }
      //console.log(this.mentorDetails);
    })
  }
  
  //destroy all subscription
  public ngOnDestroy(): void {
    this.onDestroy$.next();
  }

}
