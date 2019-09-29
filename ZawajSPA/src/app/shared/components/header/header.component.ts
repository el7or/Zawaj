import { AuthService } from './../../services/auth.service';
import {
  Component,
  OnDestroy,
  OnInit,
  ViewChild,
  TemplateRef,
  AfterViewChecked,
  ChangeDetectorRef
} from "@angular/core";
import {
  NbMenuService,
  NbSidebarService,
  NbLayoutDirection,
  NbLayoutDirectionService,
  NbWindowService,
  NbSearchService
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
export class HeaderComponent implements OnInit, AfterViewChecked, OnDestroy {
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
  userMenu = [{ title: "Profile", link: "/",icon: "person" }, { title: "Log out", icon: "menu-arrow-outline" }];

  constructor(
    private sidebarService: NbSidebarService,
    private menuService: NbMenuService,
    private layoutService: LayoutService,
    private dirService: NbLayoutDirectionService,
    private windowService: NbWindowService,
    private langgService: LanggService,
    private authService:AuthService,
    private searchService: NbSearchService) {
      this.searchService.onSearchSubmit()
      .subscribe((data: any) => {
        alert(data.term);
      })
    }

  ngOnInit() {
    this.changeLangg(localStorage.getItem("langg"));
    this.user = { username: this.authService.currentUserName, picture: "assets/images/avatar.png" };

    this.menuService.onItemClick().subscribe(event => {
      switch (event.item.title) {        
        case "Log out":
          this.logOut();
          break;
        case "Profile":          
          break;
        case 'English':
        case 'عربي':
          this.changeLangg(event.item.data);
          break;
        default:            
          break;
      }
    });
  }

  ngAfterViewChecked(){
    this.menu = this.authService.reloadMenuItems(MENU_ITEMS);
  }

  ngOnDestroy() {
    this.destroy$.next();
    this.destroy$.complete();
  }

  changeLangg(lang: string) {
    if (lang == "en") {
      this.langgService.language.next("en");
      this.langMenu.find(lang => lang.title == "English").group = true;
      this.langMenu.find(lang => lang.title == "عربي").group = false;
      if(this.dirService.isRtl)
      {this.dirService.setDirection(NbLayoutDirection.LTR);}
    } else {
      this.langgService.language.next("ar");
      this.langMenu.find(lang => lang.title == "عربي").group = true;
      this.langMenu.find(lang => lang.title == "English").group = false;
      if(this.dirService.isLtr)
      {this.dirService.setDirection(NbLayoutDirection.RTL);}
    }
  }

  isLoggedIn() {
    return this.authService.isLoggedIn();
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
