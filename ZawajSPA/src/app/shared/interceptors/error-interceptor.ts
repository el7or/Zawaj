import { LanggService } from "./../services/langg.service";
import { Injectable } from "@angular/core";
import {
  HttpInterceptor,
  HttpHandler,
  HttpEvent,
  HttpRequest,
  HttpErrorResponse,
  HTTP_INTERCEPTORS
} from "@angular/common/http";
import { Observable, throwError } from "rxjs";
import { catchError } from "rxjs/operators";
import { NbToastrService } from "@nebular/theme";
import { LanggPipe } from '../pipes/langg.pipe';
@Injectable()
export class ErrorInterceptor implements HttpInterceptor {
  constructor(
    private toastrService: NbToastrService,
    private langgService: LanggService
  ) {}
  intercept(
    req: HttpRequest<any>,
    next: HttpHandler
  ): Observable<HttpEvent<any>> {
    return next.handle(req).pipe(
      catchError(error => {
        debugger;
        if (error instanceof HttpErrorResponse) {
          const applicationError = error.headers.get("Application-Error");
          if (applicationError) {
            console.error(applicationError);
            return throwError(applicationError);
          }

          //Unauthorized errors
          if (error.status === 401) {
            console.error(error);
            return throwError(error.statusText);
          }

          //Duplicate UserName error
          if (error.error.filter(err => err.code == "DuplicateUserName")) {
            console.error(error.error);
            return throwError("DuplicateUserName");
          }

          ///ModelState Errors
          const serverError = error.error;
          let modelStateErrors = "";
          if (serverError && typeof serverError === "object") {
            for (const key in serverError) {
              if (serverError[key]) {
                modelStateErrors += serverError[key] + "\n";
              }
            }
          }
          console.error(modelStateErrors);
          this.toastrService.warning(
            new LanggPipe(this.langgService).transform("Please refresh page and try again."),
            new LanggPipe(this.langgService).transform("Something Wrong!"),
            { duration: 3000 }
          );
          return throwError(modelStateErrors || serverError || "Server Error");
        }
      })
    );
  }
}
export const ErrorInterceptorProvidor = {
  provide: HTTP_INTERCEPTORS,
  useClass: ErrorInterceptor,
  multi: true
};
