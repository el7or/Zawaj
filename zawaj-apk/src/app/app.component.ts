import { Component } from '@angular/core';

import { Platform } from '@ionic/angular';
import { SplashScreen } from '@ionic-native/splash-screen/ngx';
import { StatusBar } from '@ionic-native/status-bar/ngx';
import { AuthService } from './auth/auth.service';

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
      icon: 'heart-empty'
    },
    {
      title: 'الرسائل',
      url: '/messages',
      icon: 'mail'
    },
    {
      title: 'بحث',
      url: '/members/search',
      icon: 'search'
    }/* ,
    {
      title: 'تسجيل خروج',
      url: '/auth/logout',
      icon: 'exit'
    } */
  ];

  constructor(
    private platform: Platform,
    private splashScreen: SplashScreen,
    private statusBar: StatusBar,
    public authService:AuthService
  ) {
    this.initializeApp();
  }

  initializeApp() {
    this.platform.ready().then(() => {
      this.statusBar.styleDefault();
      this.splashScreen.hide();
    });
  }

  onLogout(){
this.authService.logout();
  }
}
