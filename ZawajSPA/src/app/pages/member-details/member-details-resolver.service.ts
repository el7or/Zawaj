import { LanggService } from './../../shared/services/langg.service';
import { UserDetails } from "./../../shared/models/user-details";
import { Injectable } from "@angular/core";
import {
  Resolve,
  ActivatedRouteSnapshot,
  RouterStateSnapshot,
  Router
} from "@angular/router";
import { Observable, EMPTY, of } from "rxjs";
import { UserService } from "../../shared/services/user.service";
import { catchError, mergeMap } from "rxjs/operators";
import { NbToastrService } from "@nebular/theme";
import { LanggPipe } from '../../shared/pipes/langg.pipe';

@Injectable({
  providedIn: "root"
})
export class MemberDetailsResolverService implements Resolve<UserDetails> {
  constructor(
    private userService: UserService,
    private langgService:LanggService,
    private router: Router,
    private toastrService: NbToastrService
  ) {}

  resolve(
    route: ActivatedRouteSnapshot,
    state: RouterStateSnapshot
  ): Observable<UserDetails> | Observable<never> {
    return this.userService.getUserById(route.paramMap.get("id")).pipe(
      catchError(error => {
        return EMPTY;
      }),
      mergeMap(userDetails => {
        if (userDetails) {
          return of(userDetails);
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
