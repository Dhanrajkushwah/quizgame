import { Injectable } from '@angular/core';
import { CanActivate, Router } from '@angular/router';
import { LoginService } from './login.service';

@Injectable({
  providedIn: 'root'
})
export class AdminGuard implements CanActivate {

    constructor(private loginService: LoginService, private router: Router) { }

    canActivate(): boolean {
      const role = this.loginService.getUserRole();
      if (role === 'admin') {
        return true; // Allow access to admin routes
      } else {
        this.router.navigate(['/unauthorized']); // Redirect if not admin
        return false;
      }
    }
}