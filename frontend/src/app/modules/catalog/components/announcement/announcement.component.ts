import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { AnnouncementService } from '../../services/announcement.service';
import { IAnnouncement } from '../../models/announcement.interface';
import { faHeart, faLocationArrow, faUserCircle } from '@fortawesome/free-solid-svg-icons';
import { ImageService } from 'src/app/services/image.service';
import { UserService } from 'src/app/services/user.service';
import { confirm } from "devextreme/ui/dialog";

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

  currentUser!: number;
  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private annService: AnnouncementService,
    protected imageService: ImageService,
    protected userService: UserService,
  ) { 
    const id = this.route.snapshot.paramMap?.get("id")
    this.announcementId = id ? +id : null;
  }

  ngOnInit(): void {
    this.loadAnnouncement();
    this.getCurrentUserId();
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

  getCurrentUserId(): void {
    const id = this.userService.getUserId();
    if (id)
      this.currentUser = id;
  }

  getUserImage(imagePath: string): string {
    return this.imageService.getFullImagePath(imagePath);
  }

  writeToCteator(): void {

  }

  changeFavorite(action: "add" | "delete", announcement: IAnnouncement): void {
    const userId = this.userService.getUserId();
    const announcementId = announcement.announcement_id;

    if (!userId) {
      return;
    }
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

  editAnnouncement(): void {
    this.router.navigate([`announcement/edit/${this.announcementId}`])
  }

  closeAnnouncement(): void {
    const result = confirm(
      "<i>Are you sure you want to close the announcement?</i>",
      "Confirm action"
    );
    result.then((dialogResult) => {
      if (dialogResult) {
        if (this.announcementId) {
          this.annService.closeAnnouncement(this.announcementId)
          .subscribe(
            (res) => this.router.navigate([`account/user-announcements`])
          )
        }
      }
    });
  }

}
