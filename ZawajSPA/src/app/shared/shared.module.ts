import { RouterModule } from "@angular/router";
import { ModuleWithProviders, NgModule } from "@angular/core";
import { CommonModule } from "@angular/common";
import {
  NbActionsModule,
  NbLayoutModule,
  NbMenuModule,
  NbSearchModule,
  NbSidebarModule,
  NbUserModule,
  NbContextMenuModule,
  NbButtonModule,
  NbSelectModule,
  NbIconModule,
  NbThemeModule,
  DEFAULT_MEDIA_BREAKPOINTS,
  NbLayoutDirection,
  NbCardModule,
  NbListModule,
  NbSpinnerModule,
  NbDialogModule
} from "@nebular/theme";
import { NbEvaIconsModule } from "@nebular/eva-icons";
import { NbSecurityModule } from "@nebular/security";

import { FooterComponent, HeaderComponent } from "./components";
import {
  CapitalizePipe,
  PluralPipe,
  RoundPipe,
  TimingPipe,
  NumberWithCommasPipe
} from "./pipes";
import { DEFAULT_THEME } from "./styles/theme.default";
import { COSMIC_THEME } from "./styles/theme.cosmic";
import { CORPORATE_THEME } from "./styles/theme.corporate";
import { DARK_THEME } from "./styles/theme.dark";
import { LanggDirective } from "./directives/langg.directive";
import { SweetAlert2Module } from "@sweetalert2/ngx-sweetalert2";
import { LocalDatePipe } from "./pipes/local-date.pipe";
import { LocalNumberPipe } from "./pipes/local-number.pipe";
import { LocalDayPipe } from "./pipes/local-day.pipe";
import { TimeAgoPipe } from "./pipes/time-ago.pipe";
import { DateWithoutTimePipe } from "./pipes/date-without-time.pipe";
import { BsDropdownModule } from 'ngx-bootstrap';
import { LanggPipe } from './pipes/langg.pipe';

const NB_MODULES = [
  NbLayoutModule,
  NbMenuModule,
  NbUserModule,
  NbActionsModule,
  NbSearchModule,
  NbSidebarModule,
  NbContextMenuModule,
  NbSecurityModule,
  NbButtonModule,
  NbSelectModule,
  NbIconModule,
  NbEvaIconsModule,
  NbCardModule,
  NbListModule,
  NbSpinnerModule,
  NbDialogModule
];
const COMPONENTS = [HeaderComponent, FooterComponent];
const PIPES = [
  CapitalizePipe,
  PluralPipe,
  RoundPipe,
  TimingPipe,
  NumberWithCommasPipe,
  LocalDatePipe,
  LocalNumberPipe,
  LocalDayPipe,
  TimeAgoPipe,
  LanggPipe
];

@NgModule({
  imports: [
    CommonModule,
    ...NB_MODULES,
    RouterModule,
    SweetAlert2Module.forRoot(),
    BsDropdownModule.forRoot()
  ],
  exports: [CommonModule, ...PIPES, ...COMPONENTS, LanggDirective],
  declarations: [
    ...COMPONENTS,
    ...PIPES,
    LanggDirective,
    LocalDatePipe,
    LocalNumberPipe,
    LocalDayPipe,
    TimeAgoPipe,
    DateWithoutTimePipe,
    LanggPipe
  ]
})
export class SharedModule {
  static forRoot(): ModuleWithProviders {
    return <ModuleWithProviders>{
      ngModule: SharedModule,
      providers: [
        ...NbThemeModule.forRoot(
          {
            name: "default"
          },
          [DEFAULT_THEME, COSMIC_THEME, CORPORATE_THEME, DARK_THEME],
          DEFAULT_MEDIA_BREAKPOINTS,
          NbLayoutDirection.RTL
        ).providers
      ]
    };
  }
}
