import { LanggService } from './../../shared/services/langg.service';
import { BsLocaleService } from 'ngx-bootstrap/datepicker';
import { UserRegister } from './../../shared/models/user-register';
import { AuthService } from './../../shared/services/auth.service';
import { Inject, ChangeDetectorRef } from '@angular/core';
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
  maxDate: Date;

  constructor(private ser: NbAuthService, service: NbAuthService, @Inject(NB_AUTH_OPTIONS) options:{},
     cd: ChangeDetectorRef, router: Router, private authService:AuthService,
     private localeService: BsLocaleService, private langgService:LanggService){       
      super(service, options, cd, router);
      this.user.gender = 1;
      this.localeService.use(localStorage.getItem('langg'));
      this.maxDate = new Date();
      this.maxDate.setFullYear(this.maxDate.getFullYear() -10);
     }

  register() {
    const birthDate = this.user.birthDate;
    this.user.birthDate = this.langgService.resetDateTime(this.user.birthDate);
    this.authService.register(this.user).subscribe(
      () => {
        this.user.birthDate = birthDate;
        this.registerSwal.fire();
        this.loading = false;
        this.router.navigate(["/pages"]);        
      },
      err => {
        if(err=='DuplicateUserName'){
          this.duplicateSwal.fire();
        this.user.birthDate = birthDate;
        }
        this.loading = false;

      }
    )
  }
}
