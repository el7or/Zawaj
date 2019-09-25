import { OnInit, Inject, ChangeDetectorRef } from '@angular/core';
import { NgForm } from '@angular/forms';
import { Component, ViewChild } from '@angular/core';
import { NbRegisterComponent, NbAuthService, NB_AUTH_OPTIONS } from '@nebular/auth';
import { Router } from '@angular/router';

@Component({
  selector: 'ngx-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.scss'],
})
export class RegisterComponent extends NbRegisterComponent {
  user: any;
  @ViewChild('form', {static: false}) form: NgForm;

  constructor(private ser: NbAuthService, 
    service: NbAuthService, 
    @Inject(NB_AUTH_OPTIONS) options:{},
     cd: ChangeDetectorRef, router: Router){       
      super(service, options, cd, router);
      this.user.gender = 1;
     }

  register() {
    console.log(this.form.value);
  }

}
