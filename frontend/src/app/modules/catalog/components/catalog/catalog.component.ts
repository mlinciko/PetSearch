import { Component } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { IAnnouncementType } from '../../models/announcement-types';
import { AnnouncementService } from '../../services/announcement.service';
import { HttpParams } from '@angular/common/http';
import { ImageService } from 'src/app/services/image.service';
import { finalize } from 'rxjs';
import { UserService } from 'src/app/services/user.service';
import { BaseCatalogComponent } from 'src/app/modules/shared/components/base-catalog/base-catalog.component';

@Component({
  selector: 'app-catalog',
  templateUrl: './catalog.component.html',
  styleUrls: ['./catalog.component.scss']
})
export class CatalogComponent extends BaseCatalogComponent {
  type: IAnnouncementType | string | any;

  constructor(
    private route: ActivatedRoute,
    protected override announcement: AnnouncementService,
    protected override userService: UserService
  ) {
    super(announcement, userService);
    this.type = this.route.snapshot.data['type'];
    this.loadAnnouncements();
  }

  loadAllAnnouncementsByType(params? : HttpParams): void {
    this.loading = true;
    this.announcement.getAllAnnouncements(params)
    .pipe(finalize(() => this.loading = false))
    .subscribe(
      (res) => {
        this.announcements = res;
      }
    )
  }

  loadAnnouncements(params: HttpParams = new HttpParams()): void {
    if (this.type === "all") {
      this.loadAllAnnouncementsByType(params);
    } else {
      params = params.append("type_id", this.type.id)
      this.loadAllAnnouncementsByType(params);
    }
  }

  reload(params: HttpParams): void {
    this.loadAnnouncements(params);
  }

}
