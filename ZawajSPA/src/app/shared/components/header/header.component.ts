import { Component, OnDestroy, OnInit, ViewChild, TemplateRef } from '@angular/core';
import { NbMediaBreakpointsService, NbMenuService, NbSidebarService, NbThemeService, NbLayoutDirection, NbLayoutDirectionService, NbWindowService } from '@nebular/theme';

import { UserData } from '../../../@core/data/users';
import { LayoutService } from '../../../@core/utils';
import { map, takeUntil } from 'rxjs/operators';
import { Subject } from 'rxjs';
import { LanggService } from '../../services/langg.service';
import { MENU_ITEMS } from '../../../pages/pages-menu';

@Component({
  selector: 'ngx-header',
  styleUrls: ['./header.component.scss'],
  templateUrl: './header.component.html',
})
export class HeaderComponent implements OnInit, OnDestroy {

  menuTitles:any;
  menu = MENU_ITEMS;

  private destroy$: Subject<void> = new Subject<void>();
  userPictureOnly: boolean = false;
  user: any;

  themes = [
    {
      value: 'default',
      name: 'Light',
    },
    {
      value: 'dark',
      name: 'Dark',
    },
    /* {
      value: 'cosmic',
      name: 'Cosmic',
    },
    {
      value: 'corporate',
      name: 'Corporate',
    }, */
  ];

  currentTheme = 'default';
  isArabic:boolean;
  currentBtnLang:string;

  userMenu = [ { title: 'Profile' }, { title: 'Log out' } ];

  constructor(private sidebarService: NbSidebarService,
              private menuService: NbMenuService,
              private themeService: NbThemeService,
              private userService: UserData,
              private layoutService: LayoutService,
              private breakpointService: NbMediaBreakpointsService,
              private dirService: NbLayoutDirectionService,
              private windowService: NbWindowService,
              private langgService: LanggService) {
  }

  ngOnInit() {
    this.currentTheme = this.themeService.currentTheme;
    if (localStorage.getItem('langg')=='en') {
      this.langgService.language.next('en');
      this.isArabic = false;
      this.currentBtnLang = 'عربي';
      this.dirService.setDirection(NbLayoutDirection.LTR);
    }
    else{
      this.langgService.language.next('ar');
      this.isArabic = true;
      this.currentBtnLang = 'English';
      this.dirService.setDirection(NbLayoutDirection.RTL);
    }    

    this.userService.getUsers()
      .pipe(takeUntil(this.destroy$))
      .subscribe((users: any) => this.user = users.nick);

    const { xl } = this.breakpointService.getBreakpointsMap();
    this.themeService.onMediaQueryChange()
      .pipe(
        map(([, currentBreakpoint]) => currentBreakpoint.width < xl),
        takeUntil(this.destroy$),
      )
      .subscribe((isLessThanXl: boolean) => this.userPictureOnly = isLessThanXl);

    this.themeService.onThemeChange()
      .pipe(
        map(({ name }) => name),
        takeUntil(this.destroy$),
      )
      .subscribe(themeName => this.currentTheme = themeName);
  }

 

  ngOnDestroy() {
    this.destroy$.next();
    this.destroy$.complete();
  }

  changeTheme(themeName: string) {
    this.themeService.changeTheme(themeName);
  }

  toggleLang(){
    this.isArabic = !this.isArabic;
    if(this.isArabic){
      this.langgService.language.next('ar');
      this.currentBtnLang = 'English';
      this.dirService.setDirection(NbLayoutDirection.RTL);
    }
    else{
      this.langgService.language.next('en');
      this.currentBtnLang = 'عربي';
      this.dirService.setDirection(NbLayoutDirection.LTR);
    }
  }

  changeDir(dir: string) {
    console.log(dir);
    if(dir=='rtl'){
    this.dirService.setDirection(NbLayoutDirection.RTL);
    }
    else{
      this.dirService.setDirection(NbLayoutDirection.LTR);
    }
  }

  toggleSidebar(): boolean {
    this.sidebarService.toggle(true, 'menu-sidebar');
    this.layoutService.changeLayoutSize();

    return false;
  }

  navigateHome() {
    this.menuService.navigateHome();
    return false;
  }

  @ViewChild('contentTemplate', { static: false }) contentTemplate: TemplateRef<any>;
  openNotifications(){
    this.windowService.open(
      this.contentTemplate,
      { title: 'Window content from template', context: { text: 'some text to pass into template' } },
    );
  }
}
