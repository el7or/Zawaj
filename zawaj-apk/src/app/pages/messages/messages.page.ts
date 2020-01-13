import { LoadingController } from '@ionic/angular';
import { ChatUser } from './messages.model';
import { AlertController } from '@ionic/angular';
import { MessagesService } from "./messages.service";
import { Router, NavigationExtras } from "@angular/router";
import { Component } from "@angular/core";

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
  ) { }

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
