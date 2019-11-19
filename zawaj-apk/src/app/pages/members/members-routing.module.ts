import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { MembersPage } from './members.page';

const routes: Routes = [
  {
    path: '',
    component: MembersPage
  },
  {
    path: ':memberId',
    loadChildren: () => import('./member-details/member-details.module').then( m => m.MemberDetailsPageModule)
  },
  {
    path: 'member-edit',
    loadChildren: () => import('./member-edit/member-edit.module').then( m => m.MemberEditPageModule)
  },
  {
    path: 'member-search',
    loadChildren: () => import('./member-search/member-search.module').then( m => m.MemberSearchPageModule)
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class MembersPageRoutingModule {}
