import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { AnnouncementService } from '../../services/announcement.service';
import { IAnnouncement } from '../../models/announcement.interface';
import { faHeart, faLocationArrow, faUserCircle } from '@fortawesome/free-solid-svg-icons';
import { ImageService } from 'src/app/services/image.service';
import { UserService } from 'src/app/services/user.service';
import { IFavoriteChangedEvent } from '../../models/favorite-changed-event.interface';

@Component({
  selector: 'app-announcement',
  templateUrl: './announcement.component.html',
  styleUrls: ['./announcement.component.scss']
})
export class AnnouncementComponent implements OnInit {
  announcementId: number | null;
  announcement!: IAnnouncement;
  favoriteIcon = faHeart;
  locationIcon = faLocationArrow;
  noImageIcon = faUserCircle;
  constructor(
    private route: ActivatedRoute,
    private annService: AnnouncementService,
    protected imageService: ImageService,
    private userService: UserService,
  ) { 
    const id = this.route.snapshot.paramMap?.get("id")
    this.announcementId = id ? +id : null;
  }

  ngOnInit(): void {
    this.loadAnnouncement();
  }

  loadAnnouncement(): void {
    if (!this.announcementId) {
      return;
    }
    this.annService.getAnnouncementById(this.announcementId)
    .subscribe(
      (res) => {
        console.log(res);
        this.announcement = res;
      }
    )
  }

  getUserImage(imagePath: string): string {
    return this.imageService.getFullImagePath(imagePath);
  }

  writeToCteator(): void {

  }

  changeFavorite(action: "add" | "delete", announcement: IAnnouncement): void {
    const userId = this.userService.getUserId();
    const announcementId = announcement.announcement_id;

    const refresh = () => this.loadAnnouncement();
    if (action === "add") {
      this.annService.addAnnouncementToFavorites(userId, announcementId)
      .subscribe(refresh);
    }
    if (action === "delete") {
      this.annService.deleteAnnouncementFromFavorites(userId, announcementId)
      .subscribe(refresh);
    }
  }

}
