import {
  Component,
  OnDestroy,
  OnInit,
  ViewChild,
  TemplateRef
} from "@angular/core";
import {
  NbMediaBreakpointsService,
  NbMenuService,
  NbSidebarService,
  NbThemeService,
  NbLayoutDirection,
  NbLayoutDirectionService,
  NbWindowService
} from "@nebular/theme";

import { UserData } from "../../../@core/data/users";
import { LayoutService } from "../../../@core/utils";
import { map, takeUntil } from "rxjs/operators";
import { Subject } from "rxjs";
import { LanggService } from "../../services/langg.service";
import { MENU_ITEMS } from "../../../pages/pages-menu";

@Component({
  selector: "ngx-header",
  styleUrls: ["./header.component.scss"],
  templateUrl: "./header.component.html"
})
export class HeaderComponent implements OnInit, OnDestroy {
  menuTitles: any;
  menu = MENU_ITEMS;

  private destroy$: Subject<void> = new Subject<void>();
  userPictureOnly: boolean = false;
  user: any;
  isUser=false;

  settingMenu = [
    { title: "", icon: "sun-outline" },
    { title: "", icon: "sun" }
  ];
  langMenu = [
    { title: "عربي", group: false, data: "ar" },
    { title: "English", group: false, data: "en" }
  ];
  userMenu = [
    { title: "Profile", link: "/auth/login", icon: "menu-arrow-outline" },
    { title: "Log out" }
  ];

  constructor(
    private sidebarService: NbSidebarService,
    private menuService: NbMenuService,
    private themeService: NbThemeService,
    private userService: UserData,
    private layoutService: LayoutService,
    private breakpointService: NbMediaBreakpointsService,
    private dirService: NbLayoutDirectionService,
    private windowService: NbWindowService,
    private langgService: LanggService
  ) {}
  ngOnInit() {
    this.changeLangg(localStorage.getItem("langg"));

    this.menuService.onItemClick().subscribe(event => {
      this.changeLangg(event.item.data);
    });

    this.user = { name: 'Ahmed El7or', picture: 'assets/images/avatar.png' }
   /*  this.userService
      .getUsers()
      .pipe(takeUntil(this.destroy$))
      .subscribe((users: any) => (this.user = users.nick)); */

    const { xl } = this.breakpointService.getBreakpointsMap();
    this.themeService
      .onMediaQueryChange()
      .pipe(
        map(([, currentBreakpoint]) => currentBreakpoint.width < xl),
        takeUntil(this.destroy$)
      )
      .subscribe(
        (isLessThanXl: boolean) => (this.userPictureOnly = isLessThanXl)
      );
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

  toggleSidebar(): boolean {
    this.sidebarService.toggle(true, "menu-sidebar");
    this.layoutService.changeLayoutSize();

    return false;
  }

  navigateHome() {
    this.menuService.navigateHome();
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
