import { AuthService } from "./../../shared/services/auth.service";
import { ChatService } from "./../../shared/services/chat.service";
import { Location } from "@angular/common";
import {
  Component,
  OnInit,
  AfterViewChecked,
  ChangeDetectorRef
} from "@angular/core";
import { NbToastrService } from "@nebular/theme";
import { LanggService } from "../../shared/services/langg.service";
import { LanggPipe } from "../../shared/pipes/langg.pipe";
import { ChatAdd } from "../../shared/models/chat-add";
import { ActivatedRoute } from "@angular/router";

@Component({
  selector: "chat",
  templateUrl: "./chat.component.html",
  styleUrls: ["./chat.component.scss"]
})
export class ChatComponent implements OnInit, AfterViewChecked {
  users: {
    id: string;
    name: string;
    title: string;
    picture: string;
    unread: number;
  }[];
  userChatName: string;
  userChatId: string;
  messages: any[];
  loading = false;

  constructor(
    private chatService: ChatService,
    private toastrService: NbToastrService,
    private langgService: LanggService,
    private authService: AuthService,
    private route: ActivatedRoute,
    private location: Location,
    private cdr: ChangeDetectorRef
  ) {
    this.chatService.messageReceived.subscribe((message: ChatAdd) => {
      if (
        message.receiverId == authService.currentUserId &&
        message.senderId == this.userChatId
      ) {
        const sender = this.users.filter(u => u.id == message.senderId);
        this.messages.push({
          text: message.content,
          date: new Date(),
          reply: false,
          user: {
            name: sender[0].name,
            avatar: sender[0].picture
          }
        });
      }
    });
  }

  ngOnInit() {
    this.chatService.getChatUsers().subscribe(
      res => {
        this.users = res;
        this.route.queryParams.subscribe(params => {
          const userId = params["id"];
          if (userId != null) {
            this.users.unshift(
              this.users.splice(
                this.users.findIndex(item => item.id === userId), 1)[0]
            );
            this.location.replaceState("pages/" + "chat");
            const chatUser = this.users.filter(u => u.id == userId);
            this.openChat(chatUser[0]);
          } else {
            this.openChat(res[0]);
          }
        });
      },
      error => {
        console.error(error);
        this.toastrService.warning(
          new LanggPipe(this.langgService).transform(
            "Please refresh page and try again."
          ),
          new LanggPipe(this.langgService).transform("Something Wrong!"),
          { duration: 3000 }
        );
      }
    );
  }

  ngAfterViewChecked() {
    const noMessageText = document.querySelector("p.no-messages");
    if (noMessageText != null)
      noMessageText.innerHTML = new LanggPipe(this.langgService).transform(
        "No messages yet."
      );
    const typeMessagePlacholder = <HTMLInputElement>(
      document.querySelector("div.message-row input.with-button")
    );
    if (typeMessagePlacholder != null)
      typeMessagePlacholder.placeholder = new LanggPipe(
        this.langgService
      ).transform("Type a message");
    this.cdr.detectChanges();
  }

  openChat(user) {
    this.loading = true;
    this.messages = [];
    this.userChatName = user.name;
    this.userChatId = user.id;
    this.chatService.getChatList(user.id).subscribe(
      (response: any) => {
        const chatUser = this.users.filter(u => u.id == user.id);
        chatUser[0].unread = null;
        response.forEach(res => {
          this.messages.push({
            text: res.content,
            date: new Date(res.sentOn),
            reply: res.isReplay,
            user: {
              name: res.isReplay
                ? this.authService.currentUserNickName
                : user.name,
              avatar: res.isReplay
                ? this.authService.currentUserPhoto
                : user.picture
            }
          });
        });
        this.loading = false;
      },
      error => {
        console.error(error);
        this.toastrService.warning(
          new LanggPipe(this.langgService).transform(
            "Please refresh page and try again."
          ),
          new LanggPipe(this.langgService).transform("Something Wrong!"),
          { duration: 3000 }
        );
      },
      () => this.chatService.updateUnreadCount(this.authService.currentUserId)
    );
  }

  sendMessage(event: any) {
    this.chatService
      .postNewMessage({
        senderId: this.authService.currentUserId,
        receiverId: this.userChatId,
        content: event.message
      })
      .subscribe(
        () => {
          this.chatService.updateUnreadCount(this.userChatId);
          this.messages.push({
            text: event.message,
            date: new Date(),
            reply: true,
            user: {
              name: this.authService.currentUserNickName,
              avatar: this.authService.currentUserPhoto
            }
          });
        },
        error => {
          console.error(error);
          this.toastrService.warning(
            new LanggPipe(this.langgService).transform(
              "Please refresh page and try again."
            ),
            new LanggPipe(this.langgService).transform("Something Wrong!"),
            { duration: 3000 }
          );
        }
      );
  }
}
