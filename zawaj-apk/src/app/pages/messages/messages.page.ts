import { Component, OnInit } from "@angular/core";
import { Plugins } from "@capacitor/core";
const { LocalNotifications } = Plugins;

@Component({
  selector: "app-messages",
  templateUrl: "./messages.page.html",
  styleUrls: ["./messages.page.scss"]
})
export class MessagesPage implements OnInit {
  constructor() {}

  ngOnInit() {
    LocalNotifications.schedule({
      notifications: [
        {
          title: "Test",
          body: "Testttttttttt Testttttttttt Testttttttttt Testttttttttt Testttttttttt ",
          id: 1,
          schedule: { at: new Date(Date.now() + 1000 * 2) },
          sound: null,
          attachments: null,
          actionTypeId: "",
          extra: null,
          //icon: 'ic_notifications',
          smallIcon: 'ic_notification_small'
        }
      ]
    });
  }
}
