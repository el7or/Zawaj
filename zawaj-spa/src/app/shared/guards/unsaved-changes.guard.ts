import { MemberEditComponent } from "./../../pages/member-edit/member-edit.component";
import { Injectable } from "@angular/core";
import {
  ActivatedRouteSnapshot,
  RouterStateSnapshot,
  UrlTree,
  CanDeactivate,
  Router
} from "@angular/router";
import { Observable } from "rxjs";

@Injectable({
  providedIn: "root"
})
export class UnsavedChangesGuard implements CanDeactivate<MemberEditComponent> {
  isCanDeactivate: boolean = false;

  constructor(private router: Router) {}

  canDeactivate(
    editComponent: MemberEditComponent,
    currentRoute: ActivatedRouteSnapshot,
    currentState: RouterStateSnapshot,
    nextState?: RouterStateSnapshot
  ): Observable<boolean> | Promise<boolean> | boolean {
    if (!this.isCanDeactivate) {
      if (editComponent.editForm.dirty) {
        this.isCanDeactivate = false;
        editComponent.unsavedSwal.fire().then(result => {
          if (result.value) {
            this.isCanDeactivate = true;
            this.router.navigate([nextState.url]);
          } else {
            this.isCanDeactivate = false;
          }
        });
        return this.isCanDeactivate;
      }
    }
    return true;
  }
}
