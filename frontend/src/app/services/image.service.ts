import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class ImageService {
  imageUrl: string = `${environment.backUrl}/api/image/`;
  constructor(
    private http:HttpClient,
  ){}

  getFullImagePath(imagePath: string, type: "announcements" | "users"): string {
    return `${this.imageUrl}?file_name=${imagePath}&type=${type}`;
  }

  getImageBlob(imageName: string): Observable<Blob> {
    return this.http.get(this.getFullImagePath(imageName, "announcements"), { responseType: "blob" });
  }
}
