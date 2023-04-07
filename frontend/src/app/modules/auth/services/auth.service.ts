import { HttpClient, HttpErrorResponse, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { BehaviorSubject, catchError, map, Observable, switchMap, throwError } from 'rxjs';
import { environment } from 'src/environments/environment';
import { IAuthResponse, IRegistryPayload, ILoginPayload, IToken } from '../models/models';
import notify from "devextreme/ui/notify";
import { JwtHelperService } from "@auth0/angular-jwt";
import { Router } from '@angular/router';

const helper = new JwtHelperService();

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  restUrl = `${environment.backUrl}/api/auth/`

  public accessToken: BehaviorSubject<string> = new BehaviorSubject("");
  private rememberMe: BehaviorSubject<boolean> = new BehaviorSubject(false);
  constructor(
    private http: HttpClient,
    private router: Router,
  ) { }

  initializeToken(): void {
    const token = localStorage.getItem("access_token");
    this.accessToken.next(token ? token : '');
  }

  login(payload: ILoginPayload, rememberMe: boolean = false): Observable<IAuthResponse> {
    this.rememberMe.next(rememberMe);
    return this.http.post<IToken>(`${this.restUrl}login/`, payload, { withCredentials: true })
    .pipe(
      map(
        (res: IToken) => {
          console.log(res);
          if (res.accessToken) {
            this.accessToken.next(res.accessToken);
            if (rememberMe) {
              localStorage.setItem("access_token", res.accessToken)
            }
            return { status: true, message: "Authorization completed successfully" }
          }
          return { status: true, message: "Unexpected authorization error" }
        }
      ),
      catchError((err) => this.onCatchError(err, err.error.message ? err.error.message: "Authorization error"))
    )
  }
  
  registry(payload: IRegistryPayload, rememberMe: boolean = false): Observable<IAuthResponse> {
    this.rememberMe.next(rememberMe);
    return this.http.post<IToken>(`${this.restUrl}register/`, payload, { withCredentials: true })
    .pipe(
      map(
        (res: IToken) => {
          console.log(res);
          if (res.accessToken) {
            this.accessToken.next(res.accessToken);
            if (rememberMe) {
              localStorage.setItem("access_token", res.accessToken)
            }
            return { status: true, message: "Registration completed successfully" }
          }
          return { status: true, message: "Unexpected registration error" }
        }
      ),
      catchError((err) => this.onCatchError(err, err.error.message ? err.error.message: "Registration error"))
    )
  }

  logoutClient(): void {
    localStorage.removeItem("access_token");
    this.router.navigate(['/'])
  }

  isTokenExpired(): boolean {
    return helper.isTokenExpired(this.accessToken.value);
  }

  isTokenExists(): boolean {
    return this.accessToken.value !== '';
  }

  getToken(): string {
    return this.accessToken.value;
  }

  decodeToken(): any {
    return helper.decodeToken(this.accessToken.value);
  }

  updateAccessToken(): Observable<IToken> {
    const headers = new HttpHeaders({'X-Verification-Code': 'verification_code'})
    return this.http.get<IToken>(`${this.restUrl}`, { headers: headers, withCredentials: true})
    .pipe(
      map((res: IToken) => {
        this.accessToken.next(res.accessToken);
        if (this.rememberMe.value) {
          localStorage.setItem("access_token", res.accessToken)
        }
        return res;
      }),
      catchError((err) => this.onCatchError(err, "Unexpected token error!"))
    )
  }

  onCatchError(err: HttpErrorResponse, message: string): Observable<never> {
    if (err.status !== 403 && err.status !== 401) {
      notify({ message, type: "error", width: "auto"});
    }
    return throwError(err);
  }
}
