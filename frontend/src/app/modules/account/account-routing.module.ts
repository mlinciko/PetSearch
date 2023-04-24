import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AccountRootComponent } from './components/account-root/account-root.component';
import { ProfileManagementComponent } from './components/profile-management/profile-management.component';
import { ChangePasswordComponent } from './components/change-password/change-password.component';
import { UserAnnouncementsComponent } from './components/user-announcements/user-announcements.component';
import { UserFavoritesComponent } from './components/user-favorites/user-favorites.component';

const routes: Routes = [
  {
    path: "",
    component: AccountRootComponent,
    children: [
      {
        path: "profile",
        component: ProfileManagementComponent,
      },
      {
        path: "change-password",
        component: ChangePasswordComponent,
      },
      {
        path: "user-announcements",
        component: UserAnnouncementsComponent,
      },
      {
        path: "favorites",
        component: UserFavoritesComponent,
      },
      {
        path: "chats",
        loadChildren: () =>
          import("../chats/chats.module").then(
            (m) => m.ChatsModule
          ),
      }
    ]
  },
  { path: "", pathMatch: "full", redirectTo: "user-announcements"},
  { path: "**", redirectTo: "all" },
]

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class AccountRoutingModule { }
