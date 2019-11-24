import { Router } from '@angular/router';
import { Component, OnInit } from "@angular/core";
import { NgForm } from "@angular/forms";
import { LoadingController, AlertController } from "@ionic/angular";

import { UserLogin } from "./user-login";
import { AuthService } from "../auth.service";

@Component({
  selector: "app-login",
  templateUrl: "./login.page.html",
  styleUrls: ["./login.page.scss"]
})
export class LoginPage implements OnInit {
  isLoading = false;

  constructor(
    private authService: AuthService,
    private router: Router,
    private loadingCtrl: LoadingController,
    private alertCtrl: AlertController
  ) {}

  ngOnInit() {}

  onLogin(form: NgForm) {
    this.isLoading = true;
    this.loadingCtrl
      .create({ keyboardClose: true, message: "جاري تسجيل الدخول ..." })
      .then(loadingEl => {
        loadingEl.present();
        const userLogin: UserLogin = {
          userName: form.value.email.trim(),
          password: form.value.password.trim()
        };
        this.authService.login(userLogin).subscribe(
          resData => {
            this.isLoading = false;
            loadingEl.dismiss();
            form.reset();
            this.router.navigateByUrl("/");
          },
          errRes => {
            loadingEl.dismiss();
            /* const code = errRes.error.error.message;
            let message = "Could not sign you up, please try again.";
            if (code === "EMAIL_EXISTS") {
              message = "This email address exists already!";
            } else if (code === "EMAIL_NOT_FOUND") {
              message = "E-Mail address could not be found.";
            } else if (code === "INVALID_PASSWORD") {
              message = "This password is not correct.";
            } */
            this.alertCtrl
              .create({
                header: "تسجيل دخول خاطئ",
                message: 'اسم المستخدم أو كلمة السر غير صحيحة !',
                buttons: ["حسنا"]
              })
              .then(alertEl => alertEl.present());
          }
        );
      });    
  }
}
