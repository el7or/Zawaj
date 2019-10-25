import { AuthService } from "./../../shared/services/auth.service";
import { LikeUser } from "./../../shared/models/like-user";
import { UserList } from "../../shared/models/user-list";
import { UserService } from "../../shared/services/user.service";
import {
  Component,
  OnInit,
  AfterViewChecked,
  AfterViewInit,
  ChangeDetectorRef
} from "@angular/core";
import { ActivatedRoute, Router } from "@angular/router";
import { NbToastrService } from "@nebular/theme";
import { Pagination } from "../../shared/models/pagination";
import { LikeService } from "../../shared/services/like.service";

@Component({
  selector: "ngx-home",
  styleUrls: ["./member-list.component.scss"],
  templateUrl: "./member-list.component.html"
})
export class MemberListComponent implements OnInit, AfterViewChecked {
  users: UserList[];
  pagination: Pagination;

  constructor(
    private userService: UserService,
    private authService: AuthService,
    private likeService: LikeService,
    private route: ActivatedRoute,
    private router: Router,
    private toastrService: NbToastrService,
    private cdr: ChangeDetectorRef
  ) {}

  ngOnInit() {
    this.route.data.subscribe(data => {
      this.users = data.userPagedList.users;
      this.pagination = data.userPagedList.pagination;
    });
  }

  ngAfterViewChecked() {
    let paginationNumbers = document.querySelectorAll(
      ".pagination-page .page-link"
    );
    let paginationNumbersArray = Array.prototype.slice.call(paginationNumbers);
    paginationNumbersArray.forEach(element => {
      if (!isNaN(element.innerHTML))
        element.innerHTML = Number(element.innerHTML).toLocaleString(
          localStorage.getItem("langg")
        );
    });
    this.cdr.detectChanges();
  }

  pageChanged(event: any): void {
    this.pagination.pageNumber = event.page;
    this.userService
      .getAllUsers(this.pagination.pageNumber, this.pagination.pageSize)
      .subscribe(
        userPagedList => {
          this.users = userPagedList.users;
          this.pagination = userPagedList.pagination;
        },
        error => {
          console.error(error);
          this.toastrService.warning(
            "Please refresh page and try again.",
            "Something Wrong!",
            { duration: 3000 }
          );
        }
      );
  }

  like(likeToUserId: string) {
    if (!this.authService.isAuthenticated()) {
      this.authService.redirectUrl = this.router.url;
      this.router.navigate(["/auth/login"]);
    } else {
      let newLike: LikeUser = {
        likeFromUserId: this.authService.currentUserId,
        likeToUserId: likeToUserId
      };
      this.likeService.postLike(newLike).subscribe(
        () => {
          this.toastrService.danger(
            "Added to likes list successfully.",
            "Success!",
            { duration: 3000 }
          );
        },
        error => {
          console.error(error);
          this.toastrService.warning(
            "Please refresh page and try again.",
            "Something Wrong!",
            { duration: 3000 }
          );
        }
      );
    }
  }

  dislike(likeToUserId: string) {
    if (!this.authService.isAuthenticated()) {
      this.authService.redirectUrl = this.router.url;
      this.router.navigate(["/auth/login"]);
    } else {
      let deletedLike: LikeUser = {
        likeFromUserId: this.authService.currentUserId,
        likeToUserId: likeToUserId
      };
      this.likeService.deleteLike(deletedLike).subscribe(
        () => {
          this.toastrService.danger(
            "Removed from likes list successfully.",
            "Success!",
            { duration: 3000 }
          );
        },
        error => {
          console.error(error);
          this.toastrService.warning(
            "Please refresh page and try again.",
            "Something Wrong!",
            { duration: 3000 }
          );
        }
      );
    }
  }
}
