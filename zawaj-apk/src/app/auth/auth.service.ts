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
  private _currentUserNickName:string;
  private _currentUserPhoto:string;
  private _currentUserName:string;

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
  public get currentUserName(): string {
    try {
      const userName = localStorage.getItem("sub");
      this._currentUserName = userName
      return this._currentUserName;
    } catch {
      return "";
    }
  }
  public get currentUserNickName(): string {
    try {
      const userNickName = localStorage.getItem("userNickName");
      this._currentUserNickName = userNickName
      return this._currentUserNickName;
    } catch {
      return "";
    }
  }
  public get currentUserPhoto(): string {
    try {
      const userPhoto = localStorage.getItem("userPhoto");
      this._currentUserPhoto = userPhoto
      return this._currentUserPhoto;
    } catch {
      return "";
    }
  }
  public set currentUserPhoto(photoUrl:string){
    try {
      localStorage.setItem("userPhoto",photoUrl);
      this._currentUserPhoto = photoUrl
    } catch {
      return;
    }
  }

  constructor(private router: Router, private http: HttpClient) {}

  login(user: UserLogin) {
    return this.http.post(this.baseUrl + "login/", user).pipe(
      map((res: any) => {
        this.loadUserData(res)
      })
    );
  }

  register(user: UserRegister) {
    return this.http.post(this.baseUrl + "register/", user).pipe(
      map((res: any) => {
        this.loadUserData(res)
      })
    );
  }

  loadUserData(res:any){
    if (res) {
      this._isAuthenticated = true;
      localStorage.setItem("token", res.token);
      let decodedToken = this.jwtHelper.decodeToken(res.token);
      localStorage.setItem("jti", decodedToken.jti);
      localStorage.setItem("sub", decodedToken.sub);
      localStorage.setItem('userNickName',res.userNickName);
      localStorage.setItem('userPhoto',res.userPhotoURL==null? (res.userGender=='رجل'? 'assets/images/avatar.png':'assets/images/avatar-female.png'):res.userPhotoURL);
    }
  }

  logout() {
    this._isAuthenticated = false;
    localStorage.removeItem("token");
    this.router.navigateByUrl("/auth");
  }
}
