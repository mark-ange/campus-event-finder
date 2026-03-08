import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private isAuthenticated = false;
  private currentUser: { email: string } | null = null;

  login(email: string, password: string): void {
    if (email && password) {
      this.isAuthenticated = true;
      this.currentUser = { email };
      console.log('User logged in:', email);
    }
  }

  logout(): void {
    this.isAuthenticated = false;
    this.currentUser = null;
    console.log('User logged out');
  }

  isLoggedIn() {
    return this.isAuthenticated;
  }

  getCurrentUser() {
    return this.currentUser;
  }
}