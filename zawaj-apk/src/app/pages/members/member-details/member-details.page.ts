import { Component } from '@angular/core';
import { UserDetails } from 'src/app/shared/models/user-details';
import { ActivatedRoute, Router } from '@angular/router';
import { UserService } from 'src/app/shared/services/user.service';

@Component({
  selector: 'app-member-details',
  templateUrl: './member-details.page.html',
  styleUrls: ['./member-details.page.scss'],
})
export class MemberDetailsPage {
  userDetails: UserDetails;

  constructor(
    private route: ActivatedRoute,
    private router:Router,
    private userService: UserService
  ) { }

  ionViewWillEnter(){
    this.route.paramMap.subscribe(paramMap => {
      if (!paramMap.has("memberId")) {
        this.router.navigate(['/home'])
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
