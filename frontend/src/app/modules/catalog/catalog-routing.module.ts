import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AllAnnouncementsComponent } from './components/all-announcements/all-announcements.component';
import { OwnerSearchComponent } from './components/owner-search/owner-search.component';
import { PetSearchComponent } from './components/pet-search/pet-search.component';

const routes: Routes = [
  {
    path: "all",
    component: AllAnnouncementsComponent,
  },
  {
    path: "pet-search",
    component: PetSearchComponent,
  },
  {
    path: "owner-search",
    component: OwnerSearchComponent,
  },
  { path: "", pathMatch: "full", redirectTo: "all"},
  { path: "**", redirectTo: "all" },
]

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class CatalogRoutingModule { }
