import { Component, OnInit } from '@angular/core';
import { takeUntil } from 'rxjs/operators';
import { Subject } from 'rxjs';

//import enviornment
import { environment } from '../../../../environments/environment';


// import fade in animation
import { UtilsService } from '../../../core/services';

@Component({
  selector: 'app-faq',
  templateUrl: './faq.component.html',
  styleUrls: ['./faq.component.css']
})
export class FaqComponent implements OnInit {

  private onDestroy$: Subject<void> = new Subject<void>();  
  faqs:any = []
  category:string = 'GENERAL'

  constructor(private utilsService: UtilsService) { 
    
    
  }

  ngOnInit(): void {
    this.fetchFAQs()
  }

  //fetch office listing
  fetchFAQs(){
    this.utilsService.processPostRequest('faqs/listing', {'category':this.category}, true ).pipe(takeUntil(this.onDestroy$)).subscribe((response) => {
      this.faqs = response            
    })
  }

  //on click different category
  onClickCategory(category){
    this.category = category
    this.fetchFAQs()
  }

  

  //destroy all subscription
  public ngOnDestroy(): void {
    this.onDestroy$.next();
  }

}
