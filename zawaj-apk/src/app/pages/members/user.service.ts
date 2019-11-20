import { HttpClient, HttpParams } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { Observable } from "rxjs";

import { environment } from "../../../environments/environment";
import { UserPagedList } from "./members.model";
import { UserDetails } from './member-details/member-details.model';
/* import { UserUpdate } from "./../models/user-update";
import { UserDetails } from "./../models/user-details"; */

@Injectable({
  providedIn: "root"
})
export class UserService {
  baseUrl = environment.API_URL + "users/";

  constructor(private http: HttpClient) {}

  getAllUsers(pageNumber?, pageSize?): Observable<UserPagedList> {    
    let params = new HttpParams();
    if (pageNumber != null && pageSize != null) {
      params = params.append("pageNumber", pageNumber);
      params = params.append("pageSize", pageSize);
    }
    return this.http.get<UserPagedList>(this.baseUrl, { params });
  }

  searchUsers(
    searchParams?,
    pageNumber?,
    pageSize?
  ): Observable<UserPagedList> {
    let params = new HttpParams();
    if (pageNumber != null && pageSize != null) {
      params = params.append("pageNumber", pageNumber);
      params = params.append("pageSize", pageSize);
    }
    if (searchParams != null) {
      params = params.append("minAge", searchParams.minAge);
      params = params.append("maxAge", searchParams.maxAge);
      params = params.append("gender", searchParams.gender);
      params = params.append("orderBy", searchParams.orderBy);
      if (searchParams.name != null) {
        params = params.append("name", searchParams.name);
      }
    }
    return this.http.get<UserPagedList>(this.baseUrl + "search", { params });
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

  /* putUser(id: string, user: UserUpdate) {
    return this.http.put<UserUpdate>(this.baseUrl + id, user);
  } */
}
