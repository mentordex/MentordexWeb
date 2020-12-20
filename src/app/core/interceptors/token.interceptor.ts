import { Injectable } from '@angular/core';
import { HttpRequest, HttpHandler, HttpEvent, HttpInterceptor } from '@angular/common/http';
import { Observable } from 'rxjs/Observable';


@Injectable()

export class TokenInterceptor implements HttpInterceptor {
  constructor() { }
  intercept(request: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {


    let apiReq = request.clone({ url: `${request.url}` });  
    
      if (localStorage.getItem('dexmentor-auth-token') && !(request.url).includes('wp-json') && !(request.url).includes('ipify')) {
        request = request.clone({
          setHeaders: {
            'x-dexmentor-auth-token': localStorage.getItem('dexmentor-auth-token')
          }
        });
      }
    
   
    return next.handle(request);

  }
}
