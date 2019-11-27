import { PhotoService } from "./photo.service";
import { Subscription } from "rxjs";
import { NgForm } from "@angular/forms";
import { Component, ViewChild, OnDestroy } from "@angular/core";
import { ActivatedRoute, Router } from "@angular/router";
import {
  AlertController,
  LoadingController,
  ToastController
} from "@ionic/angular";
import { SegmentChangeEventDetail } from "@ionic/core";

import { UserService } from "../user.service";
import { AuthService } from "./../../../auth/auth.service";
import { PhotoDetails } from "../member-details/member-details.model";

@Component({
  selector: "app-member-edit",
  templateUrl: "./member-edit.page.html",
  styleUrls: ["./member-edit.page.scss"]
})
export class MemberEditPage implements OnDestroy {
  @ViewChild("editForm", { static: false }) editForm: NgForm;
  userDetails;
  tabValue: string = "basic";
  isLoading = false;
  subs: Subscription;

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private userService: UserService,
    private alertCtrl: AlertController,
    private authService: AuthService,
    private loadingCtrl: LoadingController,
    private toastCtrl: ToastController,
    private photoService: PhotoService
  ) {}

  ionViewWillEnter() {
    this.isLoading = true;
    this.loadingCtrl
      .create({ keyboardClose: true, message: "جاري جلب البيانات ..." })
      .then(loadingEl => {
        loadingEl.present();
        this.route.paramMap.subscribe(paramMap => {
          if (!paramMap.has("memberId")) {
            this.router.navigate(["/"]);
            this.isLoading = false;
            loadingEl.dismiss();
            return;
          } else {
            const memberId = paramMap.get("memberId");
            this.subs = this.userService.getUserById(memberId).subscribe(
              member => {
                this.userDetails = member;
                this.isLoading = false;
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

  onUpdateProfile(form: NgForm) {
    this.loadingCtrl
      .create({ keyboardClose: true, message: "جاري الحفظ ..." })
      .then(loadingEl => {
        loadingEl.present();
        this.subs = this.userService
          .putUser(this.authService.currentUserId, this.userDetails)
          .subscribe(
            () => {
              loadingEl.dismiss();
              this.editForm.reset(this.userDetails);
              this.toastCtrl
                .create({
                  message:
                    '<ion-icon name="checkmark" size="large"></ion-icon> تم حفظ التعديلات بنجاح <ion-icon name="checkmark" size="large"></ion-icon>',
                  duration: 3000,
                  color: "success"
                })
                .then(toastEl => toastEl.present());
              this.router.navigateByUrl("/");
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

  onSetMainPhoto(photo: PhotoDetails) {
    this.isLoading = true;
    this.photoService.setMainPhoto(photo.id).subscribe(
      () => {
        let currentMain = this.userDetails.photos.filter(
          p => p.isMain === true
        )[0];
        currentMain.isMain = false;
        photo.isMain = true;
        this.userDetails.photoURL = photo.url;
        this.userDetails.photos.sort((a, b) => {
          return b.isMain - a.isMain;
        });
        this.isLoading = false;
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

  onDeletePhoto(id: number) {
    this.alertCtrl
      .create({
        header: "تأكيد الحذف!",
        message: "<strong>هل أنت متأكد من حذف هذه الصورة نهائيا؟</strong>",
        buttons: [
          {
            text: "حذف",
            cssClass: "danger",
            handler: () => {
              this.isLoading = true;
              this.photoService.deletePhoto(id).subscribe(
                () => {
                  this.userDetails.photos.splice(
                    this.userDetails.photos.findIndex(p => p.id === id),
                    1
                  );
                  this.isLoading = false;
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
            text: "إلغاء",
            role: "cancel",
            cssClass: "light"
          }
        ]
      })
      .then(alertEl => {
        alertEl.present();
      });
  }

  ngOnDestroy() {
    if (this.subs) {
      this.subs.unsubscribe();
    }
  }
}
