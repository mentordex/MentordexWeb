import { Component, OnInit, OnDestroy } from '@angular/core';
import { Router } from "@angular/router";
import { takeUntil } from 'rxjs/operators';
import { Subject } from 'rxjs';

// import fade in animation
import { AuthService, UtilsService } from '../../../core/services';

//import enviornment
import { environment } from '../../../../environments/environment';

@Component({
  selector: 'app-about-us',
  templateUrl: './about-us.component.html',
  styleUrls: ['./about-us.component.css']
})
export class AboutUsComponent implements OnInit {
  private onDestroy$: Subject<void> = new Subject<void>();

  constructor( private utilsService: UtilsService) {  }

  ngOnInit(): void {
    //this.fetchBlogs();
  }

  //Fetch blog listing from wordpress
  fetchBlogs() {
    this.utilsService.processGetRequest(`${environment.BLOG_API_ENDPOINT}/pages/27`).pipe(takeUntil(this.onDestroy$)).subscribe((response) => {
      console.log('about', response);
      /*Object.keys(response).forEach(item => {
         if (item < '3') {
          this.utilsService.processGetRequest(`${environment.BLOG_API_ENDPOINT}/media/${response[item]['featured_media']}`).pipe(takeUntil(this.onDestroy$)).subscribe((data) => {

              response[item]['image'] = data['guid']['rendered']
            //this.blogs.push(response[item]);
          })

        } 
      });*/
    })
   
  }

  //destroy all subscription
  public ngOnDestroy(): void {
    this.onDestroy$.next();
  }

}
