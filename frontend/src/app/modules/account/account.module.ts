import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AccountRootComponent } from './components/account-root/account-root.component';
import { AccountRootMenuComponent } from './components/account-root-menu/account-root-menu.component';
import { AccountRoutingModule } from './account-routing.module';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { ProfileManagementComponent } from './components/profile-management/profile-management.component';
import { ChangePasswordComponent } from './components/change-password/change-password.component';
import { DevExtremeModule } from 'devextreme-angular';



@NgModule({
  declarations: [
    AccountRootComponent,
    AccountRootMenuComponent,
    ProfileManagementComponent,
    ChangePasswordComponent
  ],
  imports: [
    CommonModule,
    AccountRoutingModule,
    FontAwesomeModule,
    DevExtremeModule,
  ]
})
export class AccountModule { }
