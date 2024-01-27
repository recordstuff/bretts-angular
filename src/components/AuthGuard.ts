import { Injectable } from "@angular/core";
import { Router } from "@angular/router";
import { JwtUtil } from "../services/JwtUtil";

@Injectable({providedIn: 'root'})
export class AuthGuard {
  constructor(private router: Router, private jwtUtil: JwtUtil) {
    
  }  
  canActivate() {
    if (!this.jwtUtil.isExpired) {
        return true;
    }
    
    return this.router.parseUrl('/login');
  }
}