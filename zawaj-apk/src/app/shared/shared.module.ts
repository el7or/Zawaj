import { IonicModule } from '@ionic/angular';
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { ImagePickerComponent } from './pickers/image-picker/image-picker.component';
import { LocalDayPipe } from './pipes/local-day.pipe';
import { LocalNumberPipe } from './pipes/local-number.pipe';
import { TimeAgoPipe } from './pipes/time-ago.pipe';



@NgModule({
  declarations: [LocalNumberPipe, TimeAgoPipe, LocalDayPipe, ImagePickerComponent],
  imports: [
    IonicModule,
    CommonModule
  ],
  exports:[LocalNumberPipe, TimeAgoPipe, LocalDayPipe, ImagePickerComponent]
})
export class SharedModule { }
