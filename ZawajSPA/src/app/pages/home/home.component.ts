import { UserList } from "../../shared/models/user-list";
import { UserService } from "../../shared/services/user.service";
import { Component, OnInit } from "@angular/core";
import { NbToastrService } from "@nebular/theme";

@Component({
  selector: "ngx-home",
  styleUrls: ["./home.component.scss"],
  templateUrl: "./home.component.html"
})
export class HomeComponent implements OnInit {
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
