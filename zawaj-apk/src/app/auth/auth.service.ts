import { Router } from '@angular/router';
import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private _isAuthenticated:boolean = true;
  
  public get isAuthenticated() : boolean {
    return this._isAuthenticated;
  }  

  constructor(private router:Router) { }

  login(){
    this._isAuthenticated = true;
this.router.navigateByUrl('/');
  }

  logout(){
    this._isAuthenticated=false;
    this.router.navigateByUrl('/auth');
  }
}
