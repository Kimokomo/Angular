import { HttpClient } from '@angular/common/http';
import { Component } from '@angular/core';
import { UserInfo } from '../models/userinfo';
import { CommonModule } from '@angular/common';
import { environment } from '../../environments/environment';
import { TimeFormatPipe } from '../pipes/time-format.pipe';
import { UserProfileService } from '../services/user-profile.service';

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

  userInfo: UserInfo | null = null;

  constructor(private userProfileService: UserProfileService) { }

  ngOnInit(): void {
    this.userProfileService.getUserInfo().subscribe({
      next: (data) => {
        this.userInfo = data;
        this.userProfileService.startTokenCountdown();
      },
      error: (err) => {
        console.error('Fehler beim Laden der Benutzerdaten:', err);
      },
    });
  }

  ngOnDestroy(): void {
    this.userProfileService.clearJwtExpiryInterval();
  }

  //  Property vom Service in die Komponente weiterreichen
  get remainingTime(): number {
    return this.userProfileService.remainingTime;
  }
}
