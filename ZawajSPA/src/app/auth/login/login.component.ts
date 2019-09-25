import { UserLogin } from './../../shared/models/user-login';
import { AuthService } from './../../shared/services/auth.service';
import { Component, ViewChild, Inject, ChangeDetectorRef } from '@angular/core';
import { NbLoginComponent, NbAuthService, NB_AUTH_OPTIONS } from '@nebular/auth';
import { NgForm } from '@angular/forms';
import { Router } from '@angular/router';
import { NbToastrService, NbGlobalPhysicalPosition } from '@nebular/theme';

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
     cd: ChangeDetectorRef, router: Router,private authService:AuthService,
     private toastrService: NbToastrService){
      super(service, options, cd, router);
     }

  login() {
    this.loading = true;
    this.authService.login(this.user).subscribe(
      res=> {
        console.log(res);
        this.loading = false;},
      err => {if(err.error.title=='Unauthorized'){
        this.toastrService.danger('Wrong Data', 'Unauthorized',{duration :5000, icon:'alert-triangle-outline',position:NbGlobalPhysicalPosition.BOTTOM_RIGHT});
        this.loading = false;}},
      () => this.loading = false
    )
       
    /* setTimeout(() => {
      this.loading = false;
      this.router.navigate(['/pages']);
    }, 4000); */
  }

}
