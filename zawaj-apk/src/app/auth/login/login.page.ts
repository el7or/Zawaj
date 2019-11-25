import { Router } from '@angular/router';
import { Component, OnInit } from "@angular/core";
import { NgForm } from "@angular/forms";
import { LoadingController, AlertController, ToastController } from "@ionic/angular";

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
    private alertCtrl: AlertController,
     private toastCtrl:ToastController
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
            this.toastCtrl.create({
              message: '<ion-icon name="checkmark" size="large"></ion-icon> تم تسجيل الدخول بنجاح <ion-icon name="checkmark" size="large"></ion-icon>',
              duration: 3000,
              color: 'success'
            }).then(toastEl=>toastEl.present());
            this.router.navigateByUrl("/");
          },
          errRes => {
            console.error(errRes.message)
            loadingEl.dismiss();
            let header = "حدث خطأ ما";
            let message = 'لم يتم تسجيل الدخول لخطأ ما، الرجاء التأكد من اتصال الإنترنت وإعادة المحاولة!';
            const code = errRes.statusText;
            if(code==="Unauthorized"){
              header = "تسجيل دخول خاطئ";
            message = 'اسم المستخدم أو كلمة السر غير صحيحة !';
            }
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
                header: header,
                message: message,
                buttons: ["حسنا"]
              })
              .then(alertEl => alertEl.present());
          }
        );
      });    
  }
}
