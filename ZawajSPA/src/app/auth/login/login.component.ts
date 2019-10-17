import { Location } from '@angular/common';
import { LanggService } from './../../shared/services/langg.service';
import { OnInit, OnDestroy } from "@angular/core";
import { AuthService } from "./../../shared/services/auth.service";
import { Component, ViewChild, Inject, ChangeDetectorRef } from "@angular/core";
import {
  NbLoginComponent,
  NbAuthService,
  NB_AUTH_OPTIONS
} from "@nebular/auth";
import { NgForm } from "@angular/forms";
import { Router } from "@angular/router";
import { SwalComponent } from "@sweetalert2/ngx-sweetalert2";
import { Subscription } from "rxjs";

@Component({
  selector: "ngx-login",
  templateUrl: "./login.component.html",
  styleUrls: ["./login.component.scss"]
})
export class LoginComponent extends NbLoginComponent
  implements OnInit, OnDestroy {
  @ViewChild("form", { static: false }) form: NgForm;
  @ViewChild("authSwal", { static: false }) private authSwal: SwalComponent;
  @ViewChild("unAuthSwal", { static: false }) private unAuthSwal: SwalComponent;
  authSubscription: Subscription;
  loading = false;

  constructor(
    private ser: NbAuthService,
    service: NbAuthService,
    @Inject(NB_AUTH_OPTIONS) options: {},
    cd: ChangeDetectorRef,
    router: Router, private location: Location,
    private authService: AuthService) {
    super(service, options, cd, router);
  }

  ngOnInit() {
  }

  ngOnDestroy() {
    if(this.authSubscription) this.authSubscription.unsubscribe();
  }

  login() {
    this.loading = true;
    this.authSubscription = this.authService.login(this.user).subscribe(
      () => {
        this.authSwal.fire();
        this.loading = false;
        if(this.authService.redirectUrl)
        {this.router.navigateByUrl(this.authService.redirectUrl.substring(0, this.router.url.indexOf("/")));}
        else{this.location.back();}
      },
      err => {
        if (err == "Unauthorized") {this.unAuthSwal.fire();}
        this.loading = false;
      }
    );
  }
}
