import { LikesService } from "./../../likes/likes.service";
import { AuthService } from "./../../../auth/auth.service";
import { Component, ViewChild } from "@angular/core";
import { ActivatedRoute, Router } from "@angular/router";
import { SegmentChangeEventDetail } from "@ionic/core";
import {
  AlertController,
  LoadingController,
  IonSlides,
  ToastController
} from "@ionic/angular";

import { UserService } from "../user.service";
import { UserDetails } from "./member-details.model";
import { LikeUser } from "../../likes/likes.model";

@Component({
  selector: "app-member-details",
  templateUrl: "./member-details.page.html",
  styleUrls: ["./member-details.page.scss"]
})
export class MemberDetailsPage {
  userDetails: UserDetails;
  tabValue: string = "basic";
  @ViewChild("slides", { static: false }) slides: IonSlides;
  userDetailsPhotoURL: string;
  slideOpts = {
    initialSlide: 0,
    speed: 400,
    pager: false
  };

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private userService: UserService,
    private authService: AuthService,
    private likeService: LikesService,
    private alertCtrl: AlertController,
    private loadingCtrl: LoadingController,
    private toastCtrl: ToastController
  ) {}

  ionViewWillEnter() {
    this.loadingCtrl
      .create({ keyboardClose: true, message: "جاري جلب البيانات ..." })
      .then(loadingEl => {
        loadingEl.present();
        this.route.paramMap.subscribe(paramMap => {
          if (!paramMap.has("memberId")) {
            this.router.navigate(["/"]);
            loadingEl.dismiss();
            return;
          } else {
            const memberId = paramMap.get("memberId");
            this.userService.getUserById(memberId).subscribe(
              member => {
                this.userDetails = member;
                this.userDetailsPhotoURL = this.userDetails.photoURL;
                loadingEl.dismiss();
              },
              error => {
                console.error(error);
                this.router.navigate(["/"]);
                this.alertCtrl
                  .create({
                    header: "حدث خطأ ما !",
                    message:
                      '<ion-icon name="warning"></ion-icon> الرجاء التأكد من اتصال الإنترنت وإعادة المحاولة <ion-icon name="warning"></ion-icon>',
                    cssClass: "danger",
                    buttons: [
                      {
                        text: "حسنا",
                        handler: () => {
                          this.router.navigateByUrl("/");
                        }
                      }
                    ]
                  })
                  .then(alertEl => alertEl.present());
              }
            );
          }
        });
      });
  }

  onChangeTab(event: CustomEvent<SegmentChangeEventDetail>) {
    this.tabValue = event.detail.value;
  }

  onSlideClick(slideIndex: number, photoUrl: string) {
    this.userDetailsPhotoURL = photoUrl;
    this.slides.slideTo(slideIndex);
  }

  onSlideDrag() {
    this.slides.getActiveIndex().then(index => {
      this.userDetailsPhotoURL = this.userDetails.photos[index].url;
    });
  }

  onLike(likeToUserId: string) {
    this.loadingCtrl
      .create({ keyboardClose: true, message: "جاري تسجيل الإعجاب ..." })
      .then(loadingEl => {
        loadingEl.present();
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
            this.userDetails.isLiking = true;
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

  onDisLike(likeToUserId: string) {
    this.alertCtrl
      .create({
        header: "تأكيد!",
        message: "<strong>هل تريد إلغاء الإعجاب بالفعل</strong>؟؟",
        buttons: [
          {
            text: "نعم ألغِ الإعجاب",
            cssClass: "danger",
            handler: () => {
              this.loadingCtrl
      .create({ keyboardClose: true, message: "جاري إلغاء الإعجاب ..." })
      .then(loadingEl => {
        loadingEl.present();
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
            this.userDetails.isLiking = false;
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
          },
          {
            text: "تراجع",
            role: "cancel",
            cssClass: "secondary",
            handler: () => {}
          }
        ]
      })
      .then(alertEl => alertEl.present());
  }
}
