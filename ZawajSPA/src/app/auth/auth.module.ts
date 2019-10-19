import { BsDatepickerModule } from 'ngx-bootstrap';
import { CommonModule } from "@angular/common";
import { NgModule } from "@angular/core";
import { FormsModule } from "@angular/forms";
import { RouterModule } from "@angular/router";
import { SweetAlert2Module } from '@sweetalert2/ngx-sweetalert2';

import { NgxAuthRoutingModule } from "./auth-routing.module";
import { NbAuthModule } from "@nebular/auth";
import {
  NbAlertModule,
  NbButtonModule,
  NbCheckboxModule,
  NbInputModule,
  NbSpinnerModule,
  NbRadioModule,
  NbDatepickerModule,
} from "@nebular/theme";
import { LoginComponent } from "./login/login.component";
import { RegisterComponent } from "./register/register.component";
import { SharedModule } from "../shared/shared.module";

@NgModule({
  imports: [
    CommonModule,
    SharedModule,
    FormsModule,
    RouterModule,
    NbAlertModule,
    NbInputModule,
    NbButtonModule,
    NbCheckboxModule,
    NgxAuthRoutingModule,
    NbSpinnerModule,
    NbRadioModule,
    NbDatepickerModule,
    BsDatepickerModule.forRoot(),
    SweetAlert2Module.forRoot(),
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
          nickName: {
            required: true,
            minLength: 3,
            maxLength: 12
          },
          birthDate:{
            required: true
          },
          gender:{
            required: true
          },
          country:{
            required: true
          },
          city:{
            required: true
          }
        }
      }
    })
  ],
  declarations: [LoginComponent, RegisterComponent]
})
export class NgxAuthModule {}
