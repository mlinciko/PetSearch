import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { CatalogComponent } from './components/catalog/catalog.component';
import { announcementTypes } from './models/announcement-types';
import { AnnouncementComponent } from './components/announcement/announcement.component';

const routes: Routes = [
  {
    path: "all",
    component: CatalogComponent,
    data: { type: "all" },
  },
  {
    path: "pet-search",
    component: CatalogComponent,
    data: { type: announcementTypes['PET_SEARCH'] },
  },
  {
    path: "owner-search",
    component: CatalogComponent,
    data: { type: announcementTypes['OWNER_SEARCH'] },
  },
  {
    path: "announcement",
    children: [
      {
        path: "view/:id",
        component: AnnouncementComponent,
      }
    ]
  },
  { path: "", pathMatch: "full", redirectTo: "all"},
  { path: "**", redirectTo: "all" },
]

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class CatalogRoutingModule { }
