import { Component, OnInit, OnDestroy } from '@angular/core';
import { Router } from "@angular/router";
import { takeUntil } from 'rxjs/operators';
import { Subject } from 'rxjs';

// import fade in animation
import { AuthService, UtilsService } from '../../core/services';

//import enviornment
import { environment } from '../../../environments/environment';

declare var $;

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css']
})
export class HomeComponent implements OnInit {
  private onDestroy$: Subject<void> = new Subject<void>();
  categories:any = []
  blogs:any = []
  faqs:any = []
  slideConfig = {
    slidesToShow: 3,
    slidesToScroll: 1,
    dots: false,
    infinite: true,
    cssEase: 'linear',
    arrows: false,
    responsive: [
        {
          breakpoint: 767,
          settings: {
            slidesToShow: 2,
            slidesToScroll: 1
          }
        },
        {
          breakpoint: 575,
          settings: {
            slidesToShow: 1,
            slidesToScroll: 1,
            dots: true,
            infinite: true
          }
        }
      ]
  };
  constructor( private utilsService: UtilsService) { 
    new Promise((resolve) => {
      this.loadScript('../assets/js/jquery.3.5.1.min.js');
      this.loadScript('../assets/js/popper.min.js');
      this.loadScript('../assets/js/bootstrap.min.js');
      this.loadScript('../assets/js/gsap-3.5.0.min.js');
      this.loadScript('../assets/js/gsap-scollTrigger-3.5.0.min.js');
      this.loadScript('../assets/js/slick-slider.js');
      this.loadScript('../assets/js/tilt.js');
      this.loadScript('../assets/js/main.js');
      resolve(true);
    });
  }

  ngOnInit(): void {
    this.fetchCategories()
    this.fetchBlogs()
    this.fetchFAQs()   
    
  }


  
  
  fetchFAQs() {
    this.utilsService.processGetRequest('faqs/top5listing').pipe(takeUntil(this.onDestroy$)).subscribe((response) => {
      this.faqs = response
    })
  }

  fetchCategories() {
    this.utilsService.processGetRequest('city/listing').pipe(takeUntil(this.onDestroy$)).subscribe((response) => {
      this.categories = response
    })
  }

  //Fetch blog listing from wordpress
  fetchBlogs() {
    this.utilsService.processGetRequest(`${environment.BLOG_API_ENDPOINT}/posts/`).pipe(takeUntil(this.onDestroy$)).subscribe((response) => {
      Object.keys(response).forEach(item => {
        if (item < '3') {
          this.utilsService.processGetRequest(`${environment.BLOG_API_ENDPOINT}/media/${response[item]['featured_media']}`).pipe(takeUntil(this.onDestroy$)).subscribe((data) => {

            response[item]['image'] = data['guid']['rendered']
            this.blogs.push(response[item]);
          })

        }
      });
    })
   
  }

  public loadScript(url: string) {
    const body = <HTMLDivElement>document.body;
    const script = document.createElement('script');
    script.innerHTML = '';
    script.src = url;
    script.async = false;
    script.defer = true;
    body.appendChild(script);
  }

  ngAfterContentInit() {
    
     // this.loadScript('../assets/js/blog.js');
    
  }

  //destroy all subscription
  public ngOnDestroy(): void {
    this.onDestroy$.next();
  }

}
