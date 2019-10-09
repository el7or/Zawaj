import { Component, OnInit, ViewChild, HostListener } from "@angular/core";
import { ActivatedRoute } from "@angular/router";
import { NgForm } from '@angular/forms';
import { SwalComponent } from '@sweetalert2/ngx-sweetalert2';

@Component({
  selector: "member-edit",
  templateUrl: "./member-edit.component.html",
  styleUrls: ["./member-edit.component.scss"]
})
export class MemberEditComponent implements OnInit {
  @ViewChild('editForm',{static:false}) editForm: NgForm;
  @ViewChild("unsavedSwal", { static: false }) unsavedSwal: SwalComponent;
  userDetails;
  created: string;
  age: string;
  options = { weekday: "long", year: "numeric", month: "long", day: "numeric" };
  photoUrl: string;
  @HostListener('window:beforeunload',['$event'])
 unLoadNotification($event:any){
   if(this.editForm.dirty){
     $event.returnValue=true;
   }
 }

  constructor(private route: ActivatedRoute) {}

  ngOnInit() {
    this.route.data.subscribe(data => {
      this.userDetails = data.userDetails;
    });
  }

  updateUser() {
    /* this.userService
      .updateUser(this.authService.decodedToken.nameid, this.user)
      .subscribe(
        () => {
          this.alertify.success("تم تعديل الملف الشخصي بنجاح");
          this.editForm.reset(this.user);
        },
        error => this.alertify.error(error)
      ); */
  }
}
