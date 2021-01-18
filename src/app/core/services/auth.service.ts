import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable, Subject, throwError } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  constructor(private httpClient: HttpClient) { }

  login(postedData): Observable<any> {
    
    return this.httpClient
      .post('login', postedData, { observe: 'response' })
  
  }  

}

