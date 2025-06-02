import { Component } from '@angular/core';
import { AuthService } from '../services/auth.service';
import { Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-login',
  standalone:true,
  imports: [CommonModule, FormsModule],
  templateUrl: './login.component.html'
})
export class LoginComponent {
  username = '';
  password = '';
  error = false;

  constructor(private auth: AuthService, private router: Router) { }

  login() {
    this.error = false;
    this.auth.login(this.username, this.password).subscribe(success => {
      if (success) {
        this.router.navigate(['/buecherverwaltung']);
      } else {
        this.error = true;
      }
    });
  }

  register(): void {
  // Beispiel: Navigation zu einer Registrierungsseite
  this.router.navigate(['/register']);
}
}
