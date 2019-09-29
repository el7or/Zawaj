import { FormsModule } from '@angular/forms';
import { NgModule } from '@angular/core';
import { NbMenuModule, NbAlertModule, NbAccordionModule, NbSelectModule, NbCardModule, NbLayoutModule, NbSidebarModule } from '@nebular/theme';

import { SharedModule } from '../shared/shared.module';
import { PagesComponent } from './pages.component';
import { DashboardModule } from './dashboard/dashboard.module';
import { PagesRoutingModule } from './pages-routing.module';
import { MiscellaneousModule } from './miscellaneous/miscellaneous.module';
import { SettingComponent } from './setting/setting.component';
import { SweetAlert2Module } from '@sweetalert2/ngx-sweetalert2';
import { SearchComponent } from './search/search.component';
import { ChatComponent } from './chat/chat.component';

@NgModule({
  imports: [
    PagesRoutingModule,
    SharedModule,
    NbMenuModule,
    DashboardModule,
    MiscellaneousModule,
    NbAlertModule,
    FormsModule,
    NbAccordionModule,
    NbSelectModule,
    NbCardModule,
    NbLayoutModule,
    NbSidebarModule,
    SweetAlert2Module.forRoot(),
  ],
  declarations: [
    PagesComponent,
    SettingComponent,
    SearchComponent,
    ChatComponent,
  ],
})
export class PagesModule {
}
