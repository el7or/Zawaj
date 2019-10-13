import { MemberListComponent } from './member-list/member-list.component';
import { AuthGuard } from './../shared/guards/auth.guard';
import { FormsModule } from '@angular/forms';
import { NgModule } from '@angular/core';
import { NbMenuModule, NbAlertModule, NbAccordionModule, NbSelectModule, NbCardModule, NbLayoutModule, NbSidebarModule, NbUserModule, NbIconModule, NbTabsetModule, NbButtonModule, NbInputModule } from '@nebular/theme';
import {NgxPaginationModule} from 'ngx-pagination';
import { NgxGalleryModule } from 'ngx-gallery';
import {AutosizeModule} from 'ngx-autosize';

import { SharedModule } from '../shared/shared.module';
import { PagesComponent } from './pages.component';
import { PagesRoutingModule } from './pages-routing.module';
import { MiscellaneousModule } from './miscellaneous/miscellaneous.module';
import { SettingComponent } from './setting/setting.component';
import { SweetAlert2Module } from '@sweetalert2/ngx-sweetalert2';
import { SearchComponent } from './search/search.component';
import { ChatComponent } from './chat/chat.component';
import { MemberDetailsComponent } from './member-details/member-details.component';
import { MemberEditComponent } from './member-edit/member-edit.component';
import { PhotoEditorComponent } from './photo-editor/photo-editor.component';
import { FileUploadModule } from 'ng2-file-upload';

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
    NbInputModule,
    SweetAlert2Module.forRoot(),
    NgxPaginationModule,
    NgxGalleryModule,
    AutosizeModule,
    FileUploadModule
  ],
  declarations: [
    PagesComponent,
    MemberListComponent,
    SettingComponent,
    SearchComponent,
    ChatComponent,
    MemberDetailsComponent,
    MemberEditComponent,
    PhotoEditorComponent,
  ],
  providers:[AuthGuard]
})
export class PagesModule {
}
