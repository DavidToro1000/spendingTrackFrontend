import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-home-page',
  imports: [CommonModule],
  templateUrl: './home-page.component.html',
  styleUrl: './home-page.component.scss'
})
export class HomePageComponent {
  constructor(private router: Router) {}

  goToLogin() {
    this.router.navigateByUrl('/login');
  }

  goToRegister() {
    this.router.navigateByUrl('/register');
  }
}
