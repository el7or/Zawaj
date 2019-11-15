import { LanggService } from './../../shared/services/langg.service';
import { AuthService } from "./../../shared/services/auth.service";
import { UserService } from "./../../shared/services/user.service";
import { Component, OnInit, ViewChild, HostListener } from "@angular/core";
import { ActivatedRoute, Router } from "@angular/router";
import { NgForm } from "@angular/forms";
import { SwalComponent } from "@sweetalert2/ngx-sweetalert2";
import { NbToastrService, NbThemeService } from '@nebular/theme';
import { LanggPipe } from '../../shared/pipes/langg.pipe';

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
  themes = [
    {
      value: "default",
      name: "Light"
    },
    {
      value: "dark",
      name: "Dark"
    },
    {
      value: "cosmic",
      name: "Cosmic"
    }
  ];
  currentTheme;
  selectedTheme;
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
    private langgService:LanggService,
    private toastrService:NbToastrService,
     private themeService: NbThemeService
  ) {}

  ngOnInit() {
    this.route.data.subscribe(data => {
      this.userDetails = data.userDetails;
    });
    this.currentTheme = localStorage.getItem('theme')=== null?"default":localStorage.getItem('theme');
      this.changeTheme(this.currentTheme);
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
            new LanggPipe(this.langgService).transform("Please refresh page and try again."),
            new LanggPipe(this.langgService).transform("Something Wrong!"),
            { duration: 3000 }
          );
        }
      );
  }

  changeTheme(themeName: string) {
    localStorage.setItem('theme',themeName);
    this.selectedTheme = this.themes.find(theme=>theme.value==themeName).name;
    this.themeService.changeTheme(themeName);
  }
}