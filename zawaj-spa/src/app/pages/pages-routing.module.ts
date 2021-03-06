import { UnsavedChangesGuard } from './../shared/guards/unsaved-changes.guard';
import { MemberEditResolverService } from './member-edit/member-edit-resolver.service';
import { MemberEditComponent } from './member-edit/member-edit.component';
import { MemberDetailsComponent } from "./member-details/member-details.component";
import { AuthGuard } from "./../shared/guards/auth.guard";
import { ChatComponent } from "./chat/chat.component";
import { SettingComponent } from "./setting/setting.component";
import { RouterModule, Routes } from "@angular/router";
import { NgModule } from "@angular/core";

import { PagesComponent } from "./pages.component";
import { MemberListComponent } from "./member-list/member-list.component";
import { NotFoundComponent } from "./miscellaneous/not-found/not-found.component";
import { SearchComponent } from "./search/search.component";
import { MemberDetailsResolverService } from './member-details/member-details-resolver.service';
import { MemberListResolverService } from './member-list/member-list-resolver.service';
import { LikesComponent } from './likes/likes.component';
import { PaymentComponent } from './payment/payment.component';

const routes: Routes = [
  {
    path: "",
    component: PagesComponent,
    /* runGuardsAndResolvers: 'always',
    canActivate: [AuthGuard], */
    children: [
      { path: "members", component: MemberListComponent,
      resolve:{userPagedList:MemberListResolverService} },
      {
        path: "members/edit",
        component: MemberEditComponent,
        canActivate: [AuthGuard],
        canDeactivate:[UnsavedChangesGuard],
        resolve:{userDetails:MemberEditResolverService}
      },
      {
        path: "members/:id",
        component: MemberDetailsComponent,
        canActivate: [AuthGuard],
        resolve:{userDetails:MemberDetailsResolverService}
      },
      {
        path: "likes",
        component: LikesComponent,
        canActivate: [AuthGuard]
      },
      {
        path: "chat",
        component: ChatComponent,
        canActivate: [AuthGuard]
      },
      {
        path: "search",
        component: SearchComponent
      },
      {
        path: "setting",
        component: SettingComponent,
        canActivate: [AuthGuard]
      },
      {
        path: "payment",
        component: PaymentComponent,
        canActivate: [AuthGuard]
      },
      {
        path: "",
        redirectTo: "members",
        pathMatch: "full"
      },
      {
        path: "**",
        component: NotFoundComponent
      }
    ]
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class PagesRoutingModule {}
