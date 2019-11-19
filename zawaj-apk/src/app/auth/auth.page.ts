import { Component } from '@angular/core';
import { UserList, Pagination } from '../shared/models/user-list';
import { Subscription } from 'rxjs';
import { AuthService } from '../shared/services/auth.service';
import { UserService } from '../shared/services/user.service';

@Component({
  selector: 'app-auth',
  templateUrl: './auth.page.html',
  styleUrls: ['./auth.page.scss'],
})
export class AuthPage {
}
