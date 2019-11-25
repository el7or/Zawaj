import { JwtHelperService } from "@auth0/angular-jwt";
import { UserRegister } from "./register/user-register";
import { map } from "rxjs/operators";
import { Router } from "@angular/router";
import { Injectable } from "@angular/core";
import { HttpClient } from "@angular/common/http";

import { environment } from "src/environments/environment";
import { UserLogin } from "./login/user-login";

@Injectable({
  providedIn: "root"
})
export class AuthService {
  baseUrl = environment.API_URL + "auth/";
  jwtHelper = new JwtHelperService();
  private _isAuthenticated: boolean = false;
  private _currentUserId: string;
  /* currentUserName:string;
  currentUserPhoto:string;
  currentUserNickName:string; */

  redirectUrl: string;

  public get isAuthenticated(): boolean {
    try {
      const token = localStorage.getItem("token");
      this._isAuthenticated = !this.jwtHelper.isTokenExpired(token);
      return this._isAuthenticated;
    } catch {
      return false;
    }
  }
  public get currentUserId(): string {
    try {
      const userId = localStorage.getItem("jti");
      this._currentUserId = userId
      return this._currentUserId;
    } catch {
      return "";
    }
  }

  constructor(private router: Router, private http: HttpClient) {}

  login(user: UserLogin) {
    return this.http.post(this.baseUrl + "login/", user).pipe(
      map((res: any) => {
        if (res) {
          this._isAuthenticated = true;
          localStorage.setItem("token", res.token);
          let decodedToken = this.jwtHelper.decodeToken(res.token);
          localStorage.setItem("jti", decodedToken.jti);
          /* this.currentUserName=decodedToken.sub;
          this.currentUserPhoto = res.userPhotoURL==null? (res.userGender=='رجل'? 'assets/images/avatar.png':'assets/images/avatar-female.png'):res.userPhotoURL;
          this.currentUserNickName = res.userNickName;
          localStorage.setItem('userPhoto',this.currentUserPhoto);
          localStorage.setItem('userNickName',this.currentUserNickName); */
        }
      })
    );
  }

  register(user: UserRegister) {
    return this.http.post(this.baseUrl + "register/", user).pipe(
      map((res: any) => {
        if (res) {
          this._isAuthenticated = true;
          localStorage.setItem("token", res.token);
          let decodedToken = this.jwtHelper.decodeToken(res.token);
          localStorage.setItem("jti", decodedToken.jti);
          /* this.currentUserName=decodedToken.sub;
          this.currentUserPhoto = res.userPhotoURL==null? (res.userGender=='رجل'? 'assets/images/avatar.png':'assets/images/avatar-female.png'):res.userPhotoURL;
          this.currentUserNickName = res.userNickName;
          localStorage.setItem('userPhoto',this.currentUserPhoto);
          localStorage.setItem('userNickName',this.currentUserNickName);
          localStorage.setItem("isFirstLogin","firstLogin") */
        }
      })
    );
  }

  logout() {
    this._isAuthenticated = false;
    localStorage.removeItem("token");
    this.router.navigateByUrl("/auth");
  }
}
