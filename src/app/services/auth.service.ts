import { HttpClient } from '@angular/common/http';
import { tap, catchError, map } from 'rxjs/operators';
import { BehaviorSubject, Observable, of } from 'rxjs';
import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private tokenKey = 'jwt_token';

  private userInfoSubject = new BehaviorSubject<{ username: string; role: string } | null>(null);
  userInfo$ = this.userInfoSubject.asObservable();



  constructor(private http: HttpClient) {
    // Beim Service-Start: Wenn Token da, lade Userinfo
    if (this.isAuthenticated()) {
      this.loadUserInfo();
    }
  }

  private loadUserInfo() {
    this.http.get<{ username: string; role: string }>('http://localhost:8080/api/auth/userinfo').pipe(
      tap(info => {
        this.userInfoSubject.next(info);
      }),
      catchError(() => {
        this.userInfoSubject.next(null);
        return of(null);
      })
    ).subscribe();
  }

  login(username: string, password: string): Observable<boolean> {
    return this.http.post<{ token: string }>('http://localhost:8080/api/auth/login', { username, password }).pipe(
      tap(response => {
        localStorage.setItem(this.tokenKey, response.token);
        this.loadUserInfo();  // Userinfo aktualisieren nach Login
      }),
      map(() => true),
      catchError(() => {
        localStorage.removeItem(this.tokenKey);
        this.userInfoSubject.next(null);
        return of(false);
      })
    );
  }

  getUserInfo(): Observable<{ username: string; role: string }> {
    // hole Userinfo vom Backend
    return this.http.get<{ username: string; role: string }>('http://localhost:8080/api/auth/userinfo');
  }


  register(username: string, password: string): Observable<boolean> {
    return this.http.post<{ message: string }>('http://localhost:8080/api/auth/register', {
      username,
      password
    }).pipe(
      map(() => true),
      catchError(() => of(false))
    );
  }


  logout(): void {
    localStorage.removeItem(this.tokenKey);
    this.userInfoSubject.next(null);  // Userinfo zurücksetzen beim Logout
  }

  isAuthenticated(): boolean {
    return !!localStorage.getItem(this.tokenKey);
  }

  getToken(): string | null {
    return localStorage.getItem(this.tokenKey);
  }


}
