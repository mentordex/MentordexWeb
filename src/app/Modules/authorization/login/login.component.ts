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
  isEmailFormSubmitted:boolean = false 
  loginForm: FormGroup;
  isLoginFormSubmitted:boolean = false
  isEmailValidated:boolean = false
  authorizedEmail:string = '';

  constructor(private formBuilder: FormBuilder, private authService:AuthService, private utilsService: UtilsService, private router: Router) { }

  ngOnInit(): void {
    this.utilsService.checkAndRedirect()
    this.initalizeLoginForm()
    this.initalizeEmailForm()
  }

  //initalize email form
  private initalizeEmailForm() {
    this.emailForm = this.formBuilder.group({
      email: ['', [Validators.required]]      
    });
  }

  //initalize login form
  private initalizeLoginForm() {
    this.loginForm = this.formBuilder.group({
      email: ['', [Validators.email, Validators.required]],
      password: [null, [Validators.required]]
    });
  }


  //Authorizing email form
  onEmailFormSubmit() {
    if (this.emailForm.invalid) {  
      this.isEmailFormSubmitted= true
      return false;      
    }   
    this.utilsService.processPostRequest('checkEmail',this.emailForm.value,true, environment.MESSGES['EMAIL-AUTHORIZED']).pipe(takeUntil(this.onDestroy$)).subscribe((response) => {       
      this.isEmailValidated = true
      this.authorizedEmail = this.emailForm.get('email').value
      this.loginForm.patchValue({email:this.authorizedEmail})
    })
  }

  //Authorizing email form
  onLoginFormSubmit() {
    if (this.loginForm.invalid) {  
      this.isLoginFormSubmitted= true
      return false;      
    }
    
    
    this.authService.login(this.loginForm.value).pipe(takeUntil(this.onDestroy$)).subscribe((response) => {
      this.utilsService.onResponse(environment.MESSGES['LOGIN-SUCCESS'], true);//show page loader  
      localStorage.setItem('x-user-ID', response.body._id)     
      localStorage.setItem(environment.TOKEN_NAME, response.headers.get(environment.TOKEN_NAME))    
      localStorage.setItem('x-user-type', response.body.role)  
      this.router.navigate(['/home']);    
     
    })
  }

  //destroy all subscription
  public ngOnDestroy(): void {
    this.onDestroy$.next();
  }

}
