import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { BehaviorSubject, map, Observable, tap } from 'rxjs';
import { Router } from '@angular/router';
import { jwtDecode } from 'jwt-decode';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  private apiUrl = 'http://localhost:8080/user'; // Local URL for API

  // Behavior subject for verify user created
  public userRegisteredSource = new BehaviorSubject<boolean>(false);
  userRegistered$ = this.userRegisteredSource.asObservable();

  constructor(private http: HttpClient, private router: Router) {}

  // Login user
  login(email: string, password: string): Observable<any> {
    return this.http.post<{ token: string }>(`${this.apiUrl}/login`, { email, password }).pipe(
    tap(response =>
      localStorage.setItem('token', response.token)
      )
    )};

  // Register user
  register(name: string, email: string, password: string) {
    return this.http.post(`${this.apiUrl}/register`, { name, email, password }, { observe: 'response' });
  }

  getUserInformation(): Observable<any> {
    const token = this.getToken()!!;
    const email = (jwtDecode(token) as any).email;

    const headers = new HttpHeaders().set('Authorization', `Bearer ${token}`);
    return this.http.get(`${this.apiUrl}/get/${email}`, { headers })
  }

  logout(): void {
    const token = localStorage.getItem('token');

    if (!token) {
      console.error('No token found, user may not be logged in.');
      return;
    }

    // Send post with Bearer token
    const headers = new HttpHeaders().set('Authorization', `Bearer ${token}`);

    this.http.post(`${this.apiUrl}/logout`, {}, { headers }).subscribe({
      next: () => {
        localStorage.removeItem('token');
        this.router.navigate(['/login']); // Redirect to login after logout
      },
      error: (err) => {
        console.error('Error during logout:', err.message);
      }
    });
  }

  // Get JWT to user API requests
  getToken(): string | null {
    return localStorage.getItem('token');
  }

  isTokenExpired(): boolean {
    const token = this.getToken();
    if (!token) {
      return true;
    }

    // Decode to get expiration date
    const decoded: any = jwtDecode(token);

    const currentTime = Math.floor(Date.now() / 1000);
    if (decoded.exp < currentTime) {
      return true;
    }

    return false;
  }

  // If token is expired, log out
  checkAuthentication() {
    if (this.isTokenExpired()) {
      this.logout();
    }
  }
}
