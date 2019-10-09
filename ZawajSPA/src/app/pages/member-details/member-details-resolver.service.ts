import { UserDetails } from "./../../shared/models/user-details";
import { Injectable } from "@angular/core";
import {
  Resolve,
  ActivatedRouteSnapshot,
  RouterStateSnapshot,
  Router
} from "@angular/router";
import { Observable, EMPTY, of } from "rxjs";
import { UserService } from '../../shared/services/user.service';
import { catchError, mergeMap } from 'rxjs/operators';
import { NbToastrService } from '@nebular/theme';

@Injectable({
  providedIn: "root"
})
export class MemberDetailsResolverService implements Resolve<UserDetails> {
  
  constructor(private userService:UserService,private router:Router,private toastrService:NbToastrService) {}

  resolve(route: ActivatedRouteSnapshot, state: RouterStateSnapshot):
  Observable<UserDetails> | Observable<never> {
    return this.userService.getUserById(route.paramMap.get('id')).pipe(catchError(error => {
      return EMPTY
   }), mergeMap(userDetails => {
         if (userDetails) {
            return of(userDetails)
         } else {
          this.toastrService.warning('Please refresh page and try again.','Something Wrong!',{ duration:3000 });
          this.router.navigate(['/members']);
            return EMPTY;
         }
       })
     )
  }
}
