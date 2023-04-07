import { NgModule } from '@angular/core';
import { AuthRootComponent } from './components/auth-root/auth-root.component';
import { RouterModule, Routes } from '@angular/router';
import { DefaultComponent } from './components/default/default.component';
import { LoginComponent } from './components/login/login.component';
import { RegistryComponent } from './components/registry/registry.component';
import { AppGuard } from 'src/app/app.guard';

const routes: Routes = [
  {
    path: '',
    component: AuthRootComponent,
    canActivate: [AppGuard],
    children:[
      {
        path: '',
        component: DefaultComponent,
      },
      {
        path: 'in',
        component: LoginComponent,
      },
      {
        path: 'up',
        component: RegistryComponent,
      },
    ]
  },
  { path: "**", redirectTo: "/" },
]

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class AuthRoutingModule { }
