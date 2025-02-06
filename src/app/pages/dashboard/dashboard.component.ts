import { Component } from '@angular/core';
import { AuthService } from '../../services/auth.service';
import { Router } from '@angular/router';
import { jwtDecode } from 'jwt-decode';
import { tap } from 'rxjs/operators';

@Component({
  selector: 'app-dashboard',
  imports: [],
  templateUrl: './dashboard.component.html',
  styleUrl: './dashboard.component.scss'
})
export class DashboardComponent {
    username: string = '';
    token: string = '';
  
    constructor(private authService: AuthService, private router: Router) {}
  
    ngOnInit() {
      //get username from token
      this.authService.getUserInformation().subscribe({
        next: (response) => {
          console.log(response);
          this.username = response.user.name
        },
        error: (err) => {
          console.error('Login failed', err);
        }
      });
    }

    logOut() {
      const confirmLogout = confirm("Are you sure you want to log out?");
      if (!confirmLogout) {
        return
      }
      this.authService.logout();
    }
}
