import { Subscription } from 'rxjs';
import { UserService } from "../shared/services/user.service";
import { Component, OnInit, OnDestroy } from "@angular/core";
import { AuthService } from "../shared/services/auth.service";
import { UserList, Pagination } from "../shared/models/user-list";

@Component({
  selector: "app-home",
  templateUrl: "home.page.html",
  styleUrls: ["home.page.scss"]
})
export class HomePage implements OnInit, OnDestroy {
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
    private userService: UserService  ) {}

  ngOnInit() {
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
  
  ngOnDestroy(){
    this.subs.unsubscribe();
  }
}
