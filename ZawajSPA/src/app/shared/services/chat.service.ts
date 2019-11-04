import { Injectable } from "@angular/core";
import { BehaviorSubject, Observable } from "rxjs";
import { environment } from "../../../environments/environment";
import { HttpClient } from "@angular/common/http";
import { map } from "rxjs/operators";
import { ChatUser } from "../models/chat-user";

@Injectable({
  providedIn: "root"
})
export class ChatService {
  unreadMessages = new BehaviorSubject<number>(3);
  baseUrl = environment.API_URL + "chat/";

  constructor(private http: HttpClient) {}

  getChatUsers() {
    return this.http.get<any[]>(this.baseUrl + "users").pipe(
      map(data =>
        data.map(item => {
          return <ChatUser>{
            id : item.id,
            name: item.nickName,
            title: item.lastActive,
            picture: item.photoURL || 'assets/images/avatar.png'
          };
        })
      )
    );
  }
}
