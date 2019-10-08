import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';

@Component({
  selector: 'member-details',
  templateUrl: './member-details.component.html',
  styleUrls: ['./member-details.component.scss']
})
export class MemberDetailsComponent implements OnInit {

  constructor(private route: ActivatedRoute) { }
userDetails;
showIntro:boolean=true;
showLook:boolean=true;
  ngOnInit() {
    this.userDetails = this.route.snapshot.params['id'];
  }


  deselect(){
      }

}
