import { Component, OnInit, ChangeDetectorRef } from "@angular/core";
import { UserList } from "../../shared/models/user-list";
import { Pagination } from "../../shared/models/pagination";
import { NbToastrService } from "@nebular/theme";
import { UserService } from "../../shared/services/user.service";

@Component({
  selector: "search",
  templateUrl: "./search.component.html",
  styleUrls: ["./search.component.scss"]
})
export class SearchComponent implements OnInit {
  users: UserList[];
  pagination: Pagination;
  searchParams: any = {};
  isSearch = false;

  constructor(
    private userService: UserService,
    private toastrService: NbToastrService,
    private cdr: ChangeDetectorRef
  ) {}

  ngOnInit() {
    this.searchParams.minAge = 14;
    this.searchParams.maxAge = 99;
    this.searchParams.gender = 0;
    this.searchParams.orderBy = "lastActive";
  }

  ngAfterViewChecked() {
    if (this.pagination) {
      if (this.pagination.totalItemCount > 0) {
        let paginationNumbers = document.querySelectorAll(
          ".pagination-page .page-link"
        );
        let paginationNumbersArray = Array.prototype.slice.call(
          paginationNumbers
        );
        paginationNumbersArray.forEach(element => {
          if (!isNaN(element.innerHTML))
            element.innerHTML = Number(element.innerHTML).toLocaleString(
              localStorage.getItem("langg")
            );
        });
        this.cdr.detectChanges();
      }
    }
  }

  pageChanged(event: any): void {
    this.pagination.pageNumber = event.page;
    this.isSearch = false;
    this.loadUsers();
  }

  loadUsers() {
    let pageNumber:Number = 1;
    let pageSize:Number = 6;
    if (this.pagination!=null) {
      pageNumber = this.isSearch==true?1: this.pagination.pageNumber;
      pageSize = this.pagination.pageSize;
    }
    this.userService
      .searchUsers(this.searchParams, pageNumber, pageSize)
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

  resetFilter() {
    this.searchParams.minAge = 18;
    this.searchParams.maxAge = 99;
    this.searchParams.gender = 0;
    this.searchParams.orderBy = "lastActive";
    this.users = null;
    this.pagination = null;
  }
}
