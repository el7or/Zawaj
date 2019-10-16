import { UserRegister } from './../../shared/models/user-register';
import { AuthService } from './../../shared/services/auth.service';
import { OnInit, Inject, ChangeDetectorRef } from '@angular/core';
import { NgForm } from '@angular/forms';
import { Component, ViewChild } from '@angular/core';
import { NbRegisterComponent, NbAuthService, NB_AUTH_OPTIONS } from '@nebular/auth';
import { Router } from '@angular/router';
import { SwalComponent } from '@sweetalert2/ngx-sweetalert2';

@Component({
  selector: 'ngx-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.scss'],
})
export class RegisterComponent extends NbRegisterComponent {
  user:UserRegister;
  @ViewChild('form', {static: false}) form: NgForm;
  @ViewChild("registerSwal", { static: false }) private registerSwal: SwalComponent;
  @ViewChild("duplicateSwal", { static: false }) private duplicateSwal: SwalComponent;
  loading = false;

  constructor(private ser: NbAuthService, 
    service: NbAuthService, 
    @Inject(NB_AUTH_OPTIONS) options:{},
     cd: ChangeDetectorRef, router: Router, private authService:AuthService){       
      super(service, options, cd, router);
      this.user.gender = 1;
     }

  register() {
    this.authService.register(this.user).subscribe(
      () => {
        this.registerSwal.fire();
        this.loading = false;
        this.router.navigate(["/pages"]);        
      },
      err => {
        if(err=='DuplicateUserName'){this.duplicateSwal.fire()}
        this.loading = false;
      },
      () => {this.loading = false;}
    )
  }
}
