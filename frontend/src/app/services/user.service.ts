import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { Injectable } from '@angular/core';
import notify from 'devextreme/ui/notify';
import { BehaviorSubject, catchError, map, Observable, throwError } from 'rxjs';
import { environment } from 'src/environments/environment';
import { IChangePass, IUser } from '../models/models';
import { AuthService } from '../modules/auth/services/auth.service';

@Injectable({
  providedIn: 'root',
})
export class UserService {
  restUrl = `${environment.backUrl}/api/user/`
  user: BehaviorSubject<IUser | any> = new BehaviorSubject(null);

  constructor(
    private http: HttpClient,
    private auth: AuthService
  ) {}

  initializeUser(): void {
    if (this.auth.isTokenExists()) {
      this.getCurrentUser();
    }
  }

  getUserIdByToken(): Observable<number> {
    const token = this.auth.decodeToken();
    return token.userId
  }

  getCurrentUser(): void {
    this.http.get(`${this.restUrl}current/`)
    .pipe(
      map(
        (res: any) => {
          if (res) {
            console.log(res);
            this.setUser(res)
          }
        }
      ),
      catchError((err) => {
        if (err.status !== 409) {
          this.onCatchError(err, err.error.message ? err.error.message: "Can't get current user!")
        } 
        return throwError(err);
      })
    )
    .subscribe();
  }

  getUserById(userId: number): Observable<IUser> {
    return this.http.get<IUser>(`${this.restUrl}/${userId}`)
    .pipe(
      catchError((err) => this.onCatchError(err, err.error.message ? err.error.message: "User data error"))
    )
  }

  updateUser(user: IUser): Observable<IUser> {
    return this.http.patch<IUser>(this.restUrl, user)
    .pipe(
      map(
        (res: IUser) => {
          this.user.next(res);
          return res;
        }
      ),
      catchError((err) => 
        this.onCatchError(err, err.error.message ? err.error.message: "Error while updating user data"))
    )
  }

  deleteUser(): Observable<string> {
    const userId = this.user.value.user_id;
    return this.http.delete<string>(`${this.restUrl}?user_id=${userId}`)
    .pipe(
      catchError((err) => 
        this.onCatchError(err, err.error.message ? err.error.message: "Error while deleting user"))
    )
  }

  changePassword(payload: IChangePass): Observable<string> {
    return this.http.patch<string>(`${this.restUrl}password-change/`, payload)
    .pipe(
      catchError((err) => 
        this.onCatchError(err, err.error.message ? err.error.message: "Error while changing password"))
    )
  }

  uploadCurrentUserAvatar(file: File): Observable<any> {
    const payload = new FormData();
    payload.append("file", file);
    return this.http.post(`${this.restUrl}/upload-image`, payload)
    .pipe(
      catchError((err) => 
        this.onCatchError(
          err, err.error.message 
          ? err.error.message
          : "Error occured while uploading image"
      )),
      map(
        (res) => {
          this.getCurrentUser();
          return res;
        }
      )
    )
  }

  isUserAuthrized(): boolean {
    return !!this.user.value;
  }

  setUser(user: IUser | null) {
    this.user.next(user);
  }

  unsetUser(): void {
    this.user.next(null);
  }

  getUserId(): number | null {
    return this.user.value? this.user.value.user_id : null;
  }

  onCatchError(err: HttpErrorResponse, message: string): Observable<never> {
    if (err.status !== 403 && err.status !== 401) {
      notify({ message, type: "error", width: "auto"});
    }
    return throwError(err);
  }
}
