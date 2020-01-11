import { ChatCount } from "./pages/messages/messages.model";
import { MessagesService } from "./pages/messages/messages.service";
import { Location } from "@angular/common";
import { Router } from "@angular/router";
import { Component, ViewChildren, QueryList } from "@angular/core";
import {
  Platform,
  IonRouterOutlet,
  AlertController,
  Events
} from "@ionic/angular";
import { Plugins, Capacitor } from "@capacitor/core";

import { AuthService } from "./auth/auth.service";

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
    private alertController: AlertController,
    private router: Router,
    private location: Location,
    public events: Events
  ) {
    this.initializeApp();
    this.backButtonEvent();
    this.events.subscribe("user:messages", msgs => {
      console.log(msgs);
      this.newMessages = msgs;
    });
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

  onLogout() {
    this.authService.logout();
  }
}
