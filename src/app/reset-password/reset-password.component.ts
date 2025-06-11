import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule } from '@angular/forms';

@Component({
  selector: 'app-reset-password',
  standalone:true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './reset-password.component.html',
  styleUrl: './reset-password.component.css'
})
export class ResetPasswordComponent {


  resetPassForm!: FormGroup

  constructor(private fb: FormBuilder){}

    ngOnInit() {
    this.resetPassForm = this.fb.group({
      newPassword: ['']
    });
  }

  handleResetPassForm() {

  }
}
