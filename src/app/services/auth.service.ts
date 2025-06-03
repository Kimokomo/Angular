import { HttpClient } from '@angular/common/http';
import { tap, catchError, map } from 'rxjs/operators';
import { BehaviorSubject, Observable, of } from 'rxjs';
import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  private tokenKey = 'jwt_token';

  constructor(private http: HttpClient) { }


  // wird im login.component.ts verwendet
  login(username: string, password: string): Observable<boolean> {
    return this.http.post<{ token: string }>('http://localhost:8080/api/auth/login', { username, password }).pipe(
      tap(response => {
        localStorage.setItem(this.tokenKey, response.token);
      }),
      map(() => true),
      catchError(() => {
        localStorage.removeItem(this.tokenKey);
        return of(false);
      })
    );
  }

  // wird in der app.component.ts verwendet
  logout(): void {
    localStorage.removeItem(this.tokenKey);
  }

  // wird in der Guard verwendet
  isAuthenticated(): boolean {
    return !!localStorage.getItem(this.tokenKey);
  }

  // wird beim Interceptor verwendet
  getToken(): string | null {
    return localStorage.getItem(this.tokenKey);
  }

}
