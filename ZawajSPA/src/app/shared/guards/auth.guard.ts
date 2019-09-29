import { Injectable } from "@angular/core";
import { CanActivate, UrlTree, Router, ActivatedRouteSnapshot, RouterStateSnapshot } from "@angular/router";
import { Observable } from "rxjs";
import { AuthService } from "../services/auth.service";
import { NbToastrService } from '@nebular/theme';

@Injectable({
  providedIn: "root"
})
export class AuthGuard implements CanActivate {
  constructor(private authservice: AuthService, private router: Router) {}
  canActivate(next: ActivatedRouteSnapshot, state: RouterStateSnapshot): boolean{
    if (this.authservice.isAuthenticated()) {
      //this.authservice.hubConnection.stop();
      return true;
    } else {
      this.authservice.redirectUrl = state.url;
      this.router.navigate(['/auth/login']);
      return false;
    }
  }
}
