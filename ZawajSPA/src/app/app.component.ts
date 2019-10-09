import { AuthService } from "./shared/services/auth.service";
/**
 * @license
 * Copyright Akveo. All Rights Reserved.
 * Licensed under the MIT License. See License.txt in the project root for license information.
 */
import { Component, OnInit, AfterViewChecked } from "@angular/core";
import { Subscription } from "rxjs";
import { LanggService } from "./shared/services/langg.service";
import { JwtHelperService } from "@auth0/angular-jwt";

@Component({
  selector: "ngx-app",
  template: "<router-outlet></router-outlet>"
})
export class AppComponent implements OnInit, AfterViewChecked {
  _words = [];
  langgSubscription: Subscription;
  jwtHelper = new JwtHelperService();

  constructor(
    private langgService: LanggService,
    private authService: AuthService
  ) {}

  ngOnInit() {
    const token = localStorage.getItem("token");
    const user = JSON.parse(localStorage.getItem("user"));
    if (token) {
      this.authService.currentUserName = this.jwtHelper.decodeToken(token).sub;
      this.authService.currentUserId = this.jwtHelper.decodeToken(token).jti;
    }
  }

  ngAfterViewChecked() {
    this.langgService.translateWithoutDerctive();
  }
}
