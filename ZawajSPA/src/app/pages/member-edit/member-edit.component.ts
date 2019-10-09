import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';

@Component({
  selector: 'member-edit',
  templateUrl: './member-edit.component.html',
  styleUrls: ['./member-edit.component.scss']
})
export class MemberEditComponent implements OnInit {
  user;
  created:string;
  age:string;
  options = {weekday : 'long' , year :'numeric' , month : 'long',day:'numeric'};
  photoUrl:string;

  constructor(private route: ActivatedRoute) { }

  ngOnInit() {
    this.route.data.subscribe(data => {
      this.user = data.userDetails;
    });
  }

  updateUser(){}
}
