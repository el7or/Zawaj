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

  addPhoto(id:string,photoFile:File){
    let formData: FormData = new FormData();
    formData.append('url', '');
    formData.append('file', photoFile);
    return this.http.post(this.baseUrl + id,formData);
  }
}
