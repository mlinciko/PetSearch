import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { finalize } from 'rxjs';
import { AnnouncementService } from 'src/app/modules/catalog/services/announcement.service';
import { BaseCatalogComponent } from 'src/app/modules/shared/components/base-catalog/base-catalog.component';
import { ImageService } from 'src/app/services/image.service';
import { UserService } from 'src/app/services/user.service';

@Component({
  selector: 'app-user-announcements',
  templateUrl: './user-announcements.component.html',
  styleUrls: ['./user-announcements.component.scss'],
  providers: [AnnouncementService]
})
export class UserAnnouncementsComponent extends BaseCatalogComponent implements OnInit {
  constructor(
    protected override announcement: AnnouncementService,
    protected override userService: UserService,
    private router: Router,
  ) {
    super(announcement, userService);
  }
   ngOnInit(): void {
    this.loadAnnouncements();
   }

   loadAnnouncements(): void {
    this.loading = true;
    const id = this.userService.getUserId()
    if (!id) {
      return;
    }
    this.announcement.getAnnouncementsByUser(id)
    .pipe(finalize(() => this.loading = false))
    .subscribe(
      (res) => {
        this.announcements = res;
      }
    )
   }

   createAnnouncement(): void {
    this.router.navigate(["/announcement/add"])
   }
}
