import { HttpClient } from '@angular/common/http';
import { Inject, Injectable, InjectionToken } from '@angular/core';
import { environment } from 'src/environments/environment';
import { IAnnouncement } from '../models/announcement';
import { Observable } from 'rxjs';
import { AnnouncementType } from '../models/announcement-type';

export const announcementServiceFactory = (http: HttpClient, typeUrl: AnnouncementType, isHousing: boolean) => {
  return new AnnouncementService(http, typeUrl, isHousing);
}

@Injectable()
export class AnnouncementService {
  restUrl: string = `${environment.backUrl}/api/announcements`;

  constructor(
    private http: HttpClient,
    @Inject('TYPE_URL') private typeUrl: AnnouncementType,
    @Inject('IS_HOUSING') private isHousing: boolean,
  ) { console.log(this.typeUrl)}

  getAllOpenAnnouncements(): Observable<IAnnouncement[]> {
    return this.http.get<IAnnouncement[]>(`${this.restUrl}/housing/open`);
  }

  getAnnouncementsByType(): Observable<IAnnouncement[]> {
    return this.http.get<IAnnouncement[]>(`${this.restUrl}/${this.isHousing ? "housing/" : ""}${this.typeUrl}/open`);
  }

  getAnnouncementsById(id: number): Observable<IAnnouncement> {
    return this.http.get<IAnnouncement>(`${this.restUrl}/${this.isHousing ? "housing/" : ""}${this.typeUrl}/${id}`);
  }

}
