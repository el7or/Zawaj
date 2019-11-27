import { Component } from "@angular/core";
import { ActivatedRoute, Router } from "@angular/router";
import { SegmentChangeEventDetail } from "@ionic/core";
import { AlertController, LoadingController } from "@ionic/angular";

import { UserService } from "../user.service";
import { UserDetails } from "./member-details.model";

@Component({
  selector: "app-member-details",
  templateUrl: "./member-details.page.html",
  styleUrls: ["./member-details.page.scss"]
})
export class MemberDetailsPage {
  userDetails: UserDetails;
  tabValue: string = "basic";
  isLoading = false;
  userDetailsPhotoURL:string;

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private userService: UserService,
    private alertCtrl: AlertController,
    private loadingCtrl: LoadingController
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
            this.userService.getUserById(memberId).subscribe(
              member => {
                this.userDetails = member;
                this.userDetailsPhotoURL= this.userDetails.photoURL;
                this.isLoading = false;
                loadingEl.dismiss();
              },
              error => {
                console.error(error);
                this.router.navigate(["/"]);
                this.alertCtrl
                  .create({
                    header: "حدث خطأ ما !",
                    message : '<ion-icon name="warning"></ion-icon> الرجاء التأكد من اتصال الإنترنت وإعادة المحاولة <ion-icon name="warning"></ion-icon>',
                    cssClass: "danger",
                    buttons: [{text:"حسنا", handler:() =>{
                      this.router.navigateByUrl('/');
                    }}]
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
}
