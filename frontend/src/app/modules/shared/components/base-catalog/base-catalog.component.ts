import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { faPaw } from '@fortawesome/free-solid-svg-icons';
import { IAnnouncement } from 'src/app/modules/catalog/models/announcement.interface';
import { IFavoriteChangedEvent } from 'src/app/modules/catalog/models/favorite-changed-event.interface';
import { AnnouncementService } from 'src/app/modules/catalog/services/announcement.service';
import { ImageService } from 'src/app/services/image.service';
import { UserService } from 'src/app/services/user.service';

@Component({
  selector: 'app-base-catalog',
  templateUrl: './base-catalog.component.html',
  styleUrls: ['./base-catalog.component.scss']
})
export abstract class BaseCatalogComponent {
  public announcements: IAnnouncement[] = [];
  public pawIcon = faPaw;
  public loading: boolean = false;

  constructor(
    protected announcement: AnnouncementService,
    protected userService: UserService,
  ) { }

  abstract loadAnnouncements(): void;

  changeFavorite(e: IFavoriteChangedEvent): void {
    const userId = this.userService.getUserId();
    const announcementId = e.item.announcement_id;

    if (!userId) {
      return;
    }
    const refresh = () => this.loadAnnouncements();
    if (e.action === "add") {
      this.announcement.addAnnouncementToFavorites(userId, announcementId)
      .subscribe(refresh);
    }
    if (e.action === "delete") {
      this.announcement.deleteAnnouncementFromFavorites(userId, announcementId)
      .subscribe(refresh);
    }
  }

}
