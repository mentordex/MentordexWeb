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

declare var $;

@Component({
  selector: 'app-mentor-profile',
  templateUrl: './mentor-profile.component.html',
  styleUrls: ['./mentor-profile.component.css']
})
export class MentorProfileComponent implements OnInit {

  private onDestroy$: Subject<void> = new Subject<void>();
  id: any = '';
  mentorId: any = '';
  mentorProfileDetails: any = {};
  profileImagePath: any = 'assets/img/image.png';
  getVideoLink:any = '';
  getVideoType:any = '';

  constructor(private zone: NgZone, private formBuilder: FormBuilder, private authService: AuthService, private utilsService: UtilsService, private router: Router, private activatedRoute: ActivatedRoute, private dom:DomSanitizer) { }

  ngOnInit(): void {
    this.checkQueryParam();
  }

  private checkQueryParam() {
    this.id = localStorage.getItem('x-user-ID');

    this.activatedRoute.params.subscribe((params) => {
      this.mentorId = params['id'];

      

      this.zone.run(() => {
        this.getMentorProfileDetailsById(this.id, this.mentorId);
      });

      //console.log(this.priceValuationForm.value);

    });

    
   

  }

  /**
   * get Mentor Details By Token
  */
  getMentorProfileDetailsById(id, mentorId): void {
    this.utilsService.processPostRequest('getMentorProfileDetailsById', { userID: id, mentorId: mentorId }, true).pipe(takeUntil(this.onDestroy$)).subscribe((response) => {
      this.mentorProfileDetails = response;
      console.log(this.mentorProfileDetails);

      if (this.mentorProfileDetails.profile_image.length > 0) {
        //console.log('pello')
        this.profileImagePath = this.mentorProfileDetails.profile_image[0].file_path;
      }

      if (this.mentorProfileDetails.introduction_video.length > 0) {
        //console.log('pello')
        this.getVideoLink = this.mentorProfileDetails.introduction_video[0].file_path;
        this.getVideoType = this.mentorProfileDetails.introduction_video[0].file_mimetype;
      }

    })
  }

  public openVideoIntroPopup(video_link): void { 
    this.getVideoLink =  this.dom.bypassSecurityTrustResourceUrl(video_link); 
    //console.log(this.getVideoLink);
    if(this.getVideoLink != ""){
      $('#videoModal').modal('show')
    }
    
  }

  public submitMentorBookingRequest(): void { 
    // check Parent has added the billing method or not.
    this.utilsService.processPostRequest('checkBillingMethodExists', { userID: this.id }, true).pipe(takeUntil(this.onDestroy$)).subscribe((response) => {
      

    })
  }

  //destroy all subscription
  public ngOnDestroy(): void {
    this.onDestroy$.next();
  }

}
