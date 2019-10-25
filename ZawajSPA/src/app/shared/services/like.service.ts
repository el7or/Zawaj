import { LikeUser } from './../models/like-user';
import { Injectable } from '@angular/core';
import { environment } from '../../../environments/environment';
import { HttpClient, HttpHeaders } from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class LikeService {
  baseUrl = environment.API_URL + "likes/";

  constructor(private http: HttpClient) {}

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
