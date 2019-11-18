import { UserDetails } from "./../../../../zawaj-spa/src/app/shared/models/user-details";
import { UserService } from "../shared/services/user.service";
import { ActivatedRoute } from "@angular/router";
import { Component, OnInit } from "@angular/core";

@Component({
  selector: "app-member-details",
  templateUrl: "./member-details.page.html",
  styleUrls: ["./member-details.page.scss"]
})
export class MemberDetailsPage implements OnInit {
  userDetails: UserDetails;

  constructor(
    private route: ActivatedRoute,
    private userService: UserService
  ) { }

  ngOnInit() {
    this.route.paramMap.subscribe(paramMap => {
      if (!paramMap.has("memberId")) {
        return;
      } else {
        const memberId = paramMap.get("memberId");
        this.userService.getUserById(memberId).subscribe(
          member => { this.userDetails = member; },
          error => {
            console.error(error);
            /* this.toastrService.warning(
              new LanggPipe(this.langgService).transform(
                "Please refresh page and try again."
              ),
              new LanggPipe(this.langgService).transform("Something Wrong!"),
              { duration: 3000 }
            ); */
          }
        );
      }
    });
  }
}
