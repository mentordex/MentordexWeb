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
  
  onCompleteYourApplication(postedData): Observable<any> {
    return this.httpClient
      .post('onCompleteMentorApplication', postedData, { observe: 'response' })
  } 

}

