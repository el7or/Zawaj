import { Router } from '@angular/router';
import { Component, OnInit } from "@angular/core";
import { Plugins } from "@capacitor/core";
const { LocalNotifications } = Plugins;

@Component({
  selector: "app-messages",
  templateUrl: "./messages.page.html",
  styleUrls: ["./messages.page.scss"]
})
export class MessagesPage implements OnInit {
  constructor(private router: Router) {
    LocalNotifications.addListener('localNotificationActionPerformed' ,()=>{
      this.router.navigateByUrl('/likes');
    })
  }

  ngOnInit() {
    LocalNotifications.schedule({
      notifications: [
        {
          title: "لديك رسالة جديدة من أحد الأعضاء!",
          body: "السلام عليكم.. هل تقبلين زواج التعدد؟",
          id: 1,
          schedule: { at: new Date(Date.now() + 1000) },
          sound: 'beep.aiff',
          attachments: null,
          actionTypeId: "",
          extra: null,
          smallIcon: 'ic_notifications'
          //icon: 'ic_notifications'
        }
      ]
    });
  }
}
