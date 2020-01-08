import { Injectable, EventEmitter } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { map } from 'rxjs/operators';
import {
  HubConnection,
  HubConnectionBuilder,
  HttpTransportType
} from "@aspnet/signalr";

import { AuthService } from './../../auth/auth.service';
import { environment } from '../../../environments/environment';
import { ChatUser, ChatAdd, ChatCount } from './messages.model';

@Injectable({
  providedIn: 'root'
})
export class MessagesService {
  baseUrl = environment.API_URL + "chat/";

  constructor(private http: HttpClient, private authService:AuthService) {
    this.createConnection();
    this.registerOnServerEvents();
    this.startConnection();
  }

  getChatUsers() {
    return this.http.get<any[]>(this.baseUrl + "users").pipe(
      map(data =>
        data.map(item => {
          return <ChatUser>{
            id: item.id,
            name: item.nickName,
            title: item.lastActive,
            picture: item.photoURL || "assets/images/avatar.png",
            unread : item.unreadCount
          };
        })
      )
    );
  }

  getChatList(id) {
    return this.http.get(this.baseUrl + id);
  }

  postNewMessage(message: ChatAdd) {
    //this.sendMessage(message);
    return this.http.post<ChatAdd>(this.baseUrl, message);
  }

  getUnreadCount() {
    return this.http.get(this.baseUrl + "count");    
  }

  /********   SignalR   *********/

  
  private _hubConnection: HubConnection;
  messageReceived = new EventEmitter<ChatAdd>();
  unReadCount = new EventEmitter<ChatCount>();
  /* chatUsersList = new EventEmitter<ChatUser[]>(); */
  connectionEstablished = new EventEmitter<Boolean>();
  connectionIsEstablished = false;

  private createConnection() {
    this._hubConnection = new HubConnectionBuilder()
      .withUrl("https://zawag.azurewebsites.net/chatHub", {
        skipNegotiation: true,
        transport: HttpTransportType.WebSockets
      })
      .build();
  }
  private startConnection(): void {
    Object.defineProperty(WebSocket, "OPEN", { value: 1 });
    this._hubConnection
      .start()
      .then(() => {
        this.connectionIsEstablished = true;
        console.log("Hub connection started");
        this.connectionEstablished.emit(true);
      })
      .catch(err => {
        console.log("Error while establishing connection, retrying...");
        setTimeout(function() {
          this.startConnection();
        }, 5000);
      });
  }
  /* sendMessage(message: ChatAdd) {
    this._hubConnection.invoke("NewMessage", message);
  } */
  updateUnreadCount(id:string){
    this._hubConnection.invoke("UpdateUnreadCount", id);    
  }
  /* updateChatUsers(id:string){
    this._hubConnection.invoke("UpdateChatUsers", id);    
  } */
  private registerOnServerEvents(): void {
    this._hubConnection.on("MessageReceived", (data: any) => {
      this.messageReceived.emit(data);
    });
    this._hubConnection.on("UpdateUnreadCount", (data: any) => {
      this.unReadCount.emit(data);
    });
    /* this._hubConnection.on("UpdateChatUsers", (data: any) => {
      this.chatUsersList.emit(data);
    }); */
  }
  stopConnection(): void {
    this._hubConnection
    .stop()
    .then(() => {
      this.connectionIsEstablished = false;
      console.log("Hub connection stoped");
      this.connectionEstablished.emit(false);
    });
  }
}
