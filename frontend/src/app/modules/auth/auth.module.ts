import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AuthRootComponent } from './components/auth-root/auth-root.component';
import { DevExtremeModule } from '../dev-extreme/dev-extreme.module';
import { AuthRoutingModule } from './auth-routing.module';
import { DefaultComponent } from './components/default/default.component';
import { LoginComponent } from './components/login/login.component';
import { RegistryComponent } from './components/registry/registry.component';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { AuthService } from './services/auth.service';



@NgModule({
  declarations: [
    AuthRootComponent,
    DefaultComponent,
    LoginComponent,
    RegistryComponent
  ],
  imports: [
    CommonModule,
    AuthRoutingModule,
    DevExtremeModule,
    FontAwesomeModule,
  ],
})
export class AuthModule { }
