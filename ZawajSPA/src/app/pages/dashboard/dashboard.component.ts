import { UserList } from "./../../shared/models/user-list";
import { UserService } from "./../../shared/services/user.service";
import { Component, OnInit } from "@angular/core";
import { NbToastrService } from "@nebular/theme";

interface CardSettings {
  title: string;
  iconClass: string;
  type: string;
}

@Component({
  selector: "ngx-dashboard",
  styleUrls: ["./dashboard.component.scss"],
  templateUrl: "./dashboard.component.html"
})
export class DashboardComponent implements OnInit {
  users: UserList[];
  p: number = 1;

  constructor(
    private userService: UserService,
    private toastrService: NbToastrService
  ) {}

  ngOnInit() {
    this.userService.getAllUsers().subscribe(
      res => { this.users = res; }
      /* err => {
        console.log(err);
        this.toastrService.warning('Please refresh page and try again.','Something Wrong!',{ duration:3000 });
      } */
    );
  }

  alert(){
    alert(11111111)
  }
}
