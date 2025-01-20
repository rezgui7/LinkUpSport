import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { catchError, Observable, tap, throwError } from 'rxjs';
import { User } from '../../models/User';
import { JwtHelperService } from '@auth0/angular-jwt';


const API_URL = 'http://localhost:8085/auth/';

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  private readonly apiUrl = 'http://localhost:8085/auth'; 
  private readonly TOKEN_KEY = 'auth-token';
  private readonly USER_KEY = 'auth-user';
  private helper = new JwtHelperService();
  public role!: string;
  public loggedUser!: string;

  constructor(private http: HttpClient, private router: Router) { }

  /**Login**/
  login(credentials: { email: string; password: string }): Observable<any> {
    return this.http.post<any>(`${this.apiUrl}/signin`, credentials).pipe(
      tap((response: any) => {
        if (response.token) {
          sessionStorage.setItem(this.TOKEN_KEY, response.token);
          sessionStorage.setItem(this.USER_KEY, JSON.stringify(response));
        }
      }),
      catchError((error) => {
        console.error('Login error:', error);
        return throwError(() => new Error('Failed to login. Please check your credentials.'));
      })
    );
  }
  
  

  /*Register*/
  register(user: { 
    username: string; 
    email: string; 
    password: string; 
    address: string; 
  
    phoneNumber: string; 
    pictureUrl?: string; 
    role: string; 
  }): Observable<any> {
    const headers = new HttpHeaders({ 'Content-Type': 'application/json' });
    return this.http.post<any>(`${this.apiUrl}/signup`, user, { headers }).pipe(
      catchError((error) => {
        console.error('Registration error:', error);
        return throwError(() => new Error('Failed to register. Please try again later.'));
      })
    );
  }
  

  

logout(): void {
  sessionStorage.clear();
  this.router.navigate(['/user/login']); 
}

  /* JWT f session */
  private saveToken(token: string): void {
    sessionStorage.setItem(this.TOKEN_KEY, token);
  }

  /**info mtaa l user f  session */
  private saveUser(user: any): void {
    sessionStorage.setItem(this.USER_KEY, JSON.stringify(user));
  }

 
  getToken(): string | null {
    return sessionStorage.getItem(this.TOKEN_KEY);
  }

  
  getUser(): any {
    try {
      const user = sessionStorage.getItem(this.USER_KEY);
      return user ? JSON.parse(user) : null;
    } catch (e) {
      console.error('Error parsing user data:', e);
      return null;
    }
  }
  
  //
  isLoggedIn(): boolean {
    const token = this.getToken();
    if (token) {
      const expiry = (JSON.parse(atob(token.split('.')[1]))).exp * 1000;
      return Date.now() < expiry;
    }
    return false;
  }
  getCurrentSession(): Observable<User> {
    return this.http.get<User>(`${this.apiUrl}/current-session`).pipe(
      catchError((error) => {
        console.error('Error fetching current session:', error);
        return throwError(() => new Error('Failed to fetch current session.'));
      })
    );
  }
  decodeJWT(token: any) {
    if (token == undefined)
      return;
    const decodedToken = this.helper.decodeToken(token);
    this.role = decodedToken.role;
    this.loggedUser = decodedToken.sub;
  }
  
}
