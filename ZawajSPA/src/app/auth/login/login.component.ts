import { OnInit } from '@angular/core';
import { AuthService } from './../../shared/services/auth.service';
import { Component, ViewChild, Inject, ChangeDetectorRef } from '@angular/core';
import { NbLoginComponent, NbAuthService, NB_AUTH_OPTIONS } from '@nebular/auth';
import { NgForm } from '@angular/forms';
import { Router } from '@angular/router';
import { NbToastrService, NbGlobalPhysicalPosition } from '@nebular/theme';
import { SwalComponent } from '@sweetalert2/ngx-sweetalert2';

@Component({
  selector: 'ngx-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss'],
})
export class LoginComponent extends NbLoginComponent implements OnInit {
  @ViewChild('form', {static: false}) form: NgForm;
  @ViewChild('authSwal', {static: false}) private authSwal: SwalComponent;
  @ViewChild('unAuthSwal', {static: false}) private unAuthSwal: SwalComponent;
  currentLang:string;
  loading = false;

  constructor(private ser: NbAuthService, 
    service: NbAuthService, 
    @Inject(NB_AUTH_OPTIONS) options:{},
     cd: ChangeDetectorRef, router: Router,private authService:AuthService,
     private toastrService: NbToastrService){
      super(service, options, cd, router);
     }

     ngOnInit(){
      this.currentLang= localStorage.getItem('langg');
     }

  login() {
    this.loading = true;
    this.authService.login(this.user).subscribe(
      res=> {
        console.log(res);
          this.authSwal.fire();
          this.loading = false;
          this.router.navigate(['/pages']);
      },
      err => {if(err.error.title=='Unauthorized'){
        this.unAuthSwal.fire();
        this.loading = false;}},
      () => this.loading = false
    )
       
    /* setTimeout(() => {
      this.loading = false;
      this.router.navigate(['/pages']);
    }, 4000); */
  }

}
