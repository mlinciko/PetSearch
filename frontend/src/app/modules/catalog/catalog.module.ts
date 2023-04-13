import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { CatalogRoutingModule } from './catalog-routing.module';
import { CatalogComponent } from './components/catalog/catalog.component';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { AnnouncementService } from './services/announcement.service';
import { MaterialModule } from '../material/material.module';
import { SharedModule } from '../shared/shared.module';
import { AnnouncementComponent } from './components/announcement/announcement.component';
import { DevExtremeModule } from '../dev-extreme/dev-extreme.module';
import { AddAnnouncementComponent } from './components/add-announcement/add-announcement.component';
import { AnnouncementToolbarComponent } from './components/announcement-toolbar/announcement-toolbar.component';
import { EditAnnouncementComponent } from './components/edit-announcement/edit-announcement.component';



@NgModule({
  declarations: [
    CatalogComponent,
    AnnouncementComponent,
    AddAnnouncementComponent,
    AnnouncementToolbarComponent,
    EditAnnouncementComponent,
  ],
  imports: [
    CommonModule,
    CatalogRoutingModule,
    FontAwesomeModule,
    MaterialModule,
    SharedModule,
    DevExtremeModule,
  ],
  providers: [AnnouncementService]
})
export class CatalogModule { }
