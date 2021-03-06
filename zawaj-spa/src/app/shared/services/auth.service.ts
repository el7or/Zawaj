import { UserDetails } from './../models/user-details';
import { UserRegister } from '../models/user-register';
import { environment } from './../../../environments/environment';
import { Injectable } from '@angular/core';
import { UserLogin } from '../models/user-login';
import { HttpClient } from '@angular/common/http';
import { JwtHelperService } from '@auth0/angular-jwt';
import { map } from 'rxjs/operators';
import { NbMenuItem } from '@nebular/theme';
import { BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  baseUrl = environment.API_URL+'auth/';
  jwtHelper = new JwtHelperService();
  currentUserId:string;
  currentUserName:string;
  currentUserPhoto:string;
  currentUserNickName:string;
  
 
  redirectUrl:string;

  constructor(private http:HttpClient) { }
  login(user:UserLogin){
    return this.http.post(this.baseUrl+'login/',user).pipe(
      map((res:any)=>{
        if(res){
          localStorage.setItem('token',res.token);
          let decodedToken = this.jwtHelper.decodeToken(res.token);
          this.currentUserName=decodedToken.sub;
          this.currentUserId=decodedToken.jti;
          this.currentUserPhoto = res.userPhotoURL==null? (res.userGender=='رجل'? 'assets/images/avatar.png':'assets/images/avatar-female.png'):res.userPhotoURL;
          this.currentUserNickName = res.userNickName;
          localStorage.setItem('userPhoto',this.currentUserPhoto);
          localStorage.setItem('userNickName',this.currentUserNickName);
        }
      })
    );
  }

  register(user:UserRegister){
    return this.http.post(this.baseUrl+'register/',user).pipe(
      map((res:any)=>{
        if(res){
          localStorage.setItem('token',res.token);
          let decodedToken = this.jwtHelper.decodeToken(res.token);
          this.currentUserName=decodedToken.sub;
          this.currentUserId=decodedToken.jti;
          this.currentUserPhoto = res.userPhotoURL==null? (res.userGender=='رجل'? 'assets/images/avatar.png':'assets/images/avatar-female.png'):res.userPhotoURL;
          this.currentUserNickName = res.userNickName;
          localStorage.setItem('userPhoto',this.currentUserPhoto);
          localStorage.setItem('userNickName',this.currentUserNickName);
          localStorage.setItem("isFirstLogin","firstLogin")
        }
      })
    );
  }

  isAuthenticated() {    
    try{const token = localStorage.getItem('token');
    return !this.jwtHelper.isTokenExpired(token);}
    catch{
      return false
    }
  }

  reloadMenuItems(menuItems:NbMenuItem[]){
    if(!this.isAuthenticated()){
      return menuItems.filter((el:NbMenuItem)=>el.data!='user')
    }
    else{return menuItems}
  }
}
