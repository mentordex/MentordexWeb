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

import { DropzoneComponent, DropzoneDirective, DropzoneConfigInterface } from 'ngx-dropzone-wrapper';

import { NgxUiLoaderService } from 'ngx-ui-loader';

@Component({
  selector: 'app-messages',
  templateUrl: './messages.component.html',
  styleUrls: ['./messages.component.css']
})
export class MessagesComponent implements OnInit {

  private onDestroy$: Subject<void> = new Subject<void>();
  id: any = '';
  getJobId: any = '';
  getParentId: any = '';
  getJobStatus: any = 'ACCEPTED';
  jobDetails: any = [];
  parentDetails: any = [];
  filteredParentDetails: any = [];
  messageDetails: any = [];
  getJobDetailsArray: any = [];
  parentProfileImagePath: any = 'assets/img/none.png';
  mentorProfileImagePath: any = 'assets/img/none.png';
  senderProfileImagePath: any = 'assets/img/none.png';
  receiverProfileImagePath: any = 'assets/img/none.png';

  noJobsFound: boolean = false;
  isMessageFormSubmitted: boolean = false;

  messageForm: FormGroup;
  public messageFileConfiguration: DropzoneConfigInterface;
  base64StringFile: any;

  selectedJobId: any = '';
  selectedParentId: any = '';

  isBookingMethodModalOpen: boolean = false;

  options = { autoHide: false, scrollbarMinSize: 100 };

  constructor(private zone: NgZone, private formBuilder: FormBuilder, private authService: AuthService, private utilsService: UtilsService, private router: Router, private activatedRoute: ActivatedRoute, private ngxLoader: NgxUiLoaderService) { }

  ngOnInit(): void {
    this.initalizeMessageForm();
    this.checkQueryParam();
    this.messageFileDropzoneInit();
  }

  private checkQueryParam() {
    this.ngxLoader.start();

    this.id = localStorage.getItem('x-user-ID');


    this.activatedRoute.params.subscribe((params) => {
      const jobId = ('jobId' in params) ? params['jobId'] : ''
      if (jobId) {
        this.selectedJobId = jobId;
        this.getMentorJobsById(this.id, this.selectedJobId);
        this.getMentorSidebarList(this.id);
      } else {
        this.getMentorJobs(this.id);
      }

    })

    //console.log(this.priceValuationForm.value);

  }

  //initalize Message Form
  private initalizeMessageForm() {
    this.messageForm = this.formBuilder.group({
      userID: ['', Validators.compose([Validators.required])],
      job_id: ['', Validators.compose([Validators.required])],
      parent_id: ['', Validators.compose([Validators.required])],
      message: ['', Validators.compose([Validators.minLength(1), Validators.maxLength(5000), Validators.required])],
      message_file: this.formBuilder.array([])
    });
  }

  get messageFileArray(): FormArray {
    return this.messageForm.get('message_file') as FormArray;
  }

  /**
  * Initialize Dropzone Library(Video Upload).
  */
  private messageFileDropzoneInit() {
    const componentObj = this;
    this.messageFileConfiguration = {
      clickable: true,
      paramName: "file",
      uploadMultiple: false,
      url: environment.API_ENDPOINT + "/api/uploadFile",
      maxFiles: 3,
      autoReset: null,
      errorReset: null,
      cancelReset: null,
      acceptedFiles: '.mp4, .mov, .webm, .avi, .doc, .pdf, .docx, .jpg, .png, .jpeg, .svg ',
      maxFilesize: 2, // MB,
      dictDefaultMessage: '<label for="uploadChatDocs" class="upload-doc--chatbtn"><svg width="15" height="25" viewBox="0 0 15 25" fill="none"><path d="M9.89941 0.859375C11.2255 0.859375 12.4973 1.38616 13.4349 2.32384C14.3726 3.26152 14.8994 4.53329 14.8994 5.85938V17.8594C14.8994 18.7786 14.7184 19.6889 14.3666 20.5382C14.0148 21.3874 13.4992 22.1591 12.8492 22.8091C12.1992 23.4591 11.4275 23.9747 10.5782 24.3265C9.72892 24.6783 8.81867 24.8594 7.89941 24.8594C6.98016 24.8594 6.06991 24.6783 5.22063 24.3265C4.37135 23.9747 3.59968 23.4591 2.94967 22.8091C2.29966 22.1591 1.78404 21.3874 1.43226 20.5382C1.08047 19.6889 0.899414 18.7786 0.899414 17.8594V9.85938H2.89941V17.8594C2.89941 19.1855 3.4262 20.4572 4.36388 21.3949C5.30156 22.3326 6.57333 22.8594 7.89941 22.8594C9.2255 22.8594 10.4973 22.3326 11.4349 21.3949C12.3726 20.4572 12.8994 19.1855 12.8994 17.8594V5.85938C12.8994 5.46541 12.8218 5.0753 12.6711 4.71132C12.5203 4.34735 12.2993 4.01663 12.0207 3.73805C11.7422 3.45948 11.4114 3.2385 11.0475 3.08774C10.6835 2.93697 10.2934 2.85937 9.89941 2.85937C9.50545 2.85937 9.11534 2.93697 8.75136 3.08774C8.38739 3.2385 8.05667 3.45948 7.77809 3.73805C7.49952 4.01663 7.27854 4.34735 7.12778 4.71132C6.97701 5.0753 6.89941 5.46541 6.89941 5.85938V17.8594C6.89941 18.1246 7.00477 18.3789 7.19231 18.5665C7.37984 18.754 7.6342 18.8594 7.89941 18.8594C8.16463 18.8594 8.41898 18.754 8.60652 18.5665C8.79406 18.3789 8.89941 18.1246 8.89941 17.8594V6.85938H10.8994V17.8594C10.8994 18.655 10.5833 19.4181 10.0207 19.9807C9.45813 20.5433 8.69506 20.8594 7.89941 20.8594C7.10376 20.8594 6.3407 20.5433 5.77809 19.9807C5.21548 19.4181 4.89941 18.655 4.89941 17.8594V5.85938C4.89941 4.53329 5.4262 3.26152 6.36388 2.32384C7.30156 1.38616 8.57333 0.859375 9.89941 0.859375V0.859375Z" fill="#3BB3BD"/></svg></label>',
      //previewsContainer: "#offerInHandsPreview",
      addRemoveLinks: true,
      //resizeWidth: 125,
      //resizeHeight: 125,
      //createImageThumbnails:false,
      dictInvalidFileType: 'Invalid File Type.',
      dictFileTooBig: 'Maximum upload file size limit is 2MB',
      dictCancelUpload: '<i class="fa fa-times" aria-hidden="true"></i>',
      dictRemoveFile: '<i class="fa fa-times" aria-hidden="true"></i>',
      headers: {
        'Cache-Control': null,
        'X-Requested-With': null,
      },

      accept: function (file, done) {


        if ((componentObj.messageFileArray.length + 1) > 1) {
          componentObj.utilsService.onError('You cannot upload any more files.');//hide page loader          
          this.removeFile(file);
          return false;
        }

        const reader = new FileReader();
        reader.onload = function (event) {

          let base64String = reader.result
          let fileExtension = (file.name).split('.').pop();

          componentObj.base64StringFile = reader.result;

          if (fileExtension == "pdf") {
            componentObj.base64StringFile = componentObj.base64StringFile.replace('data:application/pdf;base64,', '');
          }
          componentObj.utilsService.showPageLoader();//start showing page loader
          done();
        };
        reader.readAsDataURL(file);
      },
      init: function () {


        this.on('sending', function (file, xhr, formData) {

          formData.append('folder', 'messages');
          formData.append('fileType', file.type);
          formData.append('base64StringFile', componentObj.base64StringFile);
          componentObj.utilsService.showPageLoader();//start showing page loader 
        });


        this.on("totaluploadprogress", function (progress) {
          componentObj.utilsService.showPageLoader('Uploading file ' + parseInt(progress) + '%')
          if (progress >= 100) {
            componentObj.utilsService.hidePageLoader();//hide page loader
          }
        })

        this.on("success", function (file, serverResponse) {
          //console.log('serverResponse', serverResponse);

          componentObj.zone.run(() => {
            componentObj.messageFileArray.push(new FormControl({ file_path: serverResponse.fileLocation, file_name: serverResponse.fileName, file_key: serverResponse.fileKey, file_mimetype: serverResponse.fileMimeType, file_category: 'messages' }));
          });

          //console.log('messageFileArray', componentObj.messageFileArray);
          this.removeFile(file);
          componentObj.utilsService.hidePageLoader();//hide page loader

        });

        this.on("error", function (file, serverResponse) {
          this.removeFile(file);
          componentObj.utilsService.onError(serverResponse);//hide page loader  
          componentObj.utilsService.hidePageLoader();//hide page loader
        });

      }
    };
  }

  onSubmitMessageForm() {
    if (this.messageForm.invalid) {
      this.isMessageFormSubmitted = true
      return false;
    }

    //console.log(this.messageForm.value); return;

    this.utilsService.processPostRequest('messages/saveMentorMessage', this.messageForm.value, true, '').pipe(takeUntil(this.onDestroy$)).subscribe((response) => {
      this.ngxLoader.start();
      //console.log(response);
      this.getMentorJobsById(this.id, this.selectedJobId);
      this.messageForm.reset();      
      this.messageFileArray.clear();
      this.isMessageFormSubmitted = false
    })
  }

  onkeypress(value) {
    if (value != '') {
      this.parentDetails = this.parentDetails.filter(y => (y.parent_first_name.toLowerCase().indexOf(value.toLowerCase()) > -1) || (y.parent_last_name.toLowerCase().indexOf(value.toLowerCase()) > -1));
    } else {
      this.parentDetails = this.filteredParentDetails;
    }


    console.log(this.parentDetails);
  }

  /**
   * get Mentor Jobs By Token
  */
  getMentorJobs(mentorId): void {
    this.utilsService.processPostRequest('messages/getMentorJobs', { userID: mentorId }, true).pipe(takeUntil(this.onDestroy$)).subscribe((response) => {
      this.jobDetails = response;
      if (this.jobDetails.length > 0) {
        //this.noJobsFound = false;
        this.jobDetails.forEach((element, index) => {

          // Reset Profile Image Path
          this.parentProfileImagePath = 'assets/img/none.png';
          this.mentorProfileImagePath = 'assets/img/none.png';
          this.senderProfileImagePath = 'assets/img/none.png';
          this.receiverProfileImagePath = 'assets/img/none.png';


          /* get Sidebar Listing */
          if (element.parent.profile_image.length > 0) {
            //console.log('pello')
            this.parentProfileImagePath = element.parent.profile_image[0].file_path;

          }
          this.jobDetails[index]['parent']['profileImagePath'] = this.parentProfileImagePath;


          if (element.mentor.profile_image.length > 0) {
            //console.log('pello')
            this.mentorProfileImagePath = element.mentor.profile_image[0].file_path;

          }
          this.jobDetails[index]['mentor']['profileImagePath'] = this.mentorProfileImagePath;

          //console.log(this.parentProfileImagePath);

          this.parentDetails.push({ job_id: element._id, job_title: element.job_title, parent_id: element.parent_id, parent_first_name: element.parent.first_name, parent_last_name: element.parent.last_name, parent_profile_image: this.parentProfileImagePath });

          this.filteredParentDetails.push({ job_id: element._id, job_title: element.job_title, parent_id: element.parent_id, parent_first_name: element.parent.first_name, parent_last_name: element.parent.last_name, parent_profile_image: this.parentProfileImagePath });

          /* get Sidebar Listing */



          if (index == 0) {

            this.selectedJobId = element._id;
            this.selectedParentId = element.parent_id;

            // Patch Value in Message Form
            this.messageForm.patchValue({
              job_id: element._id,
              parent_id: element.parent_id,
              userID: mentorId,
            });

            this.getJobDetailsArray[index] = element;
            //let bookingDate = new Date(element.booking_date.replaceAll("/", "-")); 
            //console.log(element.booking_date.replaceAll("/", "-"))
            //this.getJobDetailsArray[index]['booking_date'] = bookingDate.toDateString();

            this.utilsService.processPostRequest('messages/getMentorJobMessages', { userID: mentorId, job_id: element._id }, true).pipe(takeUntil(this.onDestroy$)).subscribe((response) => {
              //console.log(response)

              this.jobDetails[index]['messages'] = response;

              this.getJobDetailsArray[index]['messages'] = response;

              if (this.getJobDetailsArray[index]['messages'].length > 0) {
                this.getJobDetailsArray[index]['messages'].forEach((msgElement, msgIndex) => {

                  // Set Receiver Image Profile Path
                  if (msgElement.receiver.profile_image.length > 0) {
                    this.receiverProfileImagePath = msgElement.receiver.profile_image[0].file_path;
                  }
                  msgElement.receiver['profileImagePath'] = this.receiverProfileImagePath;

                  // Set Sender Image Profile Path
                  if (msgElement.sender.profile_image.length > 0) {
                    this.senderProfileImagePath = msgElement.sender.profile_image[0].file_path;
                  }
                  msgElement.sender['profileImagePath'] = this.senderProfileImagePath;



                });
              }

            });

          } else {
            this.jobDetails[index]['messages'] = [];
            //this.getJobDetailsArray[index] = [];
          }


        });
        //console.log(this.getJobDetailsArray);

        this.ngxLoader.stop();

      } else {
        this.noJobsFound = true;
        this.ngxLoader.stop();
      }

      //console.log(this.jobDetails);

    })
  }

  /**
   * get Mentor Jobs By Token
  */
  getMentorSidebarList(mentorId): void {
    this.utilsService.processPostRequest('messages/getMentorJobs', { userID: mentorId }, true).pipe(takeUntil(this.onDestroy$)).subscribe((response) => {
      this.jobDetails = response;
      if (this.jobDetails.length > 0) {
        //this.noJobsFound = false;
        this.jobDetails.forEach((element, index) => {

          // Reset Profile Image Path
          this.parentProfileImagePath = 'assets/img/none.png';
          this.mentorProfileImagePath = 'assets/img/none.png';
          this.senderProfileImagePath = 'assets/img/none.png';
          this.receiverProfileImagePath = 'assets/img/none.png';


          /* get Sidebar Listing */
          if (element.parent.profile_image.length > 0) {
            //console.log('pello')
            this.parentProfileImagePath = element.parent.profile_image[0].file_path;

          }
          this.jobDetails[index]['parent']['profileImagePath'] = this.parentProfileImagePath;


          if (element.mentor.profile_image.length > 0) {
            //console.log('pello')
            this.mentorProfileImagePath = element.mentor.profile_image[0].file_path;

          }
          this.jobDetails[index]['mentor']['profileImagePath'] = this.mentorProfileImagePath;

          //console.log(this.parentProfileImagePath);

          this.parentDetails.push({ job_id: element._id, job_title: element.job_title, parent_id: element.parent_id, parent_first_name: element.parent.first_name, parent_last_name: element.parent.last_name, parent_profile_image: this.parentProfileImagePath });

          this.filteredParentDetails.push({ job_id: element._id, job_title: element.job_title, parent_id: element.parent_id, parent_first_name: element.parent.first_name, parent_last_name: element.parent.last_name, parent_profile_image: this.parentProfileImagePath });

          /* get Sidebar Listing */



        });
        //console.log(this.getJobDetailsArray);

        this.ngxLoader.stop();

      } else {
        this.noJobsFound = true;
        this.ngxLoader.stop();
      }

      //console.log(this.jobDetails);

    })
  }

  /**
   * get Mentor Jobs By Token
  */
  getMentorJobsById(mentorId, jobId): void {
    this.ngxLoader.start();
    this.utilsService.processPostRequest('messages/getMentorJobsById', { userID: mentorId, job_id: jobId }, true).pipe(takeUntil(this.onDestroy$)).subscribe((response) => {
      //console.log(response);

      this.jobDetails = response;
      if (this.jobDetails.length > 0) {
        //this.noJobsFound = false;
        this.jobDetails.forEach((element, index) => {

          // Reset Profile Image Path
          this.senderProfileImagePath = 'assets/img/none.png';
          this.receiverProfileImagePath = 'assets/img/none.png';

          if (index == 0) {

            this.selectedJobId = element._id;
            this.selectedParentId = element.parent_id;

            // Patch Value in Message Form
            this.messageForm.patchValue({
              job_id: element._id,
              parent_id: element.parent_id,
              userID: mentorId,
            });

            this.getJobDetailsArray[index] = element;
            //let bookingDate = new Date(element.booking_date.replaceAll("/", "-")); 
            //console.log(element.booking_date.replaceAll("/", "-"))
            //this.getJobDetailsArray[index]['booking_date'] = bookingDate.toDateString();

            this.utilsService.processPostRequest('messages/getMentorJobMessages', { userID: mentorId, job_id: element._id }, true).pipe(takeUntil(this.onDestroy$)).subscribe((response) => {
              //console.log(response)

              this.jobDetails[index]['messages'] = response;

              this.getJobDetailsArray[index]['messages'] = response;

              if (this.getJobDetailsArray[index]['messages'].length > 0) {
                this.getJobDetailsArray[index]['messages'].forEach((msgElement, msgIndex) => {

                  // Set Receiver Image Profile Path
                  if (msgElement.receiver.profile_image.length > 0) {
                    this.receiverProfileImagePath = msgElement.receiver.profile_image[0].file_path;
                  }
                  msgElement.receiver['profileImagePath'] = this.receiverProfileImagePath;

                  // Set Sender Image Profile Path
                  if (msgElement.sender.profile_image.length > 0) {
                    this.senderProfileImagePath = msgElement.sender.profile_image[0].file_path;
                  }
                  msgElement.sender['profileImagePath'] = this.senderProfileImagePath;



                });
              }

            });

          } else {
            this.jobDetails[index]['messages'] = [];
          }
        });
        //console.log(this.getJobDetailsArray);

      } else {
        this.noJobsFound = true;
      }

      this.ngxLoader.stop();
      //console.log(this.jobDetails);

    })
  }

  showUpdateBookingRequestPopup(jobId, parentId, jobStatus): void {
    this.isBookingMethodModalOpen = true;
    this.getJobId = jobId
    this.getParentId = parentId
    this.getJobStatus = jobStatus
  }

  hideUpdateBookingRequestPopup(isOpened: boolean): void {

    this.isBookingMethodModalOpen = isOpened; //set to false which will reset modal to show on click again
    this.getMentorJobsById(this.id, this.getJobId);
  }

  /**
   * remove PDF
   * @param index index of the image array
   * @return  boolean
   */
  removeFile(index, file_category, file_key): void {

    this.messageFileArray.removeAt(index);
    this.removeFileFromBucket(file_key);
  }

  /**
   * remove image from AWS Bucket
   * @param filePath image url
   * @param bucket s3 bucket name
   */
  removeFileFromBucket(file_key) {

    const params = { fileKey: file_key }

    this.utilsService.processPostRequest('deleteObject', params, true).pipe(takeUntil(this.onDestroy$)).subscribe((response) => {
      this.messageFileArray.reset();
    })
  }

  /**
* set check object array length.
* @param object
*  @return number
*/
  public checkObjectLength(object): number {
    return Object.keys(object).length;
  }

  //destroy all subscription
  public ngOnDestroy(): void {
    this.onDestroy$.next();
  }

}
