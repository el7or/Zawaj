import { Component } from "@angular/core";
import { ActivatedRoute, Router } from "@angular/router";
import { SegmentChangeEventDetail } from "@ionic/core";
import { AlertController } from "@ionic/angular";

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

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private userService: UserService,
    private alertCtrl: AlertController
  ) {}

  ionViewWillEnter() {
    this.route.paramMap.subscribe(paramMap => {
      if (!paramMap.has("memberId")) {
        this.router.navigate(["/"]);
        return;
      } else {
        const memberId = paramMap.get("memberId");
        this.userService.getUserById(memberId).subscribe(
          member => {
            this.userDetails = member;
          },
          error => {
            console.error(error);
            this.router.navigate(["/"]);
            this.alertCtrl
              .create({
                header: "حدث خطأ ما !",
                message: "الرجاء غلق البرنامج وفتحه مرة أخرى",
                cssClass: "danger",
                buttons: ["حسنا"]
              })
              .then(alertEl => alertEl.present());
          }
        );
      }
    });
  }

  onChangeTab(event: CustomEvent<SegmentChangeEventDetail>) {
    this.tabValue = event.detail.value;
  }
}
