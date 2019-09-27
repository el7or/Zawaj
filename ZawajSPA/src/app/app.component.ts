/**
 * @license
 * Copyright Akveo. All Rights Reserved.
 * Licensed under the MIT License. See License.txt in the project root for license information.
 */
import {
  Component,
  OnInit,
  AfterViewChecked,
  OnDestroy} from "@angular/core";
import { MENU_ITEMS } from "./pages/pages-menu";
import { Subscription } from "rxjs";
// @ts-ignore
import * as words from "../assets/locale/translation.json";
import { LanggService } from "./shared/services/langg.service";

@Component({
  selector: "ngx-app",
  template: "<router-outlet></router-outlet>"
})
export class AppComponent implements OnInit, AfterViewChecked, OnDestroy {
  menu = MENU_ITEMS;
  menuTitles: any;
  _words = [];
  langgSubscription: Subscription;

  constructor(private langgService: LanggService) {}

  ngOnInit() {
    this._words = words.default;
    //this.menuTitles = document.querySelectorAll('.menu-title');
  }

  ngAfterViewChecked() {
    this.menuTitles = document.querySelectorAll('.menu-title, .swal2-title, #swal2-content');
    let menuTitlesArray = Array.prototype.slice.call(this.menuTitles);
    menuTitlesArray.forEach(element => {
      this.langgSubscription = this.langgService.lang.subscribe(
        (lang: string) => {
          try {
            let words = this._words.filter(o =>
              Object.keys(o).some(k => o[k] ==element.innerText)
            );
            element.innerText = words[0][lang];
          } catch {}
        }
      );
    });
  }

  ngOnDestroy() {
    this.langgSubscription.unsubscribe();
  }
}
