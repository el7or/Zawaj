import { UserDetails } from './../../shared/models/user-details';
import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';

@Component({
  selector: 'member-details',
  templateUrl: './member-details.component.html',
  styleUrls: ['./member-details.component.scss']
})
export class MemberDetailsComponent implements OnInit {

  constructor(private route: ActivatedRoute) { }
userDetails:UserDetails;
showIntro:boolean=true;
showLook:boolean=true;
  ngOnInit() {
    this.route.data
    .subscribe(data => {
      this.userDetails = data.userDetails;
    });
  }

  deselect(){
      }

}
