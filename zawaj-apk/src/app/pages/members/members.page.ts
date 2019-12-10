import { Router } from '@angular/router';
import { Component } from "@angular/core";
import {
  LoadingController,
  IonItemSliding,
  AlertController
} from "@ionic/angular";
import { Subscription } from "rxjs";

import { UserService } from "./user.service";
import { UserList, Pagination } from "./members.model";

@Component({
  selector: "app-members",
  templateUrl: "./members.page.html",
  styleUrls: ["./members.page.scss"]
})
export class MembersPage {
  users: UserList[];
  pagination: Pagination = {
    pageNumber: 1,
    pageSize: 12,
    pageCount: null,
    totalItemCount: null
  };
  subs: Subscription;

  constructor(
    private userService: UserService,
    private loadingCtrl: LoadingController,
    private alertCtrl: AlertController,
    private router:Router
  ) {}

  ionViewWillEnter() {
    this.loadingCtrl
      .create({ keyboardClose: true, message: "جاري التحميل ..." })
      .then(loadingEl => {
        loadingEl.present();
        this.subs = this.userService
          .getAllUsers(this.pagination.pageNumber++, this.pagination.pageSize)
          .subscribe(
            userPagedList => {
              this.users = userPagedList.users;
              this.pagination = userPagedList.pagination;
              loadingEl.dismiss();
            },
            error => {
              console.error(error);
              this.alertCtrl
                .create({
                  header: 'حدث خطأ ما !',
                  message : '<ion-icon name="warning"></ion-icon> الرجاء التأكد من اتصال الإنترنت وإعادة المحاولة <ion-icon name="warning"></ion-icon>',
                  cssClass: "danger",
                  buttons: ["حسنا"]
                })
                .then(alertEl => alertEl.present());
              loadingEl.dismiss();
            }
          );
      });
  }
  ionViewDidLeave() {
    this.subs.unsubscribe();
  }

  onLike(itemSlide: IonItemSliding) {
    itemSlide.close();
    this.router.navigateByUrl('likes');
  }

  onMail(itemSlide: IonItemSliding) {
    itemSlide.close();
    this.router.navigateByUrl('messages');
  }
}
