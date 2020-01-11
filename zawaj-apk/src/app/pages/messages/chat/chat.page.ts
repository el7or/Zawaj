import { NbThemeService } from '@nebular/theme';
import { Component, OnInit } from "@angular/core";
import { ActivatedRoute, Router } from "@angular/router";

import { ChatUser } from "./../messages.model";

@Component({
  selector: "app-chat",
  templateUrl: "./chat.page.html",
  styleUrls: ["./chat.page.scss"]
})
export class ChatPage {
  user: ChatUser;
  messages: any[];
  isLoading = false;

  constructor(private route: ActivatedRoute,private themeService:NbThemeService) {}

  ionViewWillEnter() {
    this.route.queryParams.subscribe(params => {
      this.user = JSON.parse(params["user"]);
   });
  }

  sendMessage(event: any){    
  }
}
