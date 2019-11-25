import { AlertController, ToastController } from "@ionic/angular";
import { Router } from "@angular/router";
import { NgForm } from "@angular/forms";
import { LoadingController } from "@ionic/angular";
import { Component, OnInit } from "@angular/core";

import { AuthService } from "./../auth.service";
import { UserRegister } from "./user-register";

@Component({
  selector: "app-register",
  templateUrl: "./register.page.html",
  styleUrls: ["./register.page.scss"]
})
export class RegisterPage implements OnInit {
  isLoading = false;

  constructor(
    private loadingCtrl: LoadingController,
    private authService: AuthService,
    private router: Router,
    private alertCtrl: AlertController,
    private toastCtrl: ToastController
  ) {}

  ngOnInit() {}

  onSignUp(form: NgForm) {
    this.isLoading = true;
    this.loadingCtrl
      .create({ keyboardClose: true, message: "جاري تسجيل الحساب ..." })
      .then(loadingEl => {
        loadingEl.present();

        const longBirthDate = form.value.birthDate;
        const shortBirthDate =
          new Date(longBirthDate).getFullYear() +
          "-" +
          (new Date(longBirthDate).getMonth() + 1) +
          "-" +
          new Date(longBirthDate).getDate();
        const userReigester: UserRegister = {
          userName: form.value.email.trim(),
          password: form.value.password.trim(),
          nickName: form.value.nickName.trim(),
          birthDate: shortBirthDate,
          country: form.value.country.trim(),
          city: form.value.city.trim(),
          gender: form.value.gender
        };
        this.authService.register(userReigester).subscribe(
          resData => {
            this.isLoading = false;
            loadingEl.dismiss();
            form.reset();
            this.toastCtrl
              .create({
                message:
                  '<ion-icon name="checkmark" size="large"></ion-icon> تم تسجيل الحساب الجديد بنجاح <ion-icon name="checkmark" size="large"></ion-icon>',
                duration: 3000,
                color: "success"
              })
              .then(toastEl => toastEl.present());
            this.router.navigateByUrl("/");
          },
          errRes => {
            console.error(errRes.message);
            loadingEl.dismiss();
            const code = errRes;
            let header = "حدث خطأ ما";
            let message = 'لم يتم تسجيل الحساب لخطأ ما، الرجاء إعادة المحاولة!';
            if (errRes.error.length > 0) {
              if (errRes.error.filter(err => err.code == "DuplicateUserName").length > 0) {
                header = "تسجيل حساب مكرر";
                message =
                  "اسم المستخدم تم اختياره قبل ذلك، الرجاء اختيار اسم مستخدم آخر!";
              }
            }
            /* let message = "Could not sign you up, please try again.";
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
