import { Component } from '@angular/core';
import { UserList, Pagination } from 'src/app/shared/models/user-list';
import { Subscription } from 'rxjs';
import { AuthService } from 'src/app/shared/services/auth.service';
import { UserService } from 'src/app/shared/services/user.service';

@Component({
  selector: 'app-members',
  templateUrl: './members.page.html',
  styleUrls: ['./members.page.scss'],
})
export class MembersPage {
  users: UserList[];
  pagination: Pagination = {
    pageNumber:1,
    pageSize:12,
    pageCount:null,
    totalItemCount:null
  };
  subs:Subscription

  constructor(
    public authService: AuthService,
    private userService: UserService ) {}

  ionViewWillEnter(){
    if(this.authService.isAuthenticated){
    this.subs= this.userService
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
  }
  ionViewDidLeave(){
    this.subs.unsubscribe();
  }
}
