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
import { TagifyModule } from 'ngx-tagify'; 

import { HeaderComponent } from './header/header.component';
import { FooterComponent } from './footer/footer.component';
import { FooterBottomComponent } from './footer-bottom/footer-bottom.component';
import { FormValidationErrorsComponent } from './form-validation-errors/form-validation-errors.component';
import { BreadcrumbsComponent } from './breadcrumbs/breadcrumbs.component';
import { LeftNavigationComponent } from './left-navigation/left-navigation.component';
import { AlertComponent } from './alert/alert.component';
import { PageLoaderComponent } from './page-loader/page-loader.component';
import { Select2Module } from "ng-select2-component";
import { DropzoneModule, DropzoneConfigInterface, DROPZONE_CONFIG } from 'ngx-dropzone-wrapper'; // Dropzone Module

import { NgxLoadingModule, ngxLoadingAnimationTypes } from 'ngx-loading'; // Loading Module

import { BsDatepickerModule } from 'ngx-bootstrap/datepicker';

//import core services
import { TitleService, AuthService, PageLoaderService, AlertService, UtilsService } from '../services';

//importing intercepters
import { ApiIntercepter, TokenInterceptor, HttpErrorInterceptor } from '../interceptors';

//importing guards
import { AuthGuard } from '../guards/auth-guard.service';

//importing guards
import { DateAgoPipe } from '../pipes/date-ago.pipe';

import { CreditCardDirectivesModule } from 'angular-cc-library';

import { ReadMoreModule } from 'ng-readmore';



//import { TwoDigitDecimaNumberDirective } from '../directives/two-digit-decima-number.directive';


const DEFAULT_DROPZONE_CONFIG: DropzoneConfigInterface = {
  acceptedFiles: '.jpg, .png, .jpeg, .pdf',
  createImageThumbnails: true
};


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
        TagifyModule.forRoot(),
        NgxIntlTelInputModule,
        Select2Module,
        DropzoneModule,
        CreditCardDirectivesModule,
        ReadMoreModule,
        BsDatepickerModule.forRoot(),
        NgxLoadingModule.forRoot({
          animationType: ngxLoadingAnimationTypes.wanderingCubes,
          backdropBackgroundColour: '#002249',
          backdropBorderRadius: '4px',
          primaryColour: '#002249',
          secondaryColour: '#002249',
          tertiaryColour: '#002249'
        }),
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
        TagifyModule,
        NgxIntlTelInputModule,
        Select2Module,
        DropzoneModule,
        BsDatepickerModule,
        CreditCardDirectivesModule,
        ReadMoreModule,
        NgxLoadingModule
    ]
})
export class SharedModule {
  
 }