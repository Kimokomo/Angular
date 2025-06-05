import { HttpClient } from '@angular/common/http';
import { Component } from '@angular/core';
import { UserInfo } from '../models/userinfo';
import { CommonModule } from '@angular/common';
import { environment } from '../../environments/environment';

@Component({
  selector: 'app-user-profile',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './user-profile.component.html',
  styleUrl: './user-profile.component.css'
})
export class UserProfileComponent {

  static readonly API_URL = `${environment.apiBaseUrl}`;

  userInfo: UserInfo | null = null;

  constructor(private http: HttpClient) { }

  ngOnInit(): void {
    this.http.get<UserInfo>(`${environment.apiBaseUrl}/auth/member/userinfo`).subscribe({
      next: (data) => {
        this.userInfo = data;
      },
      error: (err) => {
        console.error('Fehler beim Laden der Benutzerdaten:', err);
      },
    });
  }

}
