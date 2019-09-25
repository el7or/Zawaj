import { CommonModule } from "@angular/common";
import { NgModule } from "@angular/core";
import { FormsModule } from "@angular/forms";
import { RouterModule } from "@angular/router";

import { NgxAuthRoutingModule } from "./auth-routing.module";
import { NbAuthModule } from "@nebular/auth";
import {
  NbAlertModule,
  NbButtonModule,
  NbCheckboxModule,
  NbInputModule,
  NbSpinnerModule,
  NbRadioModule
} from "@nebular/theme";
import { LoginComponent } from "./login/login.component";
import { RegisterComponent } from "./register/register.component";
import { SharedModule } from "../shared/shared.module";

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    RouterModule,
    NbAlertModule,
    NbInputModule,
    NbButtonModule,
    NbCheckboxModule,
    NgxAuthRoutingModule,
    NbSpinnerModule,
    NbRadioModule,
    NbAuthModule.forRoot({
      forms: {
        validation: {
          password: {
            required: true,
            minLength: 4,
            maxLength: 20
          },
          userName: {
            required: true
          },
          fullName: {
            required: true,
            minLength: 10,
            maxLength: 50
          }
        }
      }
    }),
    SharedModule
  ],
  declarations: [LoginComponent, RegisterComponent]
})
export class NgxAuthModule {}
