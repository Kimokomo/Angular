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



  constructor(private http: HttpClient) { }


  login(username: string, password: string): Observable<boolean> {
    return this.http.post<{ token: string }>('http://localhost:8080/api/auth/login', { username, password }).pipe(
      tap(response => {
        localStorage.setItem(this.tokenKey, response.token);
      }),
      map(() => true),
      catchError(() => {
        localStorage.removeItem(this.tokenKey);
        this.userInfoSubject.next(null);
        return of(false);
      })
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
