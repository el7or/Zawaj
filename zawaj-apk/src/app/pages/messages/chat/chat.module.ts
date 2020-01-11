import { NbEvaIconsModule } from '@nebular/eva-icons';
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { IonicModule } from '@ionic/angular';
import { NbChatModule, NbLayoutModule, NbThemeModule, NbLayoutDirection } from '@nebular/theme';

import { ChatPageRoutingModule } from './chat-routing.module';
import { ChatPage } from './chat.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    ChatPageRoutingModule,
    NbThemeModule.forRoot({ name: ''},null,null,NbLayoutDirection.RTL),
    NbEvaIconsModule,
    NbChatModule,
    NbLayoutModule
  ],
  declarations: [ChatPage]
})
export class ChatPageModule {}
