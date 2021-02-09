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
import Swal from 'sweetalert2'

//import enviornment
import { environment } from '../../../../environments/environment';

@Component({
  selector: 'app-reset-password',
  templateUrl: './reset-password.component.html',
  styleUrls: ['./reset-password.component.css']
})
export class ResetPasswordComponent implements OnInit {

  private onDestroy$: Subject<void> = new Subject<void>();
  resetPasswordForm: FormGroup;
  isFormSubmitted: boolean = false
  token: any = ''
  userDetails: any = {};

  constructor(private activatedRoute: ActivatedRoute, private formBuilder: FormBuilder, private authService: AuthService, private utilsService: UtilsService, private router: Router) {

    this.utilsService.checkAndRedirect();
    this.initalizeResetPasswordForm();


    //checking & authorizing the token
    this.activatedRoute.params.subscribe((params) => {
      this.token = params['token'];
      this.utilsService.processPostRequest('verifyToken', { token: this.token }, true).pipe(takeUntil(this.onDestroy$)).subscribe((response) => {

        this.userDetails = response;
        this.resetPasswordForm.patchValue({
          id: this.userDetails._id
        })

      })
    })
  }

  ngOnInit(): void {
  }

  //initalize reset password form
  private initalizeResetPasswordForm() {
    this.resetPasswordForm = this.formBuilder.group({
      password: [null, Validators.compose([
        Validators.required,
        Validators.minLength(8),
        Validators.maxLength(50),
        // check whether the entered password has a number
        CustomValidators.patternValidator(/\d/, {
          hasNumber: true
        }),
        // check whether the entered password has upper case letter
        CustomValidators.patternValidator(/[A-Z]/, {
          hasCapitalCase: true
        }),
        // check whether the entered password has a lower case letter
        CustomValidators.patternValidator(/[a-z]/, {
          hasSmallCase: true
        }),
        // check whether the entered password has a special character
        CustomValidators.patternValidator(
          /[ !@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]/,
          {
            hasSpecialCharacters: true
          }
        )
      ])
      ],
      repassword: [null, [Validators.required, Validators.minLength(8), Validators.maxLength(50)]],
      id: ['']
    }, {
      // check whether our password and confirm password match
      validators: CustomValidators.passwordMatchValidator
    });
  }

  //onsubmit login form
  onSubmit() {
    if (this.resetPasswordForm.invalid) {
      this.isFormSubmitted = true
      return false;
    }

    if ((this.resetPasswordForm.get('id').value == null) || (this.resetPasswordForm.get('id').value).length <= 0) {
      Swal.fire({
        showClass: {
          popup: 'animate__animated animate__fadeInDown'
        },
        hideClass: {
          popup: 'animate__animated animate__fadeOutUp'
        },
        icon: 'error',
        title: 'Error!!',
        text: 'Failed to process your request. Please try again with valid link.'
      })
      return false;
    }

    this.utilsService.processPostRequest('updatePassword', this.resetPasswordForm.value, true, environment.MESSGES['PASSWORD-UPDATED']).pipe(takeUntil(this.onDestroy$)).subscribe((response) => {

      this.router.navigate(['/authorization/login']);
    })
  }

  //destroy all subscription
  public ngOnDestroy(): void {
    this.onDestroy$.next();
  }
}
