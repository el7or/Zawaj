import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { IonicModule } from '@ionic/angular';

import { MemberEditPageRoutingModule } from './member-edit-routing.module';
import { MemberEditPage } from './member-edit.page';
import { SharedModule } from '../../../shared/shared.module';
import { ImagePickerComponent } from './image-picker/image-picker.component';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    MemberEditPageRoutingModule,
    SharedModule
  ],
  declarations: [MemberEditPage,ImagePickerComponent]
})
export class MemberEditPageModule {}
