import { AuthService } from './../../shared/services/auth.service';
import { ChatService } from "./../../shared/services/chat.service";
import { BehaviorSubject } from "rxjs";
import { Component, OnInit } from "@angular/core";
import { NbToastrService } from "@nebular/theme";
import { LanggService } from "../../shared/services/langg.service";
import { LanggPipe } from "../../shared/pipes/langg.pipe";

@Component({
  selector: "chat",
  templateUrl: "./chat.component.html",
  styleUrls: ["./chat.component.scss"]
})
export class ChatComponent implements OnInit {
  users: { id: string; name: string; title: string; picture: string }[];
  userChat: string;
  messages = [
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
  ];

  constructor(
    private chatService: ChatService,
    private toastrService: NbToastrService,
    private langgService: LanggService,
    private authService:AuthService
  ) {}

  ngOnInit() {
    this.chatService.getChatUsers().subscribe(
      res => {
        this.users = res;
        this.userChat = res[0].name;
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

  openChat(user) {
    this.userChat = user.name;
  }

  sendMessage(event: any) {
    this.messages.push({
      text: event.message,
      date: new Date(),
      reply: true,
      user: {
        name: this.authService.currentUserNickName,
        avatar: this.authService.currentUserPhoto
      }
    });
    /* const botReply = this.chatShowcaseService.reply(event.message);
    if (botReply) {
      setTimeout(() => { this.messages.push(botReply) }, 500);
    } */
  }
}
