import { LoadingController } from '@ionic/angular';
import { ChatUser } from './messages.model';
import { AlertController } from '@ionic/angular';
import { MessagesService } from "./messages.service";
import { Router, NavigationExtras } from "@angular/router";
import { Component } from "@angular/core";
import { Plugins } from "@capacitor/core";

@Component({
  selector: "app-messages",
  templateUrl: "./messages.page.html",
  styleUrls: ["./messages.page.scss"]
})
export class MessagesPage {
  users: ChatUser[];
  constructor(
    private router: Router,
    private chatService: MessagesService,
    private loadingCtrl:LoadingController,
    private alertCtrl:AlertController
  ) {
    /* Plugins.LocalNotifications.addListener("localNotificationActionPerformed", () => {
      console.log("notification Performed");
      this.router.navigateByUrl("/likes");
    });
    Plugins.LocalNotifications.addListener("localNotificationReceived", () => {
      console.log("notification Received");
    }); */
  }

  ionViewWillEnter() {
    this.loadingCtrl
    .create({ keyboardClose: true, message: "جاري التحميل ..." })
    .then(loadingEl => {
      this.chatService.getChatUsers().subscribe(
        res => {
          this.users = res;
          this.loadingCtrl.dismiss();
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
            this.loadingCtrl.dismiss();
        }
      );
      loadingEl.present();});

    

      /* Plugins.LocalNotifications.schedule({
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
