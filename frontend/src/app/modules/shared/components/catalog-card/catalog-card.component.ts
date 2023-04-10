import { Component, EventEmitter, Input, Output } from '@angular/core';
import { Router } from '@angular/router';
import { faHeart, faLocationArrow } from '@fortawesome/free-solid-svg-icons';
import { IAnnouncement } from 'src/app/modules/catalog/models/announcement.interface';
import { IFavoriteChangedEvent } from 'src/app/modules/catalog/models/favorite-changed-event.interface';

@Component({
  selector: 'app-catalog-card',
  templateUrl: './catalog-card.component.html',
  styleUrls: ['./catalog-card.component.scss']
})
export class CatalogCardComponent {
  @Input() announcement!: IAnnouncement;
  @Output() onFavoriteChanged: EventEmitter<IFavoriteChangedEvent> = new EventEmitter<IFavoriteChangedEvent>();
  locationIcon = faLocationArrow;
  favoriteIcon = faHeart;

  constructor(private router: Router){}

  changeFavorite(action: "add" | "delete", announcement: IAnnouncement): void {
    this.onFavoriteChanged.emit({action, item: announcement});
  }

  goToAnnouncement(item: IAnnouncement): void {
    this.router.navigate([`/announcement/view/${item.announcement_id}`])
  }

}
