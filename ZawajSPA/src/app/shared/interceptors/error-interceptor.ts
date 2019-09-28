import { Injectable } from "@angular/core";
import { HttpInterceptor, HttpHandler, HttpEvent, HttpRequest, HttpErrorResponse, HTTP_INTERCEPTORS } from "@angular/common/http";
import { Observable, throwError } from "rxjs";
import { catchError } from "rxjs/operators";
import { NbToastrService } from '@nebular/theme';
@Injectable()
export class ErrorInterceptor implements HttpInterceptor{
    constructor(private toastrService: NbToastrService) {
    }
      intercept(req:HttpRequest<any>,next:HttpHandler):Observable<HttpEvent<any>>{
        return next.handle(req).pipe(
            catchError(error => {
                if(error instanceof HttpErrorResponse){
                    const applicationError = error.headers.get('Application-Error');
                    if(applicationError){
                        console.error(applicationError);
                        return throwError(applicationError);
                    }
                    
                    //Unauthorized errors
                    if(error.status===401){
                        return throwError(error.statusText);
                    }

                    ///ModelState Errors
                    const serverError = error.error;
                    let modelStateErrors ='';
                    if(serverError && typeof serverError==='object'){
                        for (const key in serverError) {
                            if(serverError[key]){
                                modelStateErrors += serverError[key] + '\n';
                            }
                        }
                    }
                    console.error(modelStateErrors);
                    this.toastrService.warning('Please refresh page and try again.','Something Wrong!',{ duration:3000 });
                    return throwError(modelStateErrors || serverError || 'Server Error')
                }


            })
        )
    }
}
export const ErrorInterceptorProvidor={
    provide:HTTP_INTERCEPTORS,
    useClass:ErrorInterceptor,
    multi:true
}