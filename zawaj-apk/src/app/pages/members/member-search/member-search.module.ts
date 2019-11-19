import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { MemberSearchPageRoutingModule } from './member-search-routing.module';

import { MemberSearchPage } from './member-search.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    MemberSearchPageRoutingModule
  ],
  declarations: [MemberSearchPage]
})
export class MemberSearchPageModule {}
