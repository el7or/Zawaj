import { BehaviorSubject, Subscription } from 'rxjs';
import { NgForm } from '@angular/forms';
import { Component, OnInit, ViewChild, OnDestroy } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { AlertController, LoadingController, ToastController } from '@ionic/angular';
import { SegmentChangeEventDetail } from '@ionic/core';

import { UserDetails } from '../member-details/member-details.model';
import { UserService } from '../user.service';
import { AuthService } from 'src/app/auth/auth.service';

@Component({
  selector: 'app-member-edit',
  templateUrl: './member-edit.page.html',
  styleUrls: ['./member-edit.page.scss'],
})
export class MemberEditPage implements OnDestroy {
  @ViewChild('editForm', {static: false}) editForm: NgForm;
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
    private toastCtrl:ToastController
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

  onUpdateProfile(form:NgForm){
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
            this.toastCtrl.create({
              message: '<ion-icon name="checkmark" size="large"></ion-icon> تم حفظ التعديلات بنجاح <ion-icon name="checkmark" size="large"></ion-icon>',
              duration: 3000,
              color: 'success'
            }).then(toastEl=>toastEl.present());
            this.router.navigateByUrl("/");
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

  ngOnDestroy(){
    this.subs.unsubscribe();
  }
}
