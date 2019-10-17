import { Router } from "@angular/router";
import { AuthService } from "./../../services/auth.service";
import {
  Component,
  OnDestroy,
  OnInit,
  ViewChild,
  TemplateRef,
  AfterViewChecked,
  AfterViewInit
} from "@angular/core";
import {
  NbMenuService,
  NbSidebarService,
  NbWindowService,
  NbSearchService,
  NbDialogService
} from "@nebular/theme";

import { SwalComponent } from "@sweetalert2/ngx-sweetalert2";
import { LayoutService } from "../../../@core/utils";
import { Subject } from "rxjs";
import { LanggService } from "../../services/langg.service";
import { MENU_ITEMS } from "../../../pages/pages-menu";

@Component({
  selector: "ngx-header",
  styleUrls: ["./header.component.scss"],
  templateUrl: "./header.component.html"
})
export class HeaderComponent
  implements OnInit, AfterViewInit, AfterViewChecked, OnDestroy {
  @ViewChild("logoutSwal", { static: false }) private logoutSwal: SwalComponent;
  @ViewChild("dialog", { static: false }) private dialog;
  menuTitles: any;
  menu = MENU_ITEMS;

  private destroy$: Subject<void> = new Subject<void>();
  userPictureOnly: boolean = false;
  user: any;

  settingMenu = [
    { title: "", icon: "sun-outline" },
    { title: "", icon: "sun" }
  ];
  langMenu = [
    { title: "عربي", group: false, data: "ar" },
    { title: "English", group: false, data: "en" }
  ];
  userMenu = [
    { title: "Profile", icon: "person" },
    { title: "Log out", icon: "menu-arrow-outline" }
  ];

  constructor(
    private sidebarService: NbSidebarService,
    private menuService: NbMenuService,
    private layoutService: LayoutService,
    private windowService: NbWindowService,
    private langgService: LanggService,
    private authService: AuthService,
    private searchService: NbSearchService,
    private router: Router,
    private dialogService: NbDialogService
  ) {
    this.searchService.onSearchSubmit().subscribe((data: any) => {
      alert(data.term);
    });
  }

  ngOnInit() {
    this.checkLangg(localStorage.getItem("langg"));

    this.menuService.onItemClick().subscribe(event => {
      switch (event.item.title) {
        case "Log out":
          this.logOut();
          break;
        case "Profile":
          this.router.navigateByUrl("/pages/members/edit");
          break;
        case "English":
        case "عربي":
          this.langgService.registerCulture(event.item.data);
          this.langgService.langLoading.next(true);
          setTimeout(() => {
            this.langgService.language.next(event.item.data);
            this.checkLangg(event.item.data);
            this.langgService.langLoading.next(false);
          }, 1000);
          break;
        default:
          break;
      }
    });
  }

  ngAfterViewInit() {
    if (localStorage.getItem("isFirstLogin")=="firstLogin") {
      let el: HTMLElement = document.getElementById("userMenu") as HTMLElement;
      setTimeout(() => {
        this.dialogService.open(this.dialog);
      }, 2000);
      setTimeout(() => {
        el.click();
        localStorage.removeItem("isFirstLogin")
      }, 4000);
    }
  }

  ngAfterViewChecked() {
    this.menu = this.authService.reloadMenuItems(MENU_ITEMS);
    this.user = {
      username: this.authService.currentUserName,
      picture: this.authService.currentUserPhoto
    };
  }

  ngOnDestroy() {
    this.destroy$.next();
    this.destroy$.complete();
  }

  checkLangg(lang: string) {
    if (lang == "en") {
      this.langMenu.find(lang => lang.title == "English").group = true;
      this.langMenu.find(lang => lang.title == "عربي").group = false;
    } else {
      this.langMenu.find(lang => lang.title == "عربي").group = true;
      this.langMenu.find(lang => lang.title == "English").group = false;
    }
  }

  isLoggedIn() {
    return this.authService.isAuthenticated();
  }

  logOut() {
    this.logoutSwal.fire();
    localStorage.removeItem("token");
    localStorage.removeItem("userPhoto");
    this.router.navigate(["/pages"]);
  }

  toggleSidebar(): boolean {
    this.sidebarService.toggle(true, "menu-sidebar");
    this.layoutService.changeLayoutSize();

    return false;
  }

  @ViewChild("contentTemplate", { static: false }) contentTemplate: TemplateRef<
    any
  >;
  openNotifications() {
    this.windowService.open(this.contentTemplate, {
      title: "Window content from template",
      context: { text: "some text to pass into template" }
    });
  }
}
