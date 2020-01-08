import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { IonicModule } from '@ionic/angular';
import { NbChatModule, NbSpinnerModule } from '@nebular/theme';

import { ChatPageRoutingModule } from './chat-routing.module';

import { ChatPage } from './chat.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    ChatPageRoutingModule,
    NbChatModule,
    NbSpinnerModule,
  ],
  declarations: [ChatPage]
})
export class ChatPageModule {}
