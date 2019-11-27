import { environment } from '../../../../environments/environment';
import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class PhotoService {
  baseUrl = environment.API_URL + "photos/";

  constructor(private http: HttpClient) {}

  setMainPhoto(id:number){
    return this.http.get(this.baseUrl + 'setMain/' + id);
  }

  deletePhoto(id:number){
    return this.http.delete(this.baseUrl + id);
  }
}
