import { HTTP_INTERCEPTORS } from '@angular/common/http';
import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { TokenInterceptor } from './interceptors/token.interceptor';
import { MainRootComponent } from './modules/main/components/main-root/main-root.component';
import { AppGuard } from './app.guard';

const routes: Routes = [
  {
    path: "sign",
    loadChildren: () =>
      import("./modules/auth/auth.module").then(
        (m) => m.AuthModule
      ),
  },
  {
    path: "",
    component: MainRootComponent,
    children: [
      {
        path: "account",
        canActivate: [AppGuard],
        loadChildren: () =>
          import("./modules/account/account.module").then(
            (m) => m.AccountModule
          ),
      },
      {
        path: "",
        loadChildren: () =>
        import("./modules/catalog/catalog.module").then(
          (m) => m.CatalogModule
        ),
      },
    ]
  },
  { path: "**", redirectTo: ""}
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
