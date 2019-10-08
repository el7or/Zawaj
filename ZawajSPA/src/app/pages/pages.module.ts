import { HomeComponent } from './home/home.component';
import { AuthGuard } from './../shared/guards/auth.guard';
import { FormsModule } from '@angular/forms';
import { NgModule } from '@angular/core';
import { NbMenuModule, NbAlertModule, NbAccordionModule, NbSelectModule, NbCardModule, NbLayoutModule, NbSidebarModule, NbUserModule, NbIconModule, NbTabsetModule, NbButtonModule } from '@nebular/theme';
import {NgxPaginationModule} from 'ngx-pagination';

import { SharedModule } from '../shared/shared.module';
import { PagesComponent } from './pages.component';
import { PagesRoutingModule } from './pages-routing.module';
import { MiscellaneousModule } from './miscellaneous/miscellaneous.module';
import { SettingComponent } from './setting/setting.component';
import { SweetAlert2Module } from '@sweetalert2/ngx-sweetalert2';
import { SearchComponent } from './search/search.component';
import { ChatComponent } from './chat/chat.component';
import { MemberDetailsComponent } from './member-details/member-details.component';

@NgModule({
  imports: [
    PagesRoutingModule,
    SharedModule,
    NbMenuModule,
    MiscellaneousModule,
    NbAlertModule,
    FormsModule,
    NbAccordionModule,
    NbSelectModule,
    NbCardModule,
    NbLayoutModule,
    NbSidebarModule,
    NbUserModule,
    NbIconModule,
    NbTabsetModule,
    NbButtonModule,
    SweetAlert2Module.forRoot(),
    NgxPaginationModule
  ],
  declarations: [
    PagesComponent,
    HomeComponent,
    SettingComponent,
    SearchComponent,
    ChatComponent,
    MemberDetailsComponent,
  ],
  providers:[AuthGuard]
})
export class PagesModule {
}
