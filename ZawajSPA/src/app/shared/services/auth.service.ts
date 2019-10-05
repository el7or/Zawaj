import { UserRegister } from '../models/user-register';
import { environment } from './../../../environments/environment';
import { Injectable } from '@angular/core';
import { UserLogin } from '../models/user-login';
import { HttpClient } from '@angular/common/http';
import { JwtHelperService } from '@auth0/angular-jwt';
import { map } from 'rxjs/operators';
import { NbMenuItem } from '@nebular/theme';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  baseUrl = environment.API_URL+'auth/';
  jwtHelper = new JwtHelperService();
  currentUserName:string;
  redirectUrl:string;

  constructor(private http:HttpClient) { }

  login(user:UserLogin){
    return this.http.post(this.baseUrl+'login/',user).pipe(
      map((res:any)=>{
        if(res){
          localStorage.setItem('token',res.token);
          //localStorage.setItem('user',JSON.stringify(res.user));
          this.currentUserName=this.jwtHelper.decodeToken(res.token).sub;
        }
      })
    );
  }

  register(user:UserRegister){
    return this.http.post(this.baseUrl+'register/',user).pipe(
      map((res:any)=>{
        if(res){
          localStorage.setItem('token',res.token);
          //localStorage.setItem('user',JSON.stringify(res.user));
          this.currentUserName=this.jwtHelper.decodeToken(res.token).sub;
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
