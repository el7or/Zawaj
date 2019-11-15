import { LanggService } from './../../shared/services/langg.service';
import { UserList, UserPagedList } from "./../../shared/models/user-list";
import { Injectable } from "@angular/core";
import {
  Resolve,
  ActivatedRouteSnapshot,
  RouterStateSnapshot,
  Router
} from "@angular/router";
import { Observable, EMPTY, of } from "rxjs";
import { catchError, mergeMap } from "rxjs/operators";
import { UserService } from "../../shared/services/user.service";
import { NbToastrService } from "@nebular/theme";
import { LanggPipe } from '../../shared/pipes/langg.pipe';

@Injectable({
  providedIn: "root"
})
export class MemberListResolverService implements Resolve<UserPagedList> {
  constructor(
    private userService: UserService,
    private langgService:LanggService,
    private router: Router,
    private toastrService: NbToastrService
  ) {}

  resolve(
    route: ActivatedRouteSnapshot,
    state: RouterStateSnapshot
  ): Observable<UserPagedList> | Observable<never> {
    return this.userService.getAllUsers().pipe(
      catchError(error => {
        return EMPTY;
      }),
      mergeMap((userPagedList: UserPagedList) => {
        if (userPagedList) {
          return of(userPagedList);
        } else {
          this.toastrService.warning(
            new LanggPipe(this.langgService).transform("Please refresh page and try again."),
            new LanggPipe(this.langgService).transform("Something Wrong!"),
            { duration: 3000 }
          );
          this.router.navigate(["/members"]);
          return EMPTY;
        }
      })
    );
  }
}
