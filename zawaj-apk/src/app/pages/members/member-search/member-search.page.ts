import { AuthService } from './../../../../../../zawaj-spa/src/app/shared/services/auth.service';
import { Component } from "@angular/core";
import { Subscription } from 'rxjs';
import { LoadingController, AlertController, Events } from '@ionic/angular';

import { UserList, Pagination } from '../members.model';
import { UserService } from '../user.service';

@Component({
  selector: "app-member-search",
  templateUrl: "./member-search.page.html",
  styleUrls: ["./member-search.page.scss"]
})
export class MemberSearchPage {
  allUsers: UserList[];
  filteredUsers: UserList[];
  pagination: Pagination = {
    pageNumber: 1,
    pageSize: 99,
    pageCount: null,
    totalItemCount: null
  };
  loadingId: string;
  subs: Subscription;

  constructor(private userService: UserService,
    private loadingCtrl: LoadingController,
    private alertCtrl: AlertController,
    public events:Events) {}

  ionViewWillEnter() {
    this.loadingCtrl
      .create({ keyboardClose: true, message: "جاري التحميل ..." })
      .then(loadingEl => {
        loadingEl.present();
        this.subs = this.userService
          .getAllUsers(this.pagination.pageNumber++, this.pagination.pageSize)
          .subscribe(
            userPagedList => {
              this.allUsers = this.filteredUsers = userPagedList.users;
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

  onTyping(event) {
    this.filteredUsers = this.allUsers;
    const val = event.target.value.toLowerCase();
    if (val && val.trim() != "") {
      this.filteredUsers = this.filteredUsers.filter(user => {
        return user.nickName.toLowerCase().indexOf(val.toLowerCase()) > -1;
      });
    }
  }
}
