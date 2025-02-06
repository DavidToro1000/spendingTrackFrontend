import { Injectable } from '@angular/core';
import { CanActivate, Router } from '@angular/router';
import { AuthService } from '../services/auth.service';

@Injectable({
  providedIn: 'root'
})
export class AuthGuard implements CanActivate {
  constructor(private authService: AuthService, private router: Router) {}

  canActivate(): boolean {
    if (this.authService.getToken()) {
      if (this.authService.isTokenExpired()) {
        this.authService.logout();  // If token is expired, then log out
        this.router.navigate(['/login']); // Redirect to log in
        return false;
      }
      return true; // Allow access only if user is authenticated
    } else {
      this.router.navigate(['/login']); // Redirect to log in
      return false;
    }
  }
}
