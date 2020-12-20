import { Injectable } from "@angular/core";
import { Observable } from "rxjs";
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { ToastrManager } from 'ng6-toastr-notifications';//toaster class
import { Router } from "@angular/router";

//import shared services
import { PageLoaderService } from './page-loader.service'
import { AuthService } from './auth.service'


@Injectable()
export class UtilsService {

 
  constructor(private httpClient: HttpClient, private pageLoaderService: PageLoaderService, private toastrManager: ToastrManager, private authService:AuthService, private router:Router ) { }


  /**
  * Show page loder on fetching data
  * @return void
  */
  public showPageLoader(message = ''):void{
    this.pageLoaderService.pageLoader(true);//show page loader
    if(message.length>0){      
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
    this.toastrManager.errorToastr(message, 'Oops!',{maxShown:1});//showing error toaster message  
  }

  /**
  * Logout user from the system and erase all info from localstorage
  * @return void
  */
  public logout():void{
    //this.toastrManager.successToastr(this.translateService.instant('ACTION-MESSAGE.LOGOUT-SUCCESS'), 'Success!');//showing 
    
    localStorage.clear();
    this.authService.isLoggedIn(false);
    this.router.navigate(['/']);    
  }

  /**
  * Check the user is loggedin oterwise redirect to login page
  * @return void
  */

  public checkAndRedirect(){
    if (localStorage.getItem("dexmentor-auth-token")) {
      //this.router.navigate(['/authorized/dashboard']);
    }
  }

  /**
  * To check the image validity for type jpeg, png, jpg
  * @return boolean
  * @param base64string image base64 string 
  * @param type image type (jpeg, png, jpg)
  */
 public isFileCorrupted(base64string, type): boolean {

  if (type == 'png') {

    const imageData = Array.from(atob(base64string.replace('data:image/png;base64,', '')), c => c.charCodeAt(0))
    const sequence = [0, 0, 0, 0, 73, 69, 78, 68, 174, 66, 96, 130]; // in hex: 

    //check last 12 elements of array so they contains needed values
    for (let i = 12; i > 0; i--) {
      if (imageData[imageData.length - i] !== sequence[12 - i]) {
        return false;
      }
    }

    return true;
  }
  else if(type=='pdf'){ 
    return true;
  }
  else if (type == 'jpeg' || type == 'jpg') {
    const imageDataJpeg = Array.from(atob(base64string.replace('data:image/jpeg;base64,', '')), c => c.charCodeAt(0))
    const imageCorrupted = ((imageDataJpeg[imageDataJpeg.length - 1] === 217) && (imageDataJpeg[imageDataJpeg.length - 2] === 255))
    return imageCorrupted;
  }
}
  
  /**
  * Post the data and endpoint 
  */
  processPostRequest(apiEndPoint, data){
    return this.httpClient
        .post(apiEndPoint, data)
  }
  /**
  * Get the data using posted endpoint 
  */
  processGetRequest(apiEndPoint){
    return this.httpClient
        .get(apiEndPoint)
  }
  
}