import { Component } from '@angular/core';

import { Platform } from '@ionic/angular';
import { SplashScreen } from '@ionic-native/splash-screen/ngx';
import { StatusBar } from '@ionic-native/status-bar/ngx';

@Component({
  selector: 'app-root',
  templateUrl: 'app.component.html',
  styleUrls: ['app.component.scss']
})
export class AppComponent {
  public appPages = [
    {
      title: 'الرئيسية',
      url: '',
      icon: 'home'
    },
    {
      title: 'الإعجابات',
      url: '/likes',
      icon: 'heart'
    },
    {
      title: 'الرسائل',
      url: '/messages',
      icon: 'mail'
    },
    {
      title: 'بحث',
      url: '/members/member-search',
      icon: 'search'
    },
    {
      title: 'تسجيل خروج',
      url: '/auth/logout',
      icon: 'log-out'
    }
  ];

  constructor(
    private platform: Platform,
    private splashScreen: SplashScreen,
    private statusBar: StatusBar
  ) {
    this.initializeApp();
  }

  initializeApp() {
    this.platform.ready().then(() => {
      this.statusBar.styleDefault();
      this.splashScreen.hide();
    });
  }
}
