import { Injectable } from "@angular/core";
import { Observable } from "rxjs";
import { tap } from 'rxjs/operators';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { ToastrManager } from 'ng6-toastr-notifications';//toaster class
import { Router } from "@angular/router";

//import shared services
import { PageLoaderService } from './page-loader.service'

//import enviornment
import { environment } from '../../../environments/environment';

@Injectable()
export class UtilsService {


  constructor(private httpClient: HttpClient, private pageLoaderService: PageLoaderService, private toastrManager: ToastrManager, private router: Router) { }


  /**
  * Show page loder before request process
  * @return void
  */
  public onRequest(message = ''): void {
    this.pageLoaderService.pageLoader(true);//show page loader
    if (message.length > 0) {
      this.pageLoaderService.setLoaderText(message);//setting loader text
    }

  }

  /**
  * Show success/error on behalf of response
  * @return void
  */
  public onResponse(message = '', isSuccess = false): void {
    this.pageLoaderService.pageLoader(false);//hide page loader
    this.pageLoaderService.setLoaderText('');//setting loader text empty
    if (message.length > 0) {
      if (isSuccess)
        this.toastrManager.successToastr(message, 'Success!', { maxShown: 1 }); //showing success toaster 
      else
        this.toastrManager.errorToastr(message, 'Oops!', { maxShown: 1 });//showing error toaster message
    }
  }

  /**
  * Logout user from the system and erase all info from localstorage
  * @return void
  */
  public logout(): void {
    this.onResponse(environment.MESSGES["LOGOUT-SUCCESS"], true)
    localStorage.clear()
    this.router.navigate(['/authorization']);
  }

  /**
  * Check the user is loggedin oterwise redirect to login page
  * @return void
  */

  public checkAndRedirect() {
    if (localStorage.getItem(environment.TOKEN_NAME)) {
      this.router.navigate(['/home']);
    }
  }

  /**
  * Post the data and endpoint 
  */
  processPostRequest(apiEndPoint, data, showLoader = false, message = '') {

    if (showLoader)
      this.onRequest(environment.MESSGES['CHECKING-AUTHORIZATION']);//show page loader

    return this.httpClient.post(apiEndPoint, data)
      .pipe(
        tap( // Log the result or error
          data => {
            this.onResponse(message, true);//show page loader
          }
        )
      );
  }

  processSignupRequest(apiEndPoint, data, showLoader = false, message = '') {

    if (showLoader)
      this.onRequest(environment.MESSGES['CHECKING-AUTHORIZATION']);//show page loader

    return this.httpClient.post(apiEndPoint, data, { observe: 'response' })
      .pipe(
        tap( // Log the result or error
          data => {
            this.onResponse(message, true);//show page loader
          }
        )
      );
  }
  /**
  * Get the data using posted endpoint 
  */
  processGetRequest(apiEndPoint, showLoader = false, message = '') {
    if (showLoader)
      this.onRequest(environment.MESSGES['CHECKING-AUTHORIZATION']);//show page loader


    return this.httpClient
      .get(apiEndPoint)
      .pipe(
        tap( // Log the result or error
          data => {
            this.onResponse(message, true);//show page loader
          }
        )
      );
  }


  /**
  * Show page loder on fetching data
  * @return void
  */
  public showPageLoader(message = ''): void {
    this.pageLoaderService.pageLoader(true);//show page loader
    if (message.length > 0) {
      this.pageLoaderService.setLoaderText(message);//setting loader text
    }

  }

  /**
  * Hide page loder on fetching data
  * @return void
  */
  public hidePageLoader(): void {
    this.pageLoaderService.pageLoader(false);//hide page loader
    this.pageLoaderService.setLoaderText('');//setting loader text
  }

  /**
  * Show alert on success response & hide page loader
  * @return void
  */
  public onSuccess(message): void {
    this.pageLoaderService.pageLoader(false);//hide page loader
    this.pageLoaderService.setLoaderText('');//setting loader text empty
    this.toastrManager.successToastr(message, 'Success!'); //showing success toaster 
  }

  /**
  * Show alert on error response & hide page loader
  * @return void
  */
  public onError(message): void {
    this.pageLoaderService.setLoaderText('');//setting loader text
    this.pageLoaderService.pageLoader(false);//hide page loader
    this.toastrManager.errorToastr(message, 'Oops!', { maxShown: 1 });//showing error toaster message  
  }

}