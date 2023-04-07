import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, CanActivate, Router, RouterStateSnapshot, UrlTree } from '@angular/router';
import notify from 'devextreme/ui/notify';
import { Observable } from 'rxjs';
import { IGuardPathes } from './models/models';
import { AuthService } from './modules/auth/services/auth.service';
import { guardPathes } from './pathes';
import { UserService } from './services/user.service';

@Injectable({
  providedIn: 'root'
})
export class AppGuard implements CanActivate {
  constructor(
    private auth: AuthService,
    private user: UserService,
    private router: Router,
  ) {}
  canActivate(
    route: ActivatedRouteSnapshot,
    state: RouterStateSnapshot): Observable<boolean | UrlTree> | Promise<boolean | UrlTree> | boolean | UrlTree {
    const backUrl = "/";
    const { canActivate, message } = this.canBeRouted(
      guardPathes,
      state.url
    );

    if (!canActivate) {
      notify({ message: message, type: "error", width: "auto"});
      this.router.navigate([backUrl]);
      return false;
    }
    return true;
  }

  canBeRouted(
    pathes: IGuardPathes[],
    url: string
  ): { canActivate: boolean; message: string } {
    for (const path of pathes) {
      const { regExp, message, additionalRule } = path;
      if (RegExp(regExp).test(url)) {
        if (additionalRule === "tokenDosentExists" && this.auth.isTokenExists()) {
          return {
            canActivate: false,
            message,
          };
        }
        if (additionalRule === "tokenDosentExpired" && !this.auth.isTokenExpired()) {
          return {
            canActivate: false,
            message: "Please re-authorize",
          };
        }
        if (additionalRule === "tokenExists" && !this.auth.isTokenExists()) {
          return {
            canActivate: false,
            message: message,
          };
        }

        return {
          canActivate: true,
          message,
        };
      }
    }
    return {
      canActivate: false,
      message: "У Вас недостаточно прав на просмотр этой страницы",
    };
  }
  
}
