import { Injectable } from "@angular/core";
import { CanActivate, Router, ActivatedRouteSnapshot, RouterStateSnapshot } from "@angular/router";
import { AuthService } from "../services/auth.service";

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
