import { Component, inject } from '@angular/core';
import { NgIf } from '@angular/common';
import { ReactiveFormsModule, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { AuthService, RegisterData } from '../services/auth.service';

@Component({
  selector: 'app-sign-up',
  standalone: true,
  imports: [NgIf, ReactiveFormsModule],
  templateUrl: './sign-up.component.html',
  styleUrls: ['./sign-up.component.css']
})
export class SignUpComponent {
  private formBuilder = inject(FormBuilder);
  private router = inject(Router);
  private authService = inject(AuthService);

  registerForm: FormGroup = this.formBuilder.group({
    fullName: ['', Validators.required],
    email: ['', [Validators.required, Validators.email]],
    password: ['', [Validators.required, Validators.minLength(6)]],
    confirmPassword: ['', Validators.required],
    department: ['', Validators.required],
    adminCode: ['']
  });

  errorMessage = '';
  successMessage = '';

  onSubmit(): void {
    if (this.registerForm.valid) {
      const password = this.registerForm.value.password;
      const confirmPassword = this.registerForm.value.confirmPassword;
      
      if (password !== confirmPassword) {
        this.errorMessage = 'Passwords do not match';
        return;
      }

      const registerData: RegisterData = {
        fullName: this.registerForm.value.fullName,
        email: this.registerForm.value.email,
        password: password,
        department: this.registerForm.value.department,
        adminCode: this.registerForm.value.adminCode || undefined
      };

      const result = this.authService.register(registerData);
      
      if (result.success) {
        this.successMessage = result.message;
        this.errorMessage = '';
        
        // Redirect to login after successful registration
        setTimeout(() => {
          this.router.navigate(['/login']);
        }, 2000);
      } else {
        this.errorMessage = result.message;
        this.successMessage = '';
      }
    }
  }

  onBackToLogin(): void {
    this.router.navigate(['/login']);
  }
}
