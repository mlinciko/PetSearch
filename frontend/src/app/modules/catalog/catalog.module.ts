import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { CatalogRoutingModule } from './catalog-routing.module';
import { CatalogComponent } from './components/catalog/catalog.component';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { AllAnnouncementsComponent } from './components/all-announcements/all-announcements.component';
import { PetSearchComponent } from './components/pet-search/pet-search.component';
import { OwnerSearchComponent } from './components/owner-search/owner-search.component';



@NgModule({
  declarations: [
    CatalogComponent,
    AllAnnouncementsComponent,
    PetSearchComponent,
    OwnerSearchComponent,
  ],
  imports: [
    CommonModule,
    CatalogRoutingModule,
    FontAwesomeModule,
  ]
})
export class CatalogModule { }
