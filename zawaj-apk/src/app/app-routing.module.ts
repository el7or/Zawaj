import { NgModule } from "@angular/core";
import { PreloadAllModules, RouterModule, Routes } from "@angular/router";

const routes: Routes = [
  {
    path: "",
    redirectTo: "home",
    pathMatch: "full"
  },
  {
    path: "home",
    children: [
      {
        path: "",
        loadChildren: () =>
          import("./home/home.module").then(m => m.HomePageModule)
      },
      {
        path: ":memberId",
        loadChildren: () =>
          import("./member-details/member-details.module").then(
            m => m.MemberDetailsPageModule
          )
      }
    ]
  },
  {
    path: "auth",
    children: [
      {
        path: "login",
        loadChildren: () =>
          import("./auth/login/login.module").then(m => m.LoginPageModule)
      },
      {
        path: "register",
        loadChildren: () =>
          import("./auth/register/register.module").then(
            m => m.RegisterPageModule
          )
      }
    ]
  },
  {
    path: "list",
    loadChildren: () => import("./list/list.module").then(m => m.ListPageModule)
  }
];

@NgModule({
  imports: [
    RouterModule.forRoot(routes, { preloadingStrategy: PreloadAllModules })
  ],
  exports: [RouterModule]
})
export class AppRoutingModule {}
