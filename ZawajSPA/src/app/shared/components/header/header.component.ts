import {
  Component,
  OnDestroy,
  OnInit,
  ViewChild,
  TemplateRef
} from "@angular/core";
import {
  NbMenuService,
  NbSidebarService,
  NbLayoutDirection,
  NbLayoutDirectionService,
  NbWindowService
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
export class HeaderComponent implements OnInit, OnDestroy {
  @ViewChild("logoutSwal", { static: false }) private logoutSwal: SwalComponent;
  loading = false;
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
    {
      title:
        this.langgService.language.value == "ar" ? "الملف الشخصي" : "Profile",
      link: "/"
    },
    { title: this.langgService.language.value == "ar" ? "خروج" : "Log out" }
  ];

  constructor(
    private sidebarService: NbSidebarService,
    private menuService: NbMenuService,
    private layoutService: LayoutService,
    private dirService: NbLayoutDirectionService,
    private windowService: NbWindowService,
    public langgService: LanggService
  ) {}

  ngOnInit() {
    this.changeLangg(localStorage.getItem("langg"));

    this.menuService.onItemClick().subscribe(event => {
      switch (event.item.title) {
        case "Log out":
        case "خروج":
          this.logOut();
          break;
        case "Profile":
        case "الملف الشخصي":
          
          break;
        default:
            this.changeLangg(event.item.data);
          break;
      }
    });

    this.user = { name: "Ahmed El7or", picture: "assets/images/avatar.png" };
  }

  ngOnDestroy() {
    this.destroy$.next();
    this.destroy$.complete();
  }

  changeLangg(lang: string) {
    if (lang == "en") {
      this.langgService.language.next("en");
      this.dirService.setDirection(NbLayoutDirection.LTR);
      this.langMenu.find(lang => lang.title == "English").group = true;
      this.langMenu.find(lang => lang.title == "عربي").group = false;
    } else {
      this.langgService.language.next("ar");
      this.dirService.setDirection(NbLayoutDirection.RTL);
      this.langMenu.find(lang => lang.title == "عربي").group = true;
      this.langMenu.find(lang => lang.title == "English").group = false;
    }
  }

  isLoggedIn() {
    const token = localStorage.getItem("token");
    return !!token;
  }

  logOut() {
    this.logoutSwal.fire();
    localStorage.removeItem("token");
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
