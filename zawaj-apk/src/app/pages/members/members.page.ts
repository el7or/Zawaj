import { Router } from "@angular/router";
import { Component } from "@angular/core";
import {
  LoadingController,
  IonItemSliding,
  AlertController,
  ToastController
} from "@ionic/angular";
import { Subscription } from "rxjs";

import { LikesService } from "./../likes/likes.service";
import { AuthService } from "./../../auth/auth.service";
import { UserService } from "./user.service";
import { UserList, Pagination } from "./members.model";
import { LikeUser } from "../likes/likes.model";

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
  loadingId: string;
  subs: Subscription;

  constructor(
    private userService: UserService,
    private authService: AuthService,
    private likeService: LikesService,
    private loadingCtrl: LoadingController,
    private alertCtrl: AlertController,
    private toastCtrl: ToastController,
    private router: Router
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
                  header: "حدث خطأ ما !",
                  message:
                    '<ion-icon name="warning"></ion-icon> الرجاء التأكد من اتصال الإنترنت وإعادة المحاولة <ion-icon name="warning"></ion-icon>',
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

  loadData(event) {
    if(this.pagination.pageCount==this.pagination.pageNumber){
      event.target.disabled = true;
      return;
    }
    this.pagination.pageNumber++;
    this.subs = this.userService
      .getAllUsers(this.pagination.pageNumber, this.pagination.pageSize)
      .subscribe(
        userPagedList => {
          this.users.push(...userPagedList.users);
          this.pagination = userPagedList.pagination;
          event.target.complete();
        },
        error => {
          console.error(error);
          this.alertCtrl
            .create({
              header: "حدث خطأ ما !",
              message:
                '<ion-icon name="warning"></ion-icon> الرجاء التأكد من اتصال الإنترنت وإعادة المحاولة <ion-icon name="warning"></ion-icon>',
              cssClass: "danger",
              buttons: ["حسنا"]
            })
            .then(alertEl => alertEl.present());
            event.target.complete();
        }
      );
  }

  onLike(itemSlide: IonItemSliding, likeToUserId: string) {
    this.loadingId = likeToUserId;
    let newLike: LikeUser = {
      likeFromUserId: this.authService.currentUserId,
      likeToUserId: likeToUserId
    };
    this.likeService.postLike(newLike).subscribe(
      () => {
        this.toastCtrl
          .create({
            message:
              '<ion-icon name="checkmark" size="large"></ion-icon> تم تسجيل الإعجاب بنجاح <ion-icon name="checkmark" size="large"></ion-icon>',
            duration: 3000,
            color: "success"
          })
          .then(toastEl => toastEl.present());
        this.users.find(user => user.id == likeToUserId).isLiking = true;
        itemSlide.close();
        this.loadingId = null;
      },
      error => {
        console.error(error);
        this.alertCtrl
          .create({
            header: "حدث خطأ ما !",
            message:
              '<ion-icon name="warning"></ion-icon> الرجاء التأكد من اتصال الإنترنت وإعادة المحاولة <ion-icon name="warning"></ion-icon>',
            cssClass: "danger",
            buttons: ["حسنا"]
          })
          .then(alertEl => alertEl.present());
      }
    );
  }

  onDisLike(itemSlide: IonItemSliding, likeToUserId: string) {
    this.alertCtrl
      .create({
        header: "تأكيد!",
        message: "<strong>هل تريد إلغاء الإعجاب بالفعل</strong>؟؟",
        buttons: [
          {
            text: "نعم ألغِ الإعجاب",
            cssClass: "danger",
            handler: () => {
              this.loadingId = likeToUserId;
              let deletedLike: LikeUser = {
                likeFromUserId: this.authService.currentUserId,
                likeToUserId: likeToUserId
              };
              this.likeService.deleteLike(deletedLike).subscribe(
                () => {
                  this.toastCtrl
                    .create({
                      message:
                        '<ion-icon name="checkmark" size="large"></ion-icon> تم إلغاء الإعجاب بنجاح <ion-icon name="checkmark" size="large"></ion-icon>',
                      duration: 3000,
                      color: "success"
                    })
                    .then(toastEl => toastEl.present());
                  this.users.find(
                    user => user.id == likeToUserId
                  ).isLiking = false;
                  itemSlide.close();
                  this.loadingId = null;
                },
                error => {
                  console.error(error);
                  this.alertCtrl
                    .create({
                      header: "حدث خطأ ما !",
                      message:
                        '<ion-icon name="warning"></ion-icon> الرجاء التأكد من اتصال الإنترنت وإعادة المحاولة <ion-icon name="warning"></ion-icon>',
                      cssClass: "danger",
                      buttons: ["حسنا"]
                    })
                    .then(alertEl => alertEl.present());
                }
              );
            }
          },
          {
            text: "تراجع",
            role: "cancel",
            cssClass: "secondary",
            handler: () => {
              itemSlide.close();
            }
          }
        ]
      })
      .then(alertEl => alertEl.present());
  }

  onMail(itemSlide: IonItemSliding) {
    itemSlide.close();
    this.router.navigateByUrl("messages");
  }
}
