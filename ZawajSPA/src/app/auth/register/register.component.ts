import { NgForm } from '@angular/forms';
import { Component, ViewChild } from '@angular/core';
import { NbRegisterComponent } from '@nebular/auth';

@Component({
  selector: 'ngx-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.scss'],
})
export class RegisterComponent extends NbRegisterComponent {
  @ViewChild('form', {static: false}) form: NgForm;

  register() {
    console.log(this.form.value);
  }

}
