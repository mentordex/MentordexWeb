import { Injectable } from '@angular/core';
import { HttpRequest, HttpHandler, HttpEvent, HttpInterceptor } from '@angular/common/http';
import { Observable } from 'rxjs/Observable';
import { environment } from '../../../environments/environment';

@Injectable()

export class TokenInterceptor implements HttpInterceptor {
  constructor() { }
  intercept(request: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {


    let apiReq = request.clone({ url: `${request.url}` });  
    
      if (localStorage.getItem(environment.TOKEN_NAME)) {
        request = request.clone({
          setHeaders: {
            'x-dexmentor-auth-token': localStorage.getItem(environment.TOKEN_NAME)
          }
        });
      }
    
   
    return next.handle(request);

  }
}
