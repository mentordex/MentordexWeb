import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable, Subject, throwError } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  public isUserLoggedIn: Subject<any> = new Subject<any>();

  constructor(private httpClient: HttpClient) { }


  isLoggedIn(value: boolean) {  

    this.isUserLoggedIn.next({ isLoggedIn: value });
  }
  checkLoggedinStatus(): Observable<any> {
    return this.isUserLoggedIn.asObservable();
  }

  login(postedData): Observable<any> {
    return this.httpClient
      .post('login', postedData, { observe: 'response' })
  
  }
  
  
  signUp(postedData): Observable<any> {
  
    return this.httpClient
        .post('signup', postedData,{ observe: 'response' })     
  
  }
  
  forgotPassword(postedData): Observable<any> {      
    return this.httpClient
        .post('forgot-password', postedData)
  
  }

  userProfileData(): Observable<any> {      
    return this.httpClient
        .post('userProfileData', { userID:localStorage.getItem('dexmentor-user-data-ID')})
  
  }

  verifyToken(postedData): Observable<any> {      
    return this.httpClient
        .post('verifyToken', postedData)  
  }  

  processPostRequest(apiEndPoint, data){
    return this.httpClient
        .post(apiEndPoint, data)
  }
  
  processGetRequest(apiEndPoint){
    return this.httpClient
        .get(apiEndPoint)
  }
}

