import { UserList } from "../../shared/models/user-list";
import { UserService } from "../../shared/services/user.service";
import { Component, OnInit, AfterViewChecked, AfterViewInit, ChangeDetectorRef } from "@angular/core";
import { ActivatedRoute } from "@angular/router";
import { NbToastrService } from "@nebular/theme";
import { Pagination } from "../../shared/models/pagination";

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
    private route: ActivatedRoute,
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
    let paginationNumbers = document.querySelectorAll(".pagination-page .page-link");
    let paginationNumbersArray = Array.prototype.slice.call(paginationNumbers);
    paginationNumbersArray.forEach(element => {
      if(!isNaN(element.innerHTML))
      element.innerHTML = Number(element.innerHTML).toLocaleString(localStorage.getItem("langg"));
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
}
