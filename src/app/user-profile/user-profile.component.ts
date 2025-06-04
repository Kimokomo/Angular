import { HttpClient } from '@angular/common/http';
import { Component } from '@angular/core';
import { UserInfo } from '../models/userinfo';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-user-profile',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './user-profile.component.html',
  styleUrl: './user-profile.component.css'
})
export class UserProfileComponent {
  userInfo: UserInfo | null = null;

  constructor(private http: HttpClient) { }

  ngOnInit(): void {
    this.http.get<UserInfo>('http://localhost:8080/api/auth/userinfo').subscribe({
      next: (data) => {
        this.userInfo = data;
      },
      error: (err) => {
        console.error('Fehler beim Laden der Benutzerdaten:', err);
      },
    });
  }

}
