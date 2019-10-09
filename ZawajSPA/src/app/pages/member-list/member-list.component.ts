import { UserList } from "../../shared/models/user-list";
import { UserService } from "../../shared/services/user.service";
import { Component, OnInit } from "@angular/core";
import { NbToastrService } from "@nebular/theme";
import { ActivatedRoute } from '@angular/router';

@Component({
  selector: "ngx-home",
  styleUrls: ["./member-list.component.scss"],
  templateUrl: "./member-list.component.html"
})
export class MemberListComponent implements OnInit {
  users: UserList[];
  p: number = 1;

  constructor(
    private userService: UserService,
    private route: ActivatedRoute,
    private toastrService: NbToastrService
  ) {}

  ngOnInit() {
    this.route.data
    .subscribe(data => {
      this.users = data.userList;
    });
  }
}
