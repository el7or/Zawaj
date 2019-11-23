import { map } from "rxjs/operators";
import { Router } from "@angular/router";
import { Injectable } from "@angular/core";
import { HttpClient } from "@angular/common/http";

import { environment } from "src/environments/environment";
import { UserLogin } from './login/user-login';

@Injectable({
  providedIn: "root"
})
export class AuthService {
  private _isAuthenticated: boolean = true;
  baseUrl = environment.API_URL + "auth/";
  /* jwtHelper = new JwtHelperService();
  currentUserId:string;
  currentUserName:string;
  currentUserPhoto:string;
  currentUserNickName:string; */

  redirectUrl: string;

  public get isAuthenticated(): boolean {
    return this._isAuthenticated;
  }

  constructor(private router: Router, private http: HttpClient) {}

  login(user:UserLogin) {
    return this.http.post(this.baseUrl + "login/", user).pipe(
      map((res: any) => {
        if (res) {
          this._isAuthenticated = true;
          /* localStorage.setItem('token',res.token);
          let decodedToken = this.jwtHelper.decodeToken(res.token);
          this.currentUserName=decodedToken.sub;
          this.currentUserId=decodedToken.jti;
          this.currentUserPhoto = res.userPhotoURL==null? (res.userGender=='رجل'? 'assets/images/avatar.png':'assets/images/avatar-female.png'):res.userPhotoURL;
          this.currentUserNickName = res.userNickName;
          localStorage.setItem('userPhoto',this.currentUserPhoto);
          localStorage.setItem('userNickName',this.currentUserNickName); */
        }
      })
    );
  }

  register(user) {
    return this.http.post(this.baseUrl + "register/", user).pipe(
      map((res: any) => {
        if (res) {
          this._isAuthenticated = true;
          /* localStorage.setItem('token',res.token);
          let decodedToken = this.jwtHelper.decodeToken(res.token);
          this.currentUserName=decodedToken.sub;
          this.currentUserId=decodedToken.jti;
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
    this.router.navigateByUrl("/auth");
  }
}
