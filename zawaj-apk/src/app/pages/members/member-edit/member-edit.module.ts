import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { IonicModule } from '@ionic/angular';

import { MemberEditPageRoutingModule } from './member-edit-routing.module';
import { MemberEditPage } from './member-edit.page';
import { SharedModule } from 'src/app/shared/shared.module';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    MemberEditPageRoutingModule,
    SharedModule
  ],
  declarations: [MemberEditPage]
})
export class MemberEditPageModule {}
