import { UserDetails } from './../models/user-details';
import { UserList } from './../models/user-list';
import { HttpClient } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { environment } from "../../../environments/environment";
import { Observable } from 'rxjs';

@Injectable({
  providedIn: "root"
})
export class UserService {
  baseUrl = environment.API_URL + "users/";

  constructor(private http: HttpClient) {}

  getAllUsers(): Observable<UserList[]> {
    return this.http.get<UserList[]>(this.baseUrl);
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

  getUserById(id: string): Observable<UserDetails> {
    return this.http.get<UserDetails>(this.baseUrl + id);
  }
}
