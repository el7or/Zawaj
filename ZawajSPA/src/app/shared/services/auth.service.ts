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
  apiURL = environment.API_URL;
  jwtHelper = new JwtHelperService();
  currentUserName:string;

  constructor(private http:HttpClient) { }

  login(user:UserLogin){
    return this.http.post(this.apiURL+'/auth/login/',user).pipe(
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
    return this.http.post(this.apiURL+'/auth/register/',user).pipe(
      map((res:any)=>{
        if(res){
          localStorage.setItem('token',res.token);
          //localStorage.setItem('user',JSON.stringify(res.user));
          this.currentUserName=this.jwtHelper.decodeToken(res.token).sub;
        }
      })
    );
  }

  isLoggedIn() {    
    try{const token = localStorage.getItem('token');
    return !this.jwtHelper.isTokenExpired(token);}
    catch{
      return false
    }
  }

  reloadMenuItems(menuItems:NbMenuItem[]){
    if(!this.isLoggedIn()){
      return menuItems.filter((el:NbMenuItem)=>el.data!='user')
    }
    else{return menuItems}
  }

  /* getAllUsers(): Observable<User[]> {
    return this.http
      .get<User[]>("https://jsonplaceholder.typicode.com/users")
      .pipe(
        map(data =>
          data.map(item => {
            return <User>{
              id: item.id,
              name: item.name,
              email: item.email,
              username: item.username,
            };
          })
        )
      );
  } */
}
