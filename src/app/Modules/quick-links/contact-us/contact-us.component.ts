import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from "@angular/router";
import { takeUntil } from 'rxjs/operators';
import { Subject } from 'rxjs';

//import enviornment
import { environment } from '../../../../environments/environment';


// import fade in animation
import { UtilsService } from '../../../core/services';


@Component({
  selector: 'app-contact-us',
  templateUrl: './contact-us.component.html',
  styleUrls: ['./contact-us.component.css']
})
export class ContactUsComponent implements OnInit {

  private onDestroy$: Subject<void> = new Subject<void>();  
  contactForm: FormGroup;
  isFormSubmitted:boolean = false
  offices:any = []

  constructor(private formBuilder: FormBuilder, private utilsService: UtilsService, private router: Router) { 
    
    
    this.initalizeContactForm()
    
  }

  ngOnInit(): void {
    this.fetchOffices()
  }

  //fetch office listing
  fetchOffices(){
    this.utilsService.processGetRequest('offices', true ).pipe(takeUntil(this.onDestroy$)).subscribe((response) => {
      this.offices = response            
    })
  }

  //initalize form
  private initalizeContactForm() {
    this.contactForm = this.formBuilder.group({     
      email: ['', [Validators.required]]     
    });
  }

  //onsubmit form
  onSubmit() {
    if (this.contactForm.invalid) {  
      this.isFormSubmitted= true
      return false;
    }

 
    this.utilsService.processPostRequest('contact',this.contactForm.value, true, environment.MESSGES['EMAIL-SENT']).pipe(takeUntil(this.onDestroy$)).subscribe((response) => {
      
      //this.offices = response           
    })
  }

  //destroy all subscription
  public ngOnDestroy(): void {
    this.onDestroy$.next();
  }
}
