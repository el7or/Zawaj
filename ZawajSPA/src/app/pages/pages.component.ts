import { LanggService } from "./../shared/services/langg.service";
import { Component, OnInit, AfterViewInit, Renderer2, OnDestroy } from "@angular/core";
// @ts-ignore
import * as words from "../../assets/locale/translation.json";
import { MENU_ITEMS } from "./pages-menu";
import { Subscription } from 'rxjs';

@Component({
  selector: "ngx-pages",
  styleUrls: ["pages.component.scss"],
  template: `
    <ngx-one-column-layout>
      <nb-menu [items]="menu"></nb-menu>
      <router-outlet></router-outlet>
    </ngx-one-column-layout>
  `
})
export class PagesComponent implements OnInit, AfterViewInit, OnDestroy {
  menu = MENU_ITEMS;
  menuTitles: any;
  _words = [];
  langgSubscription: Subscription

  constructor(private render: Renderer2, private langgService: LanggService) {}

  ngOnInit() {
    this._words = words.default;
    this.menuTitles = document.getElementsByClassName("menu-title");
  }

  ngAfterViewInit() {
    let menuTitlesArray = Array.prototype.slice.call(this.menuTitles);
    menuTitlesArray.forEach(element => {
      this.langgSubscription = this.langgService.lang.subscribe((lang:string) => {
        console.log(lang);
        if(lang == 'en'){
          try{
              var word = this._words.filter(word=>word['ar'].match(element.innerText));
              if(word[0]['ar']==element.innerText)
              element.innerText = word[0]['en'];
          }catch{}
        }

        if(lang == 'ar'){
          try{
              var word = this._words.filter(word=>word['en'].match(element.innerText));
              if(word[0]['en']==element.innerText)
              element.innerText = word[0]['ar'];
          }catch{}
        }
      });
    });
  }

  ngOnDestroy(){
    this.langgSubscription.unsubscribe();
  }
}
