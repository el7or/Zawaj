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
  
 
  redirectUrl:string;

  constructor(private http:HttpClient) { }
  login(user:UserLogin){
    return this.http.post(this.baseUrl+'login/',user).pipe(
      map((res:any)=>{
        if(res){
          localStorage.setItem('token',res.token);
          localStorage.setItem('userPhoto',res.userPhotoURL);
          let decodedToken = this.jwtHelper.decodeToken(res.token);
          this.currentUserName=decodedToken.sub;
          this.currentUserId=decodedToken.jti;
          this.currentUserPhoto = res.userPhotoURL!=null? res.userPhotoURL:'assets/images/avatar.png';
        }
      })
    );
  }

  register(user:UserRegister){
    return this.http.post(this.baseUrl+'register/',user).pipe(
      map((res:any)=>{
        if(res){
          localStorage.setItem('token',res.token);
          localStorage.setItem('userPhoto',res.userPhotoURL);
          let decodedToken = this.jwtHelper.decodeToken(res.token);
          this.currentUserName=decodedToken.sub;
          this.currentUserId=decodedToken.jti;
          this.currentUserPhoto = res.userPhotoURL!=null? res.userPhotoURL:'assets/images/avatar.png';
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
