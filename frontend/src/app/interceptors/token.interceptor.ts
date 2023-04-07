import { Injectable } from '@angular/core';
import {
  HttpRequest,
  HttpHandler,
  HttpEvent,
  HttpInterceptor,
  HttpErrorResponse
} from '@angular/common/http';
import { Observable, catchError, switchMap, throwError } from 'rxjs';
import { AuthService } from '../modules/auth/services/auth.service';
import { Router } from '@angular/router';
import notify from 'devextreme/ui/notify';

const EXCLUDED_URLS = [
  "/auth",
]

@Injectable()
export class TokenInterceptor implements HttpInterceptor {

  constructor(
    private auth: AuthService,
    private router: Router,
  ) {}

  intercept(request: HttpRequest<unknown>, next: HttpHandler): Observable<HttpEvent<unknown>> {
    if (this.isExcludedUrl(request.url)) {
      return next.handle(request);
    }
    
    return next.handle(this.withToken(request)).pipe(
      catchError((err: HttpErrorResponse) => {
          if (err.status === 401) {
            return this.auth.updateAccessToken().pipe(
              switchMap(
                () => {
                  return next.handle(this.withToken(request));
                }
              ),
              catchError((err) => {
                if (err.status === 401) {
                  this.router.navigate(["/login"])
                  notify({ message: "Re-login please", type: "error", width: "auto"});
                }
                return throwError(err)
              })
            );
          }
          if (err.status === 403) {
            notify({ message: "You are not authorized", type: "error", width: "auto"});
          }
          return throwError(err);
        }
      )
    )
  }

  isExcludedUrl(currentUrl: string): boolean {
    for (const excludedUrl of EXCLUDED_URLS) {
      if (currentUrl.includes(excludedUrl))
        return true;
    }
    return false;
  }

  withToken(request: HttpRequest<unknown>): HttpRequest<unknown> {
    return request.clone({
      headers: request.headers.set('Authorization', `Bearer ${this.auth.getToken()}`)
    })
  }
}
