import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common'; 
import { Routes, RouterModule } from '@angular/router';
import { HTTP_INTERCEPTORS, HttpClientModule, HttpClient } from "@angular/common/http";
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';

import { ArchwizardModule } from 'angular-archwizard';
import { ToastrModule } from 'ng6-toastr-notifications';
import { NgxPaginationModule } from 'ngx-pagination';
import { NgxMaskModule, IConfig } from 'ngx-mask'
import { SlickCarouselModule } from 'ngx-slick-carousel';
import { NgxMasonryModule } from 'ngx-masonry';
import { NgxIntlTelInputModule } from 'ngx-intl-tel-input';

import { HeaderComponent } from './header/header.component';
import { FooterComponent } from './footer/footer.component';
import { FooterBottomComponent } from './footer-bottom/footer-bottom.component';
import { FormValidationErrorsComponent } from './form-validation-errors/form-validation-errors.component';
import { BreadcrumbsComponent } from './breadcrumbs/breadcrumbs.component';
import { LeftNavigationComponent } from './left-navigation/left-navigation.component';
import { AlertComponent } from './alert/alert.component';
import { PageLoaderComponent } from './page-loader/page-loader.component';

//import core services
import { TitleService, AuthService, PageLoaderService, AlertService, UtilsService } from '../services';

//importing intercepters
import { ApiIntercepter, TokenInterceptor, HttpErrorInterceptor } from '../interceptors';

//importing guards
import { AuthGuard } from '../guards/auth-guard.service';

//importing guards
import { DateAgoPipe } from '../pipes/date-ago.pipe';

//import { TwoDigitDecimaNumberDirective } from '../directives/two-digit-decima-number.directive';


@NgModule({
    imports: [
        RouterModule,     
        FormsModule,    
        HttpClientModule,
        ReactiveFormsModule,        
        CommonModule,  
        ArchwizardModule,        
        ToastrModule.forRoot(),        
        NgxPaginationModule,
        NgxMaskModule.forRoot(),
        SlickCarouselModule,
        NgbModule,
        NgxMasonryModule,
        NgxIntlTelInputModule
    ],
    declarations: [      
        
        HeaderComponent,
        FooterComponent,
        FooterBottomComponent,
        FormValidationErrorsComponent,
        BreadcrumbsComponent,        
        LeftNavigationComponent,
        AlertComponent,
        PageLoaderComponent,
        DateAgoPipe,
        //TwoDigitDecimaNumberDirective
        
    ],
    providers: [
      TitleService,
      AuthService,
      PageLoaderService, 
      AlertService, 
      UtilsService,
      AuthGuard,   
      {
        provide: HTTP_INTERCEPTORS,
        useClass: ApiIntercepter, multi: true
      },   
      {
        provide: HTTP_INTERCEPTORS,
        useClass: TokenInterceptor, multi: true
      },
      {
        provide: HTTP_INTERCEPTORS,
        useClass: HttpErrorInterceptor, multi: true
      }
    ],
    exports: [        
        
        HeaderComponent,
        FooterComponent,
        FooterBottomComponent,
        FormValidationErrorsComponent,
        BreadcrumbsComponent,
        LeftNavigationComponent,
        AlertComponent,
        PageLoaderComponent,
        DateAgoPipe,
       // TwoDigitDecimaNumberDirective,
        

      
        FormsModule, 
        ReactiveFormsModule,   
        ArchwizardModule,
        ToastrModule,
        NgxPaginationModule,
        NgxMaskModule,
        SlickCarouselModule,
        NgbModule,
        NgxMasonryModule,
        NgxIntlTelInputModule
    ]
})
export class SharedModule {
  
 }