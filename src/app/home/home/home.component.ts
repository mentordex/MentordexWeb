import { Component, OnInit, OnDestroy,ViewChild } from '@angular/core';
import { DomSanitizer } from '@angular/platform-browser';
import { Router } from "@angular/router";
import { takeUntil } from 'rxjs/operators';
import { Subject } from 'rxjs';
import { SlickCarouselComponent } from 'ngx-slick-carousel';

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
  @ViewChild('slickModalBanner') slickModalBanner: SlickCarouselComponent;

  private onDestroy$: Subject<void> = new Subject<void>();
  categories:any = []
  blogs:any = []
  faqs:any = []
  banners:any = []


  @ViewChild('slickModal', {static: true}) slickModal: SlickCarouselComponent;
  @ViewChild('testimonialsModal', {static: true}) testimonialsModal: SlickCarouselComponent;
  @ViewChild('blogsModal', {static: true}) blogsModal: SlickCarouselComponent;



  

  firstFourCities:any = [];
  lastThreeCities:any = [];

  getVideoLink:any = '';

  bannerSlideConfig = {
    slidesToScroll: 1,
    arrows: false,
    dots: false,
    autoplay: false,
    infinite: true,
    responsive: [
      {
        breakpoint: 767,
        settings: {
          vertical: false,
          verticalSwiping: false,
        }
      },
      {
        breakpoint: 991,
        settings: {
          adaptiveHeight: true
        }
      }
    ]
  };


  testimonialsSlideConfig = {
    //slide: '.slick-slideshow__slide',
    centerMode: true,
    //centerPadding: '60px',
    slidesToShow: 4,
    slidesToScroll: 1,
    dots: false,
    infinite: true,
    cssEase: 'linear',
    arrows: false,
    responsive: [
      {
        breakpoint: 1599,
        settings: {
          //slidesToShow: 3,
          //slidesToScroll: 1
        }
      },
      {
        breakpoint: 1080,
        settings: {
          //slidesToShow: 2,
          //slidesToScroll: 2
        }
      },
      {
        breakpoint: 600,
        settings: {
          //slidesToShow: 1,
          //slidesToScroll: 1
        }
      }
    ]
  };

  
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

  constructor(private utilsService: UtilsService, private dom:DomSanitizer) {}

  nextBanner() {
    this.slickModalBanner.slickNext();
  }
  
  previousBanner() {
    this.slickModalBanner.slickPrev();
  }

  ngOnInit(): void {
    this.fetchCategories()
    this.fetchBlogs()
    this.fetchFAQs()
    this.fetchCities()
    this.fetchBanners()
  }

  fetchFAQs() {
    this.utilsService.processGetRequest('faqs/top5listing').pipe(takeUntil(this.onDestroy$)).subscribe((response) => {
      this.faqs = response
    })
  }

  fetchCategories() {
    this.utilsService.processGetRequest('category/listing').pipe(takeUntil(this.onDestroy$)).subscribe((response) => {
      this.categories = response
    })
  }

  fetchCities() {
    this.utilsService.processGetRequest('city/getActiveCities').pipe(takeUntil(this.onDestroy$)).subscribe((response) => {
      
      let citiesArray;

      this.firstFourCities = response;
      citiesArray = response;
      
      //this.firstFourCities = citiesArray1.splice(0,4);
      this.lastThreeCities = citiesArray.splice(4,3);

      //console.log(this.firstFourCities)
      //console.log(this.lastThreeCities)
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

  fetchBanners() {
    this.utilsService.processGetRequest('banner/listing').pipe(takeUntil(this.onDestroy$)).subscribe((response) => {
      this.banners = response
      //console.log( this.banners);
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

  /*nextBanner(){
    this.slickModal.slickNext();
  }*/

  prevBanner(){
    this.slickModal.slickPrev();
  }

  nextTestimonials(){
    this.testimonialsModal.slickNext();
  }

  prevTestimonials(){
    this.testimonialsModal.slickPrev();
  }

  public openYoutubePopup(video_link): void { 
    this.getVideoLink =  this.dom.bypassSecurityTrustResourceUrl(video_link); 
    //console.log(this.getVideoLink);
    if(this.getVideoLink != ""){
      $('#videoModal').modal('show')
    }
    
  }

  public stopYoutubeVideo(): void {   
    this.getVideoLink = ''; 
    $("#videoModal iframe").attr("src", $("#videoModal iframe").attr("src"));
  }

  ngAfterContentInit() { }

  //destroy all subscription
  public ngOnDestroy(): void {
    this.onDestroy$.next();
  }

}
