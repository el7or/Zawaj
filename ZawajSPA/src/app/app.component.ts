import { AuthService } from "./shared/services/auth.service";
/**
 * @license
 * Copyright Akveo. All Rights Reserved.
 * Licensed under the MIT License. See License.txt in the project root for license information.
 */
import { Component, OnInit } from "@angular/core";
import { Subscription } from "rxjs";
import { LanggService } from "./shared/services/langg.service";
import { JwtHelperService } from "@auth0/angular-jwt";

@Component({
  selector: "ngx-app",
  template: "<router-outlet></router-outlet>"
})
export class AppComponent implements OnInit {
  _words = [];
  langgSubscription: Subscription;
  jwtHelper = new JwtHelperService();

  constructor(
    private langgService: LanggService,
    private authService: AuthService
  ) {}

  ngOnInit() {
    const token = localStorage.getItem("token");
    if (token) {
      this.authService.currentUserId = this.jwtHelper.decodeToken(token).jti;  
      this.authService.currentUserName= this.jwtHelper.decodeToken(token).sub;        
    }
    this.authService.currentUserPhoto = localStorage.getItem("userPhoto");
    this.authService.currentUserNickName = localStorage.getItem("userNickName");
    
    this.langgService.language.next(localStorage.getItem("langg"));
  }
}
