import { LanggService } from "./../shared/services/langg.service";
import { AuthService } from "./../shared/services/auth.service";
import { Component, AfterViewChecked, ChangeDetectorRef } from "@angular/core";
import { MENU_ITEMS } from "./pages-menu";
import { NbMenuItem } from "@nebular/theme";

@Component({
  selector: "ngx-pages",
  styleUrls: ["pages.component.scss"],
  template: `
    <nb-layout windowMode [nbSpinner]="langgloading" nbSpinnerStatus="danger">
      <nb-layout-header fixed>
        <ngx-header></ngx-header>
      </nb-layout-header>

      <nb-sidebar
        start
        class="menu-sidebar"
        tag="menu-sidebar"
        responsive
        state="compacted"
      >
        <nb-menu [items]="menu"></nb-menu>
      </nb-sidebar>

      <nb-layout-column>
        <router-outlet></router-outlet>
      </nb-layout-column>

      <nb-layout-footer fixed>
        <ngx-footer></ngx-footer>
      </nb-layout-footer>
    </nb-layout>
  `
})
export class PagesComponent implements AfterViewChecked {
  menu = MENU_ITEMS;
  langgloading: boolean;
  constructor(
    private authService: AuthService,
    private cdr: ChangeDetectorRef,
    langgService: LanggService
  ) {
    langgService.langLoading.subscribe(
      langSpin => (this.langgloading = langSpin)
    );
  }
  ngAfterViewChecked() {
    this.menu = this.authService.reloadMenuItems(MENU_ITEMS);
    this.cdr.detectChanges();
  }
}
