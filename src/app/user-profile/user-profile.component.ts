import { HttpClient } from '@angular/common/http';
import { Component } from '@angular/core';
import { UserInfo } from '../models/userinfo';
import { CommonModule } from '@angular/common';
import { environment } from '../../environments/environment';
import { AuthService } from '../services/auth.service';
import { Router } from '@angular/router';
import { TimeFormatPipe } from '../pipes/time-format.pipe';

@Component({
  selector: 'app-user-profile',
  standalone: true,
  imports: [CommonModule,
    TimeFormatPipe
  ],
  templateUrl: './user-profile.component.html',
  styleUrl: './user-profile.component.css'
})
export class UserProfileComponent {

  static readonly API_URL = `${environment.apiBaseUrl}`;
  userInfo: UserInfo | null = null;
  remainingTime: number = 0;
  private intervalId: any

  constructor(
    private http: HttpClient,
    private authService: AuthService,
    private router: Router
  ) { }

  ngOnInit(): void {
    this.http.get<UserInfo>(`${environment.apiBaseUrl}/auth/member/userinfo`).subscribe({
      next: (data) => {
        this.userInfo = data;
        this.startTokenCountdown();
      },
      error: (err) => {
        console.error('Fehler beim Laden der Benutzerdaten:', err);
      },
    });
  }

  startTokenCountdown(): void {
    const expiration = this.authService.getJwtExpirationInMillis();
    if (!expiration) return;

    this.intervalId = setInterval(() => {
      this.remainingTime = Math.max(0, Math.floor((expiration - Date.now()) / 1000));

      if (this.remainingTime <= 0) {
        clearInterval(this.intervalId);
        this.authService.logout();
        this.router.navigate(['/login']);
      }
    }, 1000);

    // sofortiger erster Aufruf
    this.remainingTime = Math.max(0, Math.floor((expiration - Date.now()) / 1000));
  }


  ngOnDestroy(): void {
    if (this.intervalId) {
      clearInterval(this.intervalId);
    }
  }

}
