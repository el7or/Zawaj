import { LanggService } from './../../shared/services/langg.service';
import { AuthService } from "./../../shared/services/auth.service";
import { LikeUser } from "./../../shared/models/like-user";
import { UserList } from "../../shared/models/user-list";
import { UserService } from "../../shared/services/user.service";
import {
  Component,
  OnInit,
  AfterViewChecked,
  ChangeDetectorRef
} from "@angular/core";
import { ActivatedRoute, Router } from "@angular/router";
import { NbToastrService } from "@nebular/theme";
import { Pagination } from "../../shared/models/pagination";
import { LikeService } from "../../shared/services/like.service";
import { LanggPipe } from '../../shared/pipes/langg.pipe';

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
    private langgService:LanggService,
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
      if (!isNaN(element.innerHTML) && localStorage.getItem("langg")=='ar') {        
        element.innerHTML = Number(element.innerHTML).toLocaleString(
          localStorage.getItem("langg")
        );
      }
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
            new LanggPipe(this.langgService).transform("Please refresh page and try again."),
            new LanggPipe(this.langgService).transform("Something Wrong!"),
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
            new LanggPipe(this.langgService).transform("Added to likes list successfully."),
            new LanggPipe(this.langgService).transform("Success!"),
            { duration: 3000 }
          );
        },
        error => {
          console.error(error);
          this.toastrService.warning(
            new LanggPipe(this.langgService).transform("Please refresh page and try again."),
            new LanggPipe(this.langgService).transform("Something Wrong!"),
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
            new LanggPipe(this.langgService).transform("Removed from likes list successfully."),
            new LanggPipe(this.langgService).transform("Success!"),
            { duration: 3000 }
          );
        },
        error => {
          console.error(error);
          this.toastrService.warning(
            new LanggPipe(this.langgService).transform("Please refresh page and try again."),
            new LanggPipe(this.langgService).transform("Something Wrong!"),
            { duration: 3000 }
          );
        }
      );
    }
  }
}
