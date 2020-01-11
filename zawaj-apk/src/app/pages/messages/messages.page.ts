import { ChatUser } from './messages.model';
import { AlertController } from '@ionic/angular';
import { MessagesService } from "./messages.service";
import { Router, ActivatedRoute, NavigationExtras } from "@angular/router";
import { Component, OnInit } from "@angular/core";
import { Plugins } from "@capacitor/core";
const { LocalNotifications } = Plugins;

@Component({
  selector: "app-messages",
  templateUrl: "./messages.page.html",
  styleUrls: ["./messages.page.scss"]
})
export class MessagesPage implements OnInit {
  users: ChatUser[];
  constructor(
    private router: Router,
    private chatService: MessagesService,
    private alertCtrl:AlertController
  ) {
    LocalNotifications.addListener("localNotificationActionPerformed", () => {
      console.log("notification Performed");
      this.router.navigateByUrl("/likes");
    });
    LocalNotifications.addListener("localNotificationReceived", () => {
      console.log("notification Received");
    });
  }

  ngOnInit() {
    this.chatService.getChatUsers().subscribe(
      res => {
        this.users = res;
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

    /* LocalNotifications.schedule({
      notifications: [
        {
          title: "لديك رسالة جديدة من أحد الأعضاء!",
          body: "السلام عليكم.. هل تقبلين زواج التعدد؟",
          id: 1,
          schedule: { at: new Date(Date.now() + 1000 * 10) },
          sound: "beep.aiff",
          attachments: null,
          actionTypeId: "",
          extra: null,
          smallIcon: "ic_notifications"
          //icon: 'ic_notifications'
        }
      ]
    }); */
  }

  onOpenChat(user:ChatUser){
    let navigationExtras: NavigationExtras = {
      queryParams: {
          "user": JSON.stringify(user)
      }
    };  
    this.router.navigate(["messages/chat"],  navigationExtras);
  }
}
