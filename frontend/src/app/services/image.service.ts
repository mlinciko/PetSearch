import { Injectable } from '@angular/core';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class ImageService {
  imageUrl: string = "";
  constructor() { 
    this.imageUrl = environment.backUrl.split(":", 2).join(":") + ":81";
  }

  getFullImagePath(imagePath: string): string {
    return this.imageUrl + imagePath;
  }
}
