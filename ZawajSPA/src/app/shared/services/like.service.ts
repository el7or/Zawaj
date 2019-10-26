import { LikeUser } from './../models/like-user';
import { Injectable } from '@angular/core';
import { environment } from '../../../environments/environment';
import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { LikeList } from '../models/like-list';

@Injectable({
  providedIn: 'root'
})
export class LikeService {
  baseUrl = environment.API_URL + "likes/";

  constructor(private http: HttpClient) {}

  getLikes(id:string, isLikesFrom:boolean){
    let params = new HttpParams();
    if (id != null && isLikesFrom != null) {
      params = params.append("id", id);
      params = params.append("isLikesFrom", isLikesFrom.toString());
    }
    return this.http.get<LikeList[]>(this.baseUrl,{params});
  }

  postLike(like: LikeUser) {
    return this.http.post<LikeUser>(this.baseUrl , like);
  }

  deleteLike(like: LikeUser) {
    const DeleteOptions = {
      headers: new HttpHeaders({
        'Content-Type': 'application/json'
      }),
      body: {
        likeFromUserId: like.likeFromUserId,
        likeToUserId: like.likeToUserId
      }
    }
    return this.http.delete<LikeUser>(this.baseUrl , DeleteOptions);
  }
}
