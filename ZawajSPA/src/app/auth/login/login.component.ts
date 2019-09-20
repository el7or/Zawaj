import { Component, ViewChild, Inject, ChangeDetectorRef } from '@angular/core';
import { NbLoginComponent, NbAuthService, NB_AUTH_OPTIONS } from '@nebular/auth';
import { NgForm } from '@angular/forms';
import { Router } from '@angular/router';

@Component({
  selector: 'ngx-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss'],
})
export class LoginComponent extends NbLoginComponent {
  @ViewChild('form', {static: false}) form: NgForm;
  loading = false;

  constructor(private ser: NbAuthService, 
    service: NbAuthService, 
    @Inject(NB_AUTH_OPTIONS) options:{},
     cd: ChangeDetectorRef, router: Router){
      super(service, options, cd, router);
     }

  login() {
    console.log(this.form.value);
    debugger;
    this.loading = true;
    setTimeout(() => {
      this.loading = false;
      this.router.navigate(['/pages']);
    }, 4000);
  }

}
