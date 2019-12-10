import { Location } from '@angular/common';
import { Router } from "@angular/router";
import { Component, ViewChildren, QueryList } from "@angular/core";
import { Platform, IonRouterOutlet, AlertController } from "@ionic/angular";
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

  constructor(
    private platform: Platform,
    public authService: AuthService,
    private alertController: AlertController,
    private router: Router,
    private location:Location
  ) {
    this.initializeApp();
    this.backButtonEvent();
  }

  initializeApp() {
    this.platform.ready().then(() => {
      if (Capacitor.isPluginAvailable("SplashScreen")) {
        Plugins.SplashScreen.hide();
      }
    });
  }

  backButtonEvent() {
    document.addEventListener("backbutton", () => {
      this.routerOutlets.forEach(async (outlet: IonRouterOutlet) => {
        if (this.router.url == '/' || this.router.url =='' || this.router.url == 'members' || this.router.url =='/members') {
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
