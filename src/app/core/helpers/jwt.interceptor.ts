import { inject, Injectable } from '@angular/core';
import {
    HttpRequest,
    HttpHandler,
    HttpEvent,
    HttpInterceptor,
} from '@angular/common/http';
import { Observable } from 'rxjs';

import { AuthenticationService } from '../services/auth.service';


@Injectable()
export class JwtInterceptor implements HttpInterceptor {
 
  private authenticationService = inject(AuthenticationService);
 
  intercept(req: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
 
    const token = this.authenticationService.getUserAccessToken();
    req = req.clone({
      headers: req.headers.set(
        'Authorization',
        'Bearer ' + token,
      )
    });
 
    return next.handle(req);
 
  }
 
}
