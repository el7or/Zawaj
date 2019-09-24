import { Component, OnInit } from "@angular/core";
import { NbThemeService, NbMediaBreakpointsService } from "@nebular/theme";
import { map, takeUntil } from "rxjs/operators";
import { Subject } from "rxjs";

@Component({
  selector: "setting",
  templateUrl: "./setting.component.html",
  styleUrls: ["./setting.component.scss"]
})
export class SettingComponent implements OnInit {
  themes = [
    {
      value: "default",
      name: "Light"
    },
    {
      value: "dark",
      name: "Dark"
    },
    {
      value: "cosmic",
      name: "Cosmic"
    }
   /*  {
      value: 'corporate',
      name: 'Corporate',
    },  */
  ];
  currentTheme;
  selectedTheme;
  private destroy$: Subject<void> = new Subject<void>();
  userPictureOnly: boolean = false;
  constructor(
    private themeService: NbThemeService,
    private breakpointService: NbMediaBreakpointsService
  ) {}

  ngOnInit() {
    this.currentTheme = localStorage.getItem('theme')=== null?"default":localStorage.getItem('theme');
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

    /* this.themeService
      .onThemeChange()
      .pipe(
        map(({ name }) => name),
        takeUntil(this.destroy$)
      )
      .subscribe(themeName => (this.currentTheme = themeName)); */
      this.changeTheme(this.currentTheme);
  }

  changeTheme(themeName: string) {
    localStorage.setItem('theme',themeName);
    this.selectedTheme = this.themes.find(theme=>theme.value==themeName).name;
    this.themeService.changeTheme(themeName);
  }
}
