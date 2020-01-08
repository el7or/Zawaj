import { Component, OnInit } from "@angular/core";
import { SegmentChangeEventDetail } from "@ionic/core";
import { Subscription } from "rxjs";
import {
  LoadingController,
  AlertController,
  ToastController
} from "@ionic/angular";

import { LikesService } from "./likes.service";
import { AuthService } from "../../auth/auth.service";
import { LikeList, LikeUser } from "./likes.model";

@Component({
  selector: "app-likes",
  templateUrl: "./likes.page.html",
  styleUrls: ["./likes.page.scss"]
})
export class LikesPage implements OnInit {
  tabValue: string = "favorites";
  likesToData: LikeList[];
  likesFromData: LikeList[];
  subsTo: Subscription;
  subsFrom: Subscription;
  loadingId:string;

  constructor(
    private likeService: LikesService,
    private authService: AuthService,
    private loadingCtrl: LoadingController,
    private alertCtrl: AlertController,
    private toastCtrl: ToastController
  ) {}

  ngOnInit() {}

  ionViewWillEnter() {
    this.loadingCtrl
      .create({ keyboardClose: true, message: "جاري التحميل ..." })
      .then(loadingEl => {
        loadingEl.present();
        this.subsTo = this.likeService
          .getLikes(this.authService.currentUserId, false)
          .subscribe(
            res => {
              this.likesToData = res;
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
  ionViewDidEnter() {
    this.loadingCtrl
      .create({ keyboardClose: true, message: "جاري التحميل ..." })
      .then(loadingEl => {
        loadingEl.present();
        this.subsFrom = this.likeService
          .getLikes(this.authService.currentUserId, true)
          .subscribe(
            res => {
              this.likesFromData = res;
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
    this.subsTo.unsubscribe();
    this.subsFrom.unsubscribe();
  }

  onChangeTab(event: CustomEvent<SegmentChangeEventDetail>) {
    this.tabValue = event.detail.value;
  }

  dislike(likeToUserId: string, index: number) {
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
                  this.loadingId = null;
                  this.likesToData.splice(index, 1);
                  this.toastCtrl
                    .create({
                      message:
                        '<ion-icon name="checkmark" size="large"></ion-icon> تم إلغاء الإعجاب بنجاح <ion-icon name="checkmark" size="large"></ion-icon>',
                      duration: 3000,
                      color: "success"
                    })
                    .then(toastEl => toastEl.present());
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
            cssClass: "secondary"
          }
        ]
      })
      .then(alertEl => alertEl.present());
  }
}
