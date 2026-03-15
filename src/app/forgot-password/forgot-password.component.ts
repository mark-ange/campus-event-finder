import { Component, inject } from '@angular/core';
import { NgIf } from '@angular/common';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { AuthService } from '../services/auth.service';

type Phase = 'request' | 'reset' | 'done';

@Component({
  selector: 'app-forgot-password',
  standalone: true,
  imports: [NgIf, ReactiveFormsModule],
  templateUrl: './forgot-password.component.html',
  styleUrls: ['./forgot-password.component.css']
})
export class ForgotPasswordComponent {
  private readonly formBuilder = inject(FormBuilder);
  private readonly router = inject(Router);
  private readonly authService = inject(AuthService);

  phase: Phase = 'request';
  email = '';
  message = '';

  readonly requestForm = this.formBuilder.group({
    email: ['', [Validators.required, Validators.email]]
  });

  readonly resetForm = this.formBuilder.group({
    password: ['', [Validators.required, Validators.minLength(6)]],
    confirmPassword: ['', [Validators.required]]
  });

  onSubmitRequest(): void {
    this.message = '';
    if (this.requestForm.invalid) return;

    const email = this.requestForm.value.email ?? '';
    this.email = email;

    if (!this.authService.isEmailRegistered(email)) {
      this.phase = 'done';
      this.message = 'If an account exists for this email, a reset link will be sent.';
      return;
    }

    this.phase = 'reset';
  }

  onSubmitReset(): void {
    this.message = '';
    if (this.resetForm.invalid) return;

    const password = this.resetForm.value.password ?? '';
    const confirmPassword = this.resetForm.value.confirmPassword ?? '';

    if (password !== confirmPassword) {
      this.message = 'Passwords do not match';
      return;
    }

    const result = this.authService.resetPassword(this.email, password);
    if (!result.success) {
      this.message = result.message;
      return;
    }

    this.phase = 'done';
    this.message = 'Password updated. You can log in now.';
  }

  backToLogin(): void {
    this.router.navigate(['/login']);
  }
}
