import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from "@angular/router";
import { takeUntil } from 'rxjs/operators';
import { Subject } from 'rxjs';

//import enviornment
import { environment } from '../../../../environments/environment';


// import fade in animation
import { fadeInAnimation } from '../../../core/animations';
import { AuthService, UtilsService } from '../../../core/services';


@Component({
  selector: 'app-forgot-password',
  templateUrl: './forgot-password.component.html',
  styleUrls: ['./forgot-password.component.css']
})
export class ForgotPasswordComponent implements OnInit {

  private onDestroy$: Subject<void> = new Subject<void>();
  title: string = 'Forgot Password';
  breadcrumbs: any[] = [{ page: 'HOME', link: '' }, { page: 'FORGOT-PASSWORD', link: '' }]
  forgotPasswordForm: FormGroup;
  isFormSubmitted:boolean = false

  constructor(private formBuilder: FormBuilder, private authService:AuthService, private utilsService: UtilsService, private router: Router) { 
    
    this.utilsService.checkAndRedirect()
    this.initalizeForgotPasswordForm()
    
  }

  ngOnInit(): void {
  }

  //initalize form
  private initalizeForgotPasswordForm() {
    this.forgotPasswordForm = this.formBuilder.group({     
      email: ['', [Validators.required]]     
    });
  }

  //onsubmit form
  onSubmit() {
    if (this.forgotPasswordForm.invalid) {  
      this.isFormSubmitted= true
      return false;
    }

 
    this.utilsService.processPostRequest('forgot-password',this.forgotPasswordForm.value, true, environment.MESSGES['EMAIL-SENT']).pipe(takeUntil(this.onDestroy$)).subscribe((response) => {
      
      this.forgotPasswordForm.reset();           
    })
  }

  //destroy all subscription
  public ngOnDestroy(): void {
    this.onDestroy$.next();
  }

}
