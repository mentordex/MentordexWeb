import { Component, OnInit, OnDestroy } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from "@angular/router";
import { takeUntil } from 'rxjs/operators';
import { Subject } from 'rxjs';

// import fade in animation
import { fadeInAnimation } from '../../../core/animations';
import { AuthService, UtilsService } from '../../../core/services';

//import enviornment
import { environment } from '../../../../environments/environment';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit {

  private onDestroy$: Subject<void> = new Subject<void>();
  emailForm: FormGroup;
  isEmailFormSubmitted: boolean = false
  loginForm: FormGroup;
  isLoginFormSubmitted: boolean = false
  isEmailValidated: boolean = false
  authorizedEmail: string = '';

  constructor(private formBuilder: FormBuilder, private authService: AuthService, private utilsService: UtilsService, private router: Router) { }

  ngOnInit(): void {
    this.utilsService.checkAndRedirect()
    this.initalizeLoginForm()
    this.initalizeEmailForm()
  }

  //initalize email form
  private initalizeEmailForm() {
    this.emailForm = this.formBuilder.group({
      email: ['', [Validators.required, Validators.pattern("^[a-z0-9._%+-]+@[a-z0-9.-]+\\.[a-z]{2,4}$")]],
    });
  }

  //initalize login form
  private initalizeLoginForm() {
    this.loginForm = this.formBuilder.group({
      email: ['', [Validators.required, Validators.pattern("^[a-z0-9._%+-]+@[a-z0-9.-]+\\.[a-z]{2,4}$")]],
      password: [null, [Validators.required]]
    });
  }


  //Authorizing email form
  onEmailFormSubmit() {
    if (this.emailForm.invalid) {
      this.isEmailFormSubmitted = true
      return false;
    }
    this.utilsService.processPostRequest('checkEmail', this.emailForm.value, true, '').pipe(takeUntil(this.onDestroy$)).subscribe((response) => {
      this.isEmailValidated = true
      this.authorizedEmail = this.emailForm.get('email').value
      this.loginForm.patchValue({ email: this.authorizedEmail })
    })
  }

  //Authorizing email form
  onLoginFormSubmit() {

    if (this.loginForm.invalid) {
      this.isLoginFormSubmitted = true
      return false;
    }


    this.authService.login(this.loginForm.value).pipe(takeUntil(this.onDestroy$)).subscribe((response) => {
      if (response.body.verify_phone == false) {
        this.router.navigate(['/mentor/verify-phone/' + response.body._id]);
      } else {
        this.utilsService.onResponse(environment.MESSGES['LOGIN-SUCCESS'], true);//show page loader  
        this.authService.isLoggedIn(true);
        localStorage.setItem('x-user-ID', response.body._id)
        localStorage.setItem(environment.TOKEN_NAME, response.headers.get(environment.TOKEN_NAME))
        localStorage.setItem('x-user-type', response.body.role)
        
        if(response.body.role == 'MENTOR'){

          // Check if a active Mentor or Not
          if (response.body.is_active == false) {
            this.router.navigate(['/mentor/basic-details/']);
          }else{
            this.router.navigate(['/home']);
          }

        }else{

          this.router.navigate(['/home']);
        }
      }

    })
  }

  //destroy all subscription
  public ngOnDestroy(): void {
    this.onDestroy$.next();
  }

}
