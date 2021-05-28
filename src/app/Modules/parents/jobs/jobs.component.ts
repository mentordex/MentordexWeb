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

import { NgxUiLoaderService } from 'ngx-ui-loader';

@Component({
  selector: 'app-jobs',
  templateUrl: './jobs.component.html',
  styleUrls: ['./jobs.component.css']
})
export class JobsComponent implements OnInit {

  private onDestroy$: Subject<void> = new Subject<void>();
  id: any = '';
  getJobId: any = '';
  getParentId: any = '';
  getJobStatus: any = 'ALL';
  getJobSearch: any = '';
  jobsArray: any = [];
  getRecords: any = {};


  filterWithJobStatus = {}
  totalPaginationRecords: Number = 0
  totalRecords: Number = 0
  totalAcceptedRecords: Number = 0
  totalCancelledRecords: Number = 0
  totalCompletedRecords: Number = 0
  pagination: any = {
    search: '',
    sort_by: 'created_at',
    sort_dir: 'desc',
    filters: [],
    size: 10,
    pageNumber: 1,
  }

  constructor(private zone: NgZone, private formBuilder: FormBuilder, private authService: AuthService, private utilsService: UtilsService, private router: Router, private activatedRoute: ActivatedRoute, private ngxLoader: NgxUiLoaderService) { }

  ngOnInit(): void {
    this.checkQueryParam();
  }

  private checkQueryParam() {
    this.id = localStorage.getItem('x-user-ID');
    this.ngxLoader.start();
    this.zone.run(() => {
      this.pagination['userID'] = this.id;
      this.getAllJobs();
    });

  }

  getAllJobs(): void {
    //console.log(this.pagination); return;
    this.pagination['filters'] = this.filterWithJobStatus
    this.utilsService.processPostRequest('jobs/getParentJobs', this.pagination, false).pipe(takeUntil(this.onDestroy$)).subscribe((response) => { 
      //console.log(response);
      this.jobsArray = response['records'];
      this.totalRecords = response['total_records'];
      this.totalAcceptedRecords = response['total_accepted_records'];
      this.totalCancelledRecords = response['total_cancelled_records'];
      this.totalCompletedRecords = response['total_completed_records'];

      if(this.getJobStatus == 'ACCEPTED'){
        this.totalPaginationRecords = this.totalAcceptedRecords;
      }else if(this.getJobStatus == 'CANCELLED'){
        this.totalPaginationRecords = this.totalCancelledRecords;
      }else if(this.getJobStatus == 'COMPLETED'){
        this.totalPaginationRecords = this.totalCompletedRecords;
      }else{
        this.totalPaginationRecords = this.totalRecords;
      }

      this.ngxLoader.stop();
    })
  }

  onFilterJobStatus(job_status):void{
    //console.log(job_status)
    this.ngxLoader.start();
    this.pagination.pageNumber = 1;
    this.getJobStatus = job_status;
    this.filterWithJobStatus['job_status'] = job_status;
    this.getAllJobs();
  }

  onSearchJob(search):void{
    //console.log(job_status)
    this.ngxLoader.start();
    this.pagination.pageNumber = 1;
    this.getJobSearch = search;
    this.filterWithJobStatus['search'] = search;
    this.filterWithJobStatus['job_status'] = this.getJobStatus;
    this.getAllJobs();
  }

  nextpage(page) {
    this.ngxLoader.start();
    this.pagination.pageNumber = page;
    this.filterWithJobStatus['job_status'] = this.getJobStatus;
    this.filterWithJobStatus['search'] = this.getJobSearch;
    this.getAllJobs();
  }

  //destroy all subscription
  public ngOnDestroy(): void {
    this.onDestroy$.next();
  }

}
