import { Component, OnInit, OnDestroy, ViewChild, NgZone } from '@angular/core';
import { FormBuilder, FormGroup, Validators, ValidatorFn, ValidationErrors, FormControl, FormArray, AbstractControl } from '@angular/forms';
import { Router, ActivatedRoute } from "@angular/router";
import { takeUntil } from 'rxjs/operators';
import { Subject } from 'rxjs';

// import fade in animation
import { fadeInAnimation } from '../../../core/animations';
import { AuthService, UtilsService } from '../../../core/services';

//import enviornment
import { environment } from '../../../../environments/environment';

@Component({
  selector: 'app-payment-history',
  templateUrl: './payment-history.component.html',
  styleUrls: ['./payment-history.component.css']
})
export class PaymentHistoryComponent implements OnInit {

  private onDestroy$: Subject<void> = new Subject<void>();
  id: any = '';
  getTransactionDetails: any = []
  getInvoiceDetails: any = []
  getJobDetails: any = []

  totalRecords: Number = 0
  pagination: any = {
    search: '',
    sort_by: 'created_at',
    sort_dir: 'desc',
    filters: [],
    size: 5,
    pageNumber: 1,
  }

  constructor(private zone: NgZone, private formBuilder: FormBuilder, private authService: AuthService, private utilsService: UtilsService, private router: Router, private activatedRoute: ActivatedRoute) { }

  ngOnInit(): void {
    this.checkQueryParam();
  }

  private checkQueryParam() {
    this.id = localStorage.getItem('x-user-ID');

    this.zone.run(() => {
      this.pagination['userID'] = this.id;
      this.getTransactions();
    });

  }

  /**
   * get Mentor Transactions By Token
  */
  getTransactions(): void {
    //console.log(this.pagination); return;
    this.utilsService.processPostRequest('transactions/getTransactions', this.pagination, true).pipe(takeUntil(this.onDestroy$)).subscribe((response) => {
      this.getTransactionDetails = response['records'];
      this.totalRecords = response['total_records'];

      if (this.getTransactionDetails.length > 0) {
        this.getTransactionDetails.forEach((element, index, transactionArray) => {
          if ('job_id' in element && element.job_id != '') {
            this.utilsService.processPostRequest('transactions/fetchJobsById', { userID: this.id, job_id: element.job_id }, true).pipe(takeUntil(this.onDestroy$)).subscribe((response) => {
              this.getJobDetails = response;
              if ('job_title' in this.getInvoiceDetails) {
                transactionArray[index]['job_title'] = this.getJobDetails.job_title;
                
              }else{
                transactionArray[index]['job_title'] = 'N/A';
                
              }

            })
          }else{
            transactionArray[index]['job_title'] = 'N/A';
            
          }
        });
      }
      console.log(this.getTransactionDetails);
    })
  }

  nextpage(page) {
    this.pagination.pageNumber = page;
    this.getTransactions();
  }


  //destroy all subscription
  public ngOnDestroy(): void {
    this.onDestroy$.next();
  }

}
