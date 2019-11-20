import { Component } from "@angular/core";
import { Subscription } from "rxjs";

import { UserService } from "./user.service";
import { UserList, Pagination } from "./members.model";
import { IonItemSliding } from '@ionic/angular';

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

  constructor(private userService: UserService) {}

  ionViewWillEnter() {
    this.subs = this.userService
      .getAllUsers(this.pagination.pageNumber++, this.pagination.pageSize)
      .subscribe(
        userPagedList => {
          this.users = userPagedList.users;
          this.pagination = userPagedList.pagination;
        },
        error => {
          console.error(error);
          /* this.toastrService.warning(
            new LanggPipe(this.langgService).transform("Please refresh page and try again."),
            new LanggPipe(this.langgService).transform("Something Wrong!"),
            { duration: 3000 }
          ); */
        }
      );
  }
  ionViewDidLeave() {
    this.subs.unsubscribe();
  }

  onLike(itemSlide:IonItemSliding){
    itemSlide.close();
    console.log('like');
  }

  onMail(itemSlide:IonItemSliding){
    itemSlide.close();
    console.log('mail');
  }
}
