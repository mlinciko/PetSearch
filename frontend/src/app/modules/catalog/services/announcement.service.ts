import { HttpClient, HttpErrorResponse, HttpParams } from '@angular/common/http';
import { Injectable  } from '@angular/core';
import { environment } from 'src/environments/environment';
import { Observable, catchError, throwError } from 'rxjs';
import { IAnnouncement } from '../models/announcement.interface';
import notify from 'devextreme/ui/notify';
import { ICreateAnnouncement } from '../models/create-announcement.interface';
import { IUpdateAnnouncement } from '../models/update-announcement.interface';


@Injectable()
export class AnnouncementService {
  restUrl: string = `${environment.backUrl}/api/announcement/`;

  constructor(
    private http: HttpClient,
  ) {}

  getAllAnnouncements(params?: HttpParams): Observable<IAnnouncement[]> {
    return this.http.get<IAnnouncement[]>(`${this.restUrl}all/`, { params })
    .pipe(
      catchError((err) => 
        this.onCatchError(err, err.error.message ? err.error.message: "Can't get announcements"))
    )
  }

  getAnnouncementsByUser(userId: number): Observable<IAnnouncement[]> {
    let params = new HttpParams();
    params = params.append("user_id", userId.toString());
    return this.http.get<IAnnouncement[]>(`${this.restUrl}by-user/`, { params })
    .pipe(
      catchError((err) => 
        this.onCatchError(err, err.error.message ? err.error.message: "Can't get user announcements"))
    )
  }

  getAnnouncementById(id: number): Observable<IAnnouncement> {
    return this.http.get<IAnnouncement>(`${this.restUrl}?announcement_id=${id}`)
    .pipe(
      catchError((err) => 
        this.onCatchError(err, err.error.message ? err.error.message: "Can't get announcement"))
    )
  }

  addAnnouncementToFavorites(userId: number, announcementId: number): Observable<string> {
    const payload = {
      user_id: userId,
      announcement_id: announcementId,
    }
    return this.http.post<string>(`${this.restUrl}add-to-favorites/`, payload)
    .pipe(
      catchError((err) => 
        this.onCatchError(err, err.error.message ? err.error.message: "Error while additing announcement to favorites"))
    )
  }

  deleteAnnouncementFromFavorites(userId: number, announcementId: number): Observable<any> {
    const payload = {
      user_id: userId,
      announcement_id: announcementId,
    }
    return this.http.delete(`${this.restUrl}delete-from-favorites/`, { body: payload })
    .pipe(
      catchError((err) => 
        this.onCatchError(err, err.error.message ? err.error.message: "Error while deleting announcement to favorites"))
    )
  }

  getFavoriteAnnouncements(): Observable<IAnnouncement[]> {
    return this.http.get<IAnnouncement[]>(`${this.restUrl}favorites/`)
    .pipe(
      catchError((err) => 
        this.onCatchError(err, err.error.message ? err.error.message: "Can't get favorite announcements"))
    )
  }

  createAnnouncement(payload: ICreateAnnouncement): Observable<IAnnouncement> {
    return this.http.post<IAnnouncement>(`${this.restUrl}`, payload)
    .pipe(
      catchError((err) => 
        this.onCatchError(
          err, err.error.message 
          ? err.error.message
          : "Error occured while creating an announcement"
        )
      )
    )
  }

  updateAnnouncement(payload: IUpdateAnnouncement): Observable<IAnnouncement> {
    return this.http.patch<IAnnouncement>(`${this.restUrl}`, payload)
    .pipe(
      catchError((err) => 
        this.onCatchError(
          err, err.error.message 
          ? err.error.message
          : "Error occured while updating an announcement"
        )
      )
    )
  }

  closeAnnouncement(id: number): Observable<string> {
    return this.http.get<string>(`${this.restUrl}close/?announcement_id=${id}`)
    .pipe(
      catchError((err) => 
        this.onCatchError(
          err, err.error.message 
          ? err.error.message
          : "Error occured while closing an announcement"
        )
      )
    )
  }

  onCatchError(err: HttpErrorResponse, message: string): Observable<never> {
    if (err.status !== 403 && err.status !== 401) {
      notify({ message, type: "error", width: "auto"});
    }
    return throwError(err);
  }
}
