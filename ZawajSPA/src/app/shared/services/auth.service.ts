import { environment } from './../../../environments/environment';
import { Injectable } from '@angular/core';
import { UserLogin } from '../models/user-login';
import { HttpClient } from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  apiURL = environment.API_URL;
  constructor(private http:HttpClient) { }

  login(user:UserLogin){
    return this.http.post(this.apiURL+'/auth/login/',user);
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
