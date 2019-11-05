import { AuthService } from "./../../shared/services/auth.service";
import { ChatService } from "./../../shared/services/chat.service";
import { Component, OnInit, AfterViewChecked, OnDestroy, ChangeDetectorRef } from "@angular/core";
import { NbToastrService } from "@nebular/theme";
import { LanggService } from "../../shared/services/langg.service";
import { LanggPipe } from "../../shared/pipes/langg.pipe";
import { ChatAdd } from "../../shared/models/chat-add";

@Component({
  selector: "chat",
  templateUrl: "./chat.component.html",
  styleUrls: ["./chat.component.scss"]
})
export class ChatComponent implements OnInit, AfterViewChecked, OnDestroy {
  users: { id: string; name: string; title: string; picture: string }[];
  userChatName: string;
  userChatId: string;
  messages: any[];
  loading = false;

  constructor(
    private chatService: ChatService,
    private toastrService: NbToastrService,
    private langgService: LanggService,
    private authService: AuthService,
    private cdr: ChangeDetectorRef

  ) {
    this.chatService.messageReceived.subscribe((message: ChatAdd) => {
      if (message.receiverId == authService.currentUserId && message.senderId==this.userChatId) {
        const sender = this.users.filter(u=>u.id==message.senderId);
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
        this.userChatName = res[0].name;
        this.userChatId = res[0].id;
        this.openChat(res[0]);
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
      this.cdr.detectChanges();
  }

  ngOnDestroy(){
    this.chatService.stopConnection();
  }

  openChat(user) {
    this.loading = true;
    this.messages = [];
    this.userChatName = user.name;
    this.userChatId = user.id;
    this.chatService.getChatList(user.id).subscribe(
      (response: any) => {
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
      }
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
