import { UserList, UserPagedList } from './../../shared/models/user-list';
import { Injectable } from '@angular/core';
import { Resolve, ActivatedRouteSnapshot, RouterStateSnapshot, Router } from '@angular/router';
import { Observable, EMPTY, of } from 'rxjs';
import { catchError, mergeMap } from 'rxjs/operators';
import { UserService } from '../../shared/services/user.service';
import { NbToastrService } from '@nebular/theme';

@Injectable({
  providedIn: 'root'
})
export class MemberListResolverService implements Resolve<UserPagedList> {

  constructor(private userService:UserService,private router:Router,private toastrService:NbToastrService) { }

  resolve(route: ActivatedRouteSnapshot, state: RouterStateSnapshot):
  Observable<UserPagedList> | Observable<never> {
    return this.userService.getAllUsers().pipe(catchError(error => {
      return EMPTY
   }), mergeMap((userPagedList:UserPagedList) => {
         if (userPagedList) {
            return of(userPagedList)
         } else {
          this.toastrService.warning('Please refresh page and try again.','Something Wrong!',{ duration:3000 });
          this.router.navigate(['/members']);
            return EMPTY;
         }
       })
     )
  }
}
