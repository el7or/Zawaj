import { UserService } from "./pages/members/user.service";
import { ChatCount, ChatAdd } from "./pages/messages/messages.model";
import { MessagesService } from "./pages/messages/messages.service";
import { Location } from "@angular/common";
import { Router } from "@angular/router";
import { Component, ViewChildren, QueryList, OnInit } from "@angular/core";
import {
  Platform,
  IonRouterOutlet,
  AlertController,
  Events
} from "@ionic/angular";
import {
  Plugins,
  Capacitor,
  PushNotification,
  PushNotificationToken,
  PushNotificationActionPerformed,
} from "@capacitor/core";

import { AuthService } from "./auth/auth.service";
import { UserDetails } from "./pages/members/member-details/member-details.model";

@Component({
  selector: "app-root",
  templateUrl: "app.component.html",
  styleUrls: ["app.component.scss"]
})
export class AppComponent {
  public appPages = [
    {
      title: "الرئيسية",
      url: "",
      icon: "home"
    },
    {
      title: "الإعجابات",
      url: "/likes",
      icon: "heart-empty"
    },
    {
      title: "الرسائل",
      url: "/messages",
      icon: "mail"
    },
    {
      title: "بحث",
      url: "/members/search",
      icon: "search"
    }
  ];
  @ViewChildren(IonRouterOutlet) routerOutlets: QueryList<IonRouterOutlet>;
  newMessages: number;

  constructor(
    private platform: Platform,
    public authService: AuthService,
    private chatService: MessagesService,
    private userService: UserService,
    private alertController: AlertController,
    private router: Router,
    private location: Location,
    public events: Events
  ) {
    this.initializeApp();
    this.backButtonEvent();
    this.events.subscribe("user:messages", msgs => {
      this.newMessages = msgs;
    });
    this.manageLocalNotifications();
  }

  initializeApp() {
    this.platform.ready().then(() => {
      if (Capacitor.isPluginAvailable("SplashScreen")) {
        Plugins.SplashScreen.hide();
      }
    });
    this.chatService.unReadCount.subscribe((countData: ChatCount) => {
      if (countData.id == this.authService.currentUserId) {
        this.newMessages = countData.count;
      }
    });
    if (this.authService.isAuthenticated) {
      this.chatService.getUnreadCount().subscribe(
        (res: number) => {
          this.newMessages = res;
        },
        err => console.error(err)
      );
    }
  }

/*   ngOnInit() {
    console.log('Initializing HomePage');

    // Register with Apple / Google to receive push via APNS/FCM
    Plugins.PushNotifications.register();

    // On success, we should be able to receive notifications
    Plugins.PushNotifications.addListener('registration', 
      (token: PushNotificationToken) => {
        // --> Save this token in database in user table:
        console.log('Push registration success, token: ' + token.value);
      }
    );

    // Some issue with our setup and push will not work
    Plugins.PushNotifications.addListener('registrationError', 
      (error: any) => {
        console.log('Error on registration: ' + JSON.stringify(error));
      }
    );

    // Show us the notification payload if the app is open on our device
    Plugins.PushNotifications.addListener('pushNotificationReceived',
      (notification: PushNotification) => {
        console.log('Push received: ' + JSON.stringify(notification));
      }
    );

    // Method called when tapping on a notification
    Plugins.PushNotifications.addListener('pushNotificationActionPerformed', 
      (notification: PushNotificationActionPerformed) => {
        console.log('Push action performed: ' + JSON.stringify(notification));
        this.router.navigateByUrl("/messages");
      }
    );
} */

  manageLocalNotifications() {
    this.chatService.messageReceived.subscribe(
      (message: ChatAdd) => {
        let user: UserDetails;
        this.userService.getUserById(message.senderId).subscribe(res => {
          user = res;
          if (
            message.receiverId == this.authService.currentUserId &&
            message.senderId == user.id
          ) {
            Plugins.LocalNotifications.schedule({
              notifications: [
                {
                  title: "رسالة جديدة من " + user.nickName + ":",
                  body: message.content,
                  id: 1,
                  schedule: { at: new Date(Date.now() + 1000 * 1) },
                  sound: "beep.aiff",
                  attachments: null,
                  actionTypeId: "",
                  extra: null,
                  smallIcon: "ic_notifications"
                  //icon: 'ic_notifications'
                }
              ]
            });
          }
        });
      },
      error => {
        console.error(error);
        this.alertController
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
    Plugins.LocalNotifications.addListener(
      "localNotificationActionPerformed",
      () => {
        this.router.navigateByUrl("/messages");
      }
    );
    /* Plugins.LocalNotifications.addListener("localNotificationReceived", () => {
      console.log("notification Received");
    }); */
  }

  async presentAlertConfirm() {
    const alert = await this.alertController.create({
      //header: 'Confirm!',
      message: "هل تريد الخروج من التطبيق؟",
      buttons: [
        {
          text: "خروج",
          handler: () => {
            navigator["app"].exitApp();
          }
        },
        {
          text: "إلغاء",
          role: "cancel",
          cssClass: "secondary",
          handler: blah => {}
        }
      ]
    });
    await alert.present();
  }

  backButtonEvent() {
    document.addEventListener("backbutton", () => {
      this.routerOutlets.forEach(async (outlet: IonRouterOutlet) => {
        if (
          this.router.url == "/" ||
          this.router.url == "" ||
          this.router.url == "members" ||
          this.router.url == "/members"
        ) {
          this.presentAlertConfirm();
        } else {
          await this.location.back();
          //outlet.pop();
        }
      });
    });
  }

  onLogout() {
    this.authService.logout();
  }
}
