import { AuthService } from "./../../shared/services/auth.service";
import { UserService } from "./../../shared/services/user.service";
import { Component, OnInit, ViewChild, HostListener } from "@angular/core";
import { ActivatedRoute, Router } from "@angular/router";
import { NgForm } from "@angular/forms";
import { SwalComponent } from "@sweetalert2/ngx-sweetalert2";
import { NbToastrService } from '@nebular/theme';

@Component({
  selector: "member-edit",
  templateUrl: "./member-edit.component.html",
  styleUrls: ["./member-edit.component.scss"]
})
export class MemberEditComponent implements OnInit {
  @ViewChild("editForm", { static: false }) editForm: NgForm;
  @ViewChild("unsavedSwal", { static: false }) unsavedSwal: SwalComponent;
  @ViewChild("doneSwal", { static: false }) doneSwal: SwalComponent;
  userDetails;
  created: string;
  age: string;
  options = { weekday: "long", year: "numeric", month: "long", day: "numeric" };
  photoUrl: string;
  @HostListener("window:beforeunload", ["$event"])
  unLoadNotification($event: any) {
    if (this.editForm.dirty) {
      $event.returnValue = true;
    }
  }

  constructor(
    private route: ActivatedRoute,
    private router:Router,
    private userService: UserService,
    private authService: AuthService,
    private toastrService:NbToastrService
  ) {}

  ngOnInit() {
    this.route.data.subscribe(data => {
      this.userDetails = data.userDetails;
    });
  }

  updateUser() {
    this.userService
      .putUser(this.authService.currentUserId, this.userDetails)
      .subscribe(
        () => {
          this.editForm.reset(this.userDetails);
          this.doneSwal.fire().then(()=>this.router.navigate(['/pages/members']));
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