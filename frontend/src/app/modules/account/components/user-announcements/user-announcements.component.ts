import { Component, OnInit } from '@angular/core';
import { finalize } from 'rxjs';
import { AnnouncementService } from 'src/app/modules/catalog/services/announcement.service';
import { BaseCatalogComponent } from 'src/app/modules/shared/components/base-catalog/base-catalog.component';

@Component({
  selector: 'app-user-announcements',
  templateUrl: './user-announcements.component.html',
  styleUrls: ['./user-announcements.component.scss'],
  providers: [AnnouncementService]
})
export class UserAnnouncementsComponent extends BaseCatalogComponent implements OnInit {
   ngOnInit(): void {
    this.loadAnnouncements();
   }

   loadAnnouncements(): void {
    this.loading = true;
    this.announcement.getAnnouncementsByUser(this.userService.getUserId())
    .pipe(finalize(() => this.loading = false))
    .subscribe(
      (res) => {
        this.announcements = res;
      }
    )
   }
}
