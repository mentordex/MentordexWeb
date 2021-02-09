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
  selector: 'app-verification-success',
  templateUrl: './verification-success.component.html',
  styleUrls: ['./verification-success.component.css']
})
export class VerificationSuccessComponent implements OnInit {

  private onDestroy$: Subject<void> = new Subject<void>();
  id: any = ''
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
      this.getMentorDetailsByToken(params['id']);
    });
  }

  /**
   * get Mentor Details By Token
  */
  getMentorDetailsByToken(id): void {
    this.utilsService.processPostRequest('getMentorDetails', { userID: this.id }, true).pipe(takeUntil(this.onDestroy$)).subscribe((response) => {
      this.mentorDetails = response;
      //console.log(this.mentorDetails);
    })
  }

  /**
   * Complete Your Application Submit
  */
  onCompleteYourApplication(): void {

    this.authService.onCompleteYourApplication({ userID: this.id }).pipe(takeUntil(this.onDestroy$)).subscribe((response) => {
      if (response.body.verify_phone == false) {
        this.router.navigate(['/mentor/verify-phone/' + response.body._id]);
      } else {
        localStorage.setItem('x-user-ID', response.body._id)
        localStorage.setItem(environment.TOKEN_NAME, response.headers.get(environment.TOKEN_NAME))
        localStorage.setItem('x-user-type', response.body.role)
        this.router.navigate(['/mentor/basic-details/']);
      }
    })


    //this.router.navigate(['/authorization']);
  }

  //destroy all subscription
  public ngOnDestroy(): void {
    this.onDestroy$.next();
  }

}
