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
  selectedcategory:string = ''
  selectedCategoryTitle:string = ''
  faqcategories:any = []
  constructor(private utilsService: UtilsService) { 
    
    
  }

  ngOnInit(): void {
    this.fetchFAQCategory()
  }

  //fetch office listing
  fetchFAQs() {

    this.utilsService.processPostRequest('faqs/listing', {'category':this.selectedcategory}, true ).pipe(takeUntil(this.onDestroy$)).subscribe((responseFaqs) => {
      this.faqs = responseFaqs
    })
  }

  fetchFAQCategory() {

    this.utilsService.processGetRequest('faqs/categories').pipe(takeUntil(this.onDestroy$)).subscribe((response) => {
      this.faqcategories = response
      this.selectedCategoryTitle = response[0]['title'];
      this.selectedcategory = response[0]['_id'];   
      this.fetchFAQs()   
    })
  }

  

  //on click different category
  onClickCategory(category){
    console.log('category',category)
    this.selectedCategoryTitle = category.title
    this.selectedcategory = category._id
    this.fetchFAQs()
  }

  

  //destroy all subscription
  public ngOnDestroy(): void {
    this.onDestroy$.next();
  }

}
