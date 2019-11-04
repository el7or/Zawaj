import { AuthService } from "./../../shared/services/auth.service";
import { ChatService } from "./../../shared/services/chat.service";
import { BehaviorSubject } from "rxjs";
import { Component, OnInit, AfterViewChecked } from "@angular/core";
import { NbToastrService } from "@nebular/theme";
import { LanggService } from "../../shared/services/langg.service";
import { LanggPipe } from "../../shared/pipes/langg.pipe";

@Component({
  selector: "chat",
  templateUrl: "./chat.component.html",
  styleUrls: ["./chat.component.scss"]
})
export class ChatComponent implements OnInit, AfterViewChecked {
  users: { id: string; name: string; title: string; picture: string }[];
  userChatName: string;
  userChatId: string;
  messages: any[];
  loading=false;

  /* messages = [
    {
      text: "Success!",
      date: new Date(),
      reply: false,
      user: {
        name: "صفوى",
        avatar:
          "https://s3.amazonaws.com/pix.iemoji.com/images/emoji/apple/ios-12/256/robot-face.png"
      }
    }
  ]; */

  constructor(
    private chatService: ChatService,
    private toastrService: NbToastrService,
    private langgService: LanggService,
    private authService: AuthService
  ) {}

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
    document.querySelector("p.no-messages").innerHTML = new LanggPipe(
      this.langgService
    ).transform("No messages yet.");
  }

  openChat(user) {
    this.loading=true;
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
