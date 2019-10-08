import { AuthService } from "./shared/services/auth.service";
/**
 * @license
 * Copyright Akveo. All Rights Reserved.
 * Licensed under the MIT License. See License.txt in the project root for license information.
 */
import { Component, OnInit, AfterViewChecked, OnDestroy } from "@angular/core";
import { Subscription } from "rxjs";
// @ts-ignore
import * as words from "../assets/locale/translation.json";
import { LanggService } from "./shared/services/langg.service";
import { JwtHelperService } from "@auth0/angular-jwt";

@Component({
  selector: "ngx-app",
  template: "<router-outlet></router-outlet>"
})
export class AppComponent implements OnInit, AfterViewChecked, OnDestroy {
  _words = [];
  langgSubscription: Subscription;
  jwtHelper = new JwtHelperService();

  constructor(
    private langgService: LanggService,
    private authService: AuthService
  ) {}

  ngOnInit() {
    this._words = words.default;

    const token = localStorage.getItem("token");
    const user = JSON.parse(localStorage.getItem("user"));
    if (token) {
      this.authService.currentUserName = this.jwtHelper.decodeToken(token).sub;
    }
    /* if (user) {
      this.authService.currentUser = user;
      this.authService.changeMemberPhoto(this.authService.currentUser.photoURL);
    } */
  }

  ngAfterViewChecked() {
    let runTimeElements = document.querySelectorAll(
      ".menu-title, div.message, span.title.subtitle, #swal2-title, #swal2-content, .swal2-confirm, nb-option.ng-star-inserted, span.info, span.tab-text, div.user-name"
    );
    let runTimeElementsArray = Array.prototype.slice.call(runTimeElements);
    let lastElementsArray = this.langgService.elementsArray.value;
    if (lastElementsArray.length != runTimeElementsArray.length) {
      runTimeElementsArray.forEach(element => {
        this.langgSubscription = this.langgService.lang.subscribe(
          (lang: string) => {
            try {
              let words = this._words.filter(o =>
                Object.keys(o).some(
                  k => o[k] == element.innerText || o[k] == element.innerHTML
                )
              );
              element.innerText = words[0][lang];
            } catch {}
          }
        );
      });
      this.langgService.elementsArray.next(runTimeElementsArray);
    }

    let runTimePlacholders = document.querySelectorAll("input.search-input");
    let runTimePlacholdersArray = Array.prototype.slice.call(
      runTimePlacholders
    );
    let lastPlacholdersArray = this.langgService.PlacholdersArray.value;
    if (lastPlacholdersArray.length != runTimePlacholdersArray.length) {
      console.log(runTimePlacholdersArray);
      runTimePlacholdersArray.forEach(element => {
        this.langgSubscription = this.langgService.lang.subscribe(
          (lang: string) => {
            try {
              let words = this._words.filter(o =>
                Object.keys(o).some(k => o[k] == element.placeholder)
              );
              element.placeholder = words[0][lang];
            } catch {}
          }
        );
      });
      this.langgService.PlacholdersArray.next(runTimePlacholdersArray);
    }
  }

  ngOnDestroy() {
    this.langgSubscription.unsubscribe();
  }
}
