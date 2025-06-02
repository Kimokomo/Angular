import { Component } from '@angular/core';
import { AuthService } from '../services/auth.service';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-user-info',
  standalone: true,
  imports: [
    CommonModule
  ],
  templateUrl: './user-info.component.html',
  styleUrl: './user-info.component.css'
})
export class UserInfoComponent {


    constructor(private authService: AuthService) {}

  // Observable für Userdaten
  get userInfo$() {
    return this.authService.userInfo$;
  }

}
