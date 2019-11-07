import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class PaymentService {
  baseUrl = environment.API_URL + "payment/";
  paid:boolean=false;

  constructor(private http: HttpClient) { }

  charge(userId:string,stripeToken:string){
    return this.http.post(this.baseUrl + 'charge' , {userId:userId,stripeToken:stripeToken});
  }

  getPaymentForUser(userId:string){
    return this.http.get(this.baseUrl + userId);
  }
}
