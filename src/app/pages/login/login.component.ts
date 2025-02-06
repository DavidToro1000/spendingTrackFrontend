import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { FormsModule, NgForm } from '@angular/forms';
import { AuthService } from '../../services/auth.service';
import { HttpClient } from '@angular/common/http';

@Component({
  selector: 'app-login',
  standalone: true,
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss'],
  imports: [CommonModule, FormsModule]
})
export class LoginComponent implements OnInit{
  email: string = '';
  password: string = '';
  errorMessage: string = '';
  userRegistered: boolean = false;

  constructor(private authService: AuthService, private router: Router) {}

  ngOnInit() {
    // When register emit user registered, then message should appear in login page
    this.authService.userRegistered$.subscribe((isRegistered) => {
      this.userRegistered = isRegistered;
    });
  }

  ngOnDestroy() {
    // Reset userRegistered status because the message should only appears once
    this.authService.userRegisteredSource.next(false);
  }

  goToHome() {
    this.router.navigateByUrl('/');
  }

  onSubmit(form: NgForm) {
    if (form.invalid) {
      return;
    }
    // Clean error message before
    this.errorMessage = '';

    this.authService.login(this.email, this.password).subscribe({
      next: (response) => {
        console.log('Login successful', response);
        this.router.navigateByUrl('/dashboard');
      },
      error: (err) => {
        this.errorMessage = err.error
        console.error('Login failed', err);
      },
    });
  }
}