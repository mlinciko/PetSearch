import { Component, OnInit } from '@angular/core';
import { finalize } from 'rxjs';
import { AnnouncementService } from 'src/app/modules/catalog/services/announcement.service';
import { BaseCatalogComponent } from 'src/app/modules/shared/components/base-catalog/base-catalog.component';

@Component({
  selector: 'app-user-favorites',
  templateUrl: './user-favorites.component.html',
  styleUrls: ['./user-favorites.component.scss'],
  providers: [AnnouncementService]
})
export class UserFavoritesComponent extends BaseCatalogComponent implements OnInit {
  ngOnInit(): void {
    this.loadAnnouncements();
  }
  
  override loadAnnouncements(): void {
    this.loading = true;
    this.announcement.getFavoriteAnnouncements()
    .pipe(finalize(() => this.loading = false))
    .subscribe(
      (res) => {
        this.announcements = res;
      }
    )
  }

}
