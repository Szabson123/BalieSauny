import { Injectable, ChangeDetectorRef } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';
import { BehaviorSubject, Observable } from 'rxjs';
import { tap } from 'rxjs/operators';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  private baseUrl = 'http://localhost:8000';
  private currentUserSubject: BehaviorSubject<any>;
  public currentUser: Observable<any>;
  

  constructor(
    private http: HttpClient,
     private router: Router
  ) {
    this.currentUserSubject = new BehaviorSubject<any>(localStorage.getItem('access_token'));
    this.currentUser = this.currentUserSubject.asObservable();
  }

  public get currentUserValue(): any {
    return this.currentUserSubject.value;
  }

  login(username: string, password: string) {
    return this.http.post<any>(`${this.baseUrl}/auth/login/`, { username, password }).pipe(
      tap((response) => {
        localStorage.setItem('access_token', response.access);
        localStorage.setItem('refresh_token', response.refresh);
        this.currentUserSubject.next(response.access);
      })
    );
  }

  register(userData: any) {
    return this.http.post<any>(`${this.baseUrl}/auth/register/`, userData);
  }

  logout() {
    this.http.post(`${this.baseUrl}/auth/logout/`, { refresh_token: localStorage.getItem('refresh_token') }).subscribe();
    localStorage.removeItem('access_token');
    localStorage.removeItem('refresh_token');
    this.currentUserSubject.next(null);
    this.router.navigate(['/login']);
  }

  refreshToken() {
    return this.http.post<any>(`${this.baseUrl}/auth/refresh/`, {
      refresh: localStorage.getItem('refresh_token'),
    }).pipe(
      tap((response) => {
        localStorage.setItem('access_token', response.access);
        this.currentUserSubject.next(response.access);
      })
    );
  }
}
