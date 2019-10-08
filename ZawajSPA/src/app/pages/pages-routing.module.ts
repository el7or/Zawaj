import { MemberDetailsComponent } from "./member-details/member-details.component";
import { AuthGuard } from "./../shared/guards/auth.guard";
import { ChatComponent } from "./chat/chat.component";
import { SettingComponent } from "./setting/setting.component";
import { RouterModule, Routes } from "@angular/router";
import { NgModule } from "@angular/core";

import { PagesComponent } from "./pages.component";
import { HomeComponent } from "./home/home.component";
import { NotFoundComponent } from "./miscellaneous/not-found/not-found.component";
import { SearchComponent } from "./search/search.component";

const routes: Routes = [
  {
    path: "",
    component: PagesComponent,
    /* runGuardsAndResolvers: 'always',
    canActivate: [AuthGuard], */
    children: [
      { path: "members", component: HomeComponent },
      {
        path: "members/:id",
        component: MemberDetailsComponent,
        canActivate: [AuthGuard]
      },
      {
        path: "chat",
        component: ChatComponent
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
