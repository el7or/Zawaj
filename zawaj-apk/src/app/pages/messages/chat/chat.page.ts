import { AlertController } from "@ionic/angular";
import { AuthService } from "./../../../auth/auth.service";
import { MessagesService } from "./../messages.service";
import { Component } from "@angular/core";
import { ActivatedRoute } from "@angular/router";

import { ChatUser, ChatAdd } from "./../messages.model";

@Component({
  selector: "app-chat",
  templateUrl: "./chat.page.html",
  styleUrls: ["./chat.page.scss"]
})
export class ChatPage {
  user: ChatUser;
  messages: any[] = [];
  isLoading = false;

  constructor(
    private route: ActivatedRoute,
    private chatService: MessagesService,
    private authService: AuthService,
    private alertCtrl: AlertController
  ) {
    this.chatService.messageReceived.subscribe((message: ChatAdd) => {
      if (
        message.receiverId == this.authService.currentUserId &&
        message.senderId == this.user.id
      ) {
        this.messages.push({
          text: message.content,
          date: new Date(),
          reply: false,
          user: {
            name: this.user.name,
            avatar: this.user.picture
          }
        });
      }
    },error =>{
      console.error(error);
          this.alertCtrl
            .create({
              header: "حدث خطأ ما !",
              message:
                '<ion-icon name="warning"></ion-icon> الرجاء التأكد من اتصال الإنترنت وإعادة المحاولة <ion-icon name="warning"></ion-icon>',
              cssClass: "danger",
              buttons: ["حسنا"]
            })
            .then(alertEl => alertEl.present());
    });
  }

  ionViewWillEnter() {
    this.isLoading = true;
    this.route.queryParams.subscribe(params => {
      this.user = JSON.parse(params["user"]);
      this.chatService.getChatList(this.user.id).subscribe(
        (response: any) => {
          this.user.unread = null;
          response.forEach(res => {
            this.messages.push({
              text: res.content,
              date: new Date(res.sentOn),
              reply: res.isReplay,
              user: {
                name: res.isReplay
                  ? this.authService.currentUserNickName
                  : this.user.name,
                avatar: res.isReplay
                  ? this.authService.currentUserPhoto
                  : this.user.picture
              }
            });
          });
          this.isLoading = false;
        },
        error => {
          console.error(error);
          this.alertCtrl
            .create({
              header: "حدث خطأ ما !",
              message:
                '<ion-icon name="warning"></ion-icon> الرجاء التأكد من اتصال الإنترنت وإعادة المحاولة <ion-icon name="warning"></ion-icon>',
              cssClass: "danger",
              buttons: ["حسنا"]
            })
            .then(alertEl => alertEl.present());
          this.isLoading = false;
        },
        () => {
          this.chatService.updateUnreadCount(this.authService.currentUserId);
          this.isLoading = false;
        }
      );
    });
  }

  ionViewDidEnter() {
    const noMessageText = document.querySelector("p.no-messages");
    if (noMessageText != null) noMessageText.innerHTML = "لا توجد رسائل بعد.";
    const typeMessagePlacholder = <HTMLInputElement>(
      document.querySelector("div.message-row input.with-button")
    );
    if (typeMessagePlacholder != null)
      typeMessagePlacholder.placeholder = "اكتب رسالة ...";
  }

  sendMessage(event: any) {
    this.chatService
      .postNewMessage({
        senderId: this.authService.currentUserId,
        receiverId: this.user.id,
        content: event.message
      })
      .subscribe(
        () => {
          this.chatService.updateUnreadCount(this.user.id);
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
          this.alertCtrl
            .create({
              header: "حدث خطأ ما !",
              message:
                '<ion-icon name="warning"></ion-icon> الرجاء التأكد من اتصال الإنترنت وإعادة المحاولة <ion-icon name="warning"></ion-icon>',
              cssClass: "danger",
              buttons: ["حسنا"]
            })
            .then(alertEl => alertEl.present());
        }
      );
  }
}
