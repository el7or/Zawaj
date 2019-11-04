import { ChatService } from './../../services/chat.service';
import { Router } from "@angular/router";
import { AuthService } from "./../../services/auth.service";
import {
  Component,
  OnDestroy,
  OnInit,
  ViewChild,
  AfterViewChecked,
  AfterViewInit,
  ChangeDetectorRef
} from "@angular/core";
import {
  NbMenuService,
  NbSidebarService,
  NbSearchService,
  NbDialogService
} from "@nebular/theme";

import { SwalComponent } from "@sweetalert2/ngx-sweetalert2";
import { LayoutService } from "../../../@core/utils";
import { Subject, from, Subscription } from "rxjs";
import { LanggService } from "../../services/langg.service";
import { MENU_ITEMS } from "../../../pages/pages-menu";
import {LanggPipe} from "../../pipes/langg.pipe"

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
  userPictureOnly: boolean = false;
  user: any;  
  anySubscription: Subscription;
  newMessages:number;

  settingMenu = [
    { title: "", icon: "sun-outline" },
    { title: "", icon: "sun" }
  ];
  langMenu = [
    { title: "عربي", group: false, data: "ar" },
    { title: "English", group: false, data: "en" }
  ];
  userMenu = [
    { title: "Profile", icon: "person", data:"Profile" },
    { title: "Log out", icon: "menu-arrow-outline", data:"Log out" }
  ];

  /* alertItems = [
    {title: (localStorage.getItem('langg')=='en' ? 'New Like from: ' : 'إعجاب جديد من: ') +'Ahmed', data: "like", icon:'heart'},
    {title:(localStorage.getItem('langg')=='en' ? 'New Message from: ' : 'رسالة جديدة من: ') +'Ali', data: "msg", icon:'email'}
  ]; */

  constructor(
    private sidebarService: NbSidebarService,
    private menuService: NbMenuService,
    private layoutService: LayoutService,
    private langgService: LanggService,
    private authService: AuthService,
    private searchService: NbSearchService,
    private chatService: ChatService,
    private router: Router,
    private dialogService: NbDialogService,
    private cdr: ChangeDetectorRef
  ) {
    this.anySubscription = this.searchService.onSearchSubmit().subscribe((data: any) => {
      alert(data.term);
    });
  }

  ngOnInit() {
    this.checkLangg(localStorage.getItem("langg"));
    this.newMessages = this.chatService.unreadMessages.getValue();

    this.anySubscription =this.menuService.onItemClick().subscribe(event => {
      switch (event.item.data) {
        case "en":
        case "ar":
          this.langgService.langLoading.next(true);
          setTimeout(() => {
            this.langgService.language.next(event.item.data);
            this.checkLangg(event.item.data);
            this.langgService.langLoading.next(false);
          }, 1000);
          break;
        case "Log out":
          this.logOut();
          break;
        case "Profile":
          this.router.navigateByUrl("/pages/members/edit");
          break;
        case 'like':
          this.router.navigateByUrl("/pages/likes");
          break;
          case 'msg':
            this.router.navigateByUrl("/pages/chat");
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
    this.menu.concat(this.userMenu).forEach(element => {
      element.title = new LanggPipe(this.langgService).transform(element.title)
    });
    this.user = {
      username: this.authService.currentUserName,
      picture: this.authService.currentUserPhoto
    };
    this.cdr.detectChanges();
  }

  ngOnDestroy() {
    this.anySubscription.unsubscribe();
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
    localStorage.removeItem("userNickName");

    this.router.navigateByUrl('/auth/logout', { skipLocationChange: true }).then(() => {
      this.router.navigate(["/pages/members/"]);
  }); 
  }

  toggleSidebar(): boolean {
    this.sidebarService.toggle(true, "menu-sidebar");
    this.layoutService.changeLayoutSize();

    return false;
  }
}
