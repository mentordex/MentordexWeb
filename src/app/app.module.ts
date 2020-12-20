import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations'; 
import { HTTP_INTERCEPTORS } from "@angular/common/http";

import { SharedModule } from './core/components/shared.module';
import { AppRoutingModule } from './app-routing.module';

import { AppComponent } from './app.component';
import { PageNotFoundComponent } from './page-not-found/page-not-found.component';




@NgModule({
  declarations: [
    AppComponent,
    PageNotFoundComponent
  ],
  imports: [  
    AppRoutingModule,
    SharedModule,
    BrowserModule,
    BrowserAnimationsModule,
    
  ],
  providers: [   
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
