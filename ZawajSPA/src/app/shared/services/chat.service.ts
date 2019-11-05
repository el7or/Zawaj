import { ChatCount } from './../models/chat-count';
import { Injectable, EventEmitter } from "@angular/core";
import { environment } from "../../../environments/environment";
import { HttpClient } from "@angular/common/http";
import { map } from "rxjs/operators";
import { ChatUser } from "../models/chat-user";
import { ChatAdd } from "../models/chat-add";
import {
  HubConnection,
  HubConnectionBuilder,
  HttpTransportType
} from "@aspnet/signalr";

@Injectable({
  providedIn: "root"
})
export class ChatService {
  baseUrl = environment.API_URL + "chat/";
  private _hubConnection: HubConnection;
  messageReceived = new EventEmitter<ChatAdd>();
  unReadCount = new EventEmitter<ChatCount>();
  connectionEstablished = new EventEmitter<Boolean>();
  connectionIsEstablished = false;

  constructor(private http: HttpClient) {
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
            picture: item.photoURL || "assets/images/avatar.png"
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

  private createConnection() {
    this._hubConnection = new HubConnectionBuilder()
      .withUrl("http://localhost:5000/ChatHub", {
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
  private registerOnServerEvents(): void {
    this._hubConnection.on("MessageReceived", (data: any) => {
      this.messageReceived.emit(data);
    });
    this._hubConnection.on("UpdateUnreadCount", (data: any) => {
      this.unReadCount.emit(data);
    });
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
