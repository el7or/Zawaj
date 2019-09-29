import { ChatComponent } from "./chat/chat.component";
import { SettingComponent } from "./setting/setting.component";
import { RouterModule, Routes } from "@angular/router";
import { NgModule } from "@angular/core";

import { PagesComponent } from "./pages.component";
import { DashboardComponent } from "./dashboard/dashboard.component";
import { NotFoundComponent } from "./miscellaneous/not-found/not-found.component";
import { SearchComponent } from "./search/search.component";

const routes: Routes = [
  {
    path: "",
    component: PagesComponent,
    children: [
      { path: "dashboard", component: DashboardComponent },
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
        component: SettingComponent
      },
      {
        path: "",
        redirectTo: "dashboard",
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
