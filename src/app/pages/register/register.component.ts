import { Component } from '@angular/core';
import { AuthService } from '../../services/auth.service';
import { Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { FormsModule, NgForm } from '@angular/forms';

@Component({
  selector: 'app-register',
  imports: [CommonModule, FormsModule],
  templateUrl: './register.component.html',
  styleUrl: './register.component.scss'
})

export class RegisterComponent {
  email: string = '';
  username: string = '';
  password: string = '';
  errorMessage: string = '';

  constructor(private authService: AuthService, private router: Router) {}

  goToHome() {
    this.router.navigateByUrl('/');
  }

  onSubmit(form: NgForm) {
    if (form.invalid) {
      return;
    }
    // Clean error message before
    this.errorMessage = '';

    this.authService.register(this.username, this.email, this.password).subscribe({
      next: (response: any) => {
        // Verify status 201 (created), then redirect to login
        if (response.status === 201) {
          console.log(response.message)
          this.authService.userRegisteredSource.next(true);
          this.router.navigate(['/login']);
        } else {
          console.error('Unexpected response status:', response.status);
        }
      },
    });
  }
}
