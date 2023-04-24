import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { AnnouncementService } from '../../services/announcement.service';
import { IAnnouncement } from '../../models/announcement.interface';
import { faHeart, faLocationArrow, faPaw, faUserCircle } from '@fortawesome/free-solid-svg-icons';
import { ImageService } from 'src/app/services/image.service';
import { UserService } from 'src/app/services/user.service';
import { confirm } from "devextreme/ui/dialog";
import { ChatService } from 'src/app/modules/chats/services/chat.service';
import { ICreateChatPayload } from 'src/app/modules/chats/models/create-chat-payload.iterface';
import notify from 'devextreme/ui/notify';

@Component({
  selector: 'app-announcement',
  templateUrl: './announcement.component.html',
  styleUrls: ['./announcement.component.scss'],
  providers: [ChatService]
})
export class AnnouncementComponent implements OnInit {
  announcementId: number | null;
  announcement!: IAnnouncement;
  favoriteIcon = faHeart;
  locationIcon = faLocationArrow;
  noImageIcon = faUserCircle;
  pawIcon = faPaw;

  sliderItems: {image: string}[] = [];

  currentUser!: number;
  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private annService: AnnouncementService,
    protected imageService: ImageService,
    protected userService: UserService,
    private chat: ChatService,
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
        this.createSliderItems(this.announcement.images);
      }
    )
  }

  getCurrentUserId(): void {
    const id = this.userService.getUserId();
    if (id)
      this.currentUser = id;
  }

  getImage(imagePath: string, type: "announcements" | "users"): string {
    return this.imageService.getFullImagePath(imagePath, type);
  }

  writeToCteator(): void {
    if (this.userService.isUserAuthrized()) {
      const payload :ICreateChatPayload = {
        announcement_id: this.announcement.announcement_id,
        companion_id: this.announcement.user_id,

      }
      this.chat.createChat(payload)
      .subscribe(
        (res) => {
          this.router.navigate(['/account/chats/room/' + res.room_id])
        } 
      )
    } else {
      notify({ message: "You are not authorized", type: "error", width: "auto"});
    }
    
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

  createSliderItems(images: string[]): void {
    if (!images.length) {
      return;
    }
    images.forEach(
      (image) => {
        return this.sliderItems.push(
          {
            image: this.getImage(image, "announcements"),
          }
        );
      }
    )
  }

}
