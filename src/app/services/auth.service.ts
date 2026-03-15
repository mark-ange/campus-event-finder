import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

export interface User {
  id: string;
  fullName: string;
  email: string;
  password: string;
  department: string;
  role: 'student' | 'admin';
  profileImage?: string;
  createdAt: Date;
}

export interface LoginCredentials {
  email: string;
  password: string;
}

export interface RegisterData {
  fullName: string;
  email: string;
  password: string;
  department: string;
  adminCode?: string;
}

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  private currentUserSubject = new BehaviorSubject<User | null>(null);
  public currentUser$ = this.currentUserSubject.asObservable();

  private users: User[] = [];

  constructor() {
    this.loadUsers();
    this.loadCurrentUser();
  }

  private loadUsers(): void {
    const storedUsers = localStorage.getItem('users');
    if (storedUsers) {
      this.users = JSON.parse(storedUsers);
    }
  }

  private loadCurrentUser(): void {
    const storedCurrentUser = localStorage.getItem('currentUser');
    if (storedCurrentUser) {
      this.currentUserSubject.next(JSON.parse(storedCurrentUser));
    }
  }

  private saveUsers(): void {
    localStorage.setItem('users', JSON.stringify(this.users));
  }

  register(data: RegisterData): { success: boolean; message: string } {

    const existingUser = this.users.find(u => u.email === data.email);

    if (existingUser) {
      return { success: false, message: 'Email already registered' };
    }

    if (!data.email.endsWith('@liceo.edu.ph')) {
      return { success: false, message: 'Use your official @liceo.edu.ph email' };
    }

    let role: 'student' | 'admin' = 'student';

    if (data.adminCode === 'ADMIN123') {
      role = 'admin';
    }

    if (data.adminCode && data.adminCode !== 'ADMIN123') {
      return { success: false, message: 'Invalid admin code' };
    }

    const newUser: User = {
      id: this.generateId(),
      fullName: data.fullName,
      email: data.email,
      password: data.password,
      department: data.department || 'Unknown',
      role: role,
      createdAt: new Date()
    };

    this.users.push(newUser);
    this.saveUsers();

    return { success: true, message: 'Registration successful' };
  }

  login(credentials: LoginCredentials): { success: boolean; message: string } {

    const user = this.users.find(
      u => u.email === credentials.email && u.password === credentials.password
    );

    if (!user) {
      return { success: false, message: 'Invalid email or password' };
    }

    this.currentUserSubject.next(user);
    localStorage.setItem('currentUser', JSON.stringify(user));

    return { success: true, message: 'Login successful' };
  }

  isEmailRegistered(email: string): boolean {
    return this.users.some(user => user.email === email);
  }

  resetPassword(email: string, newPassword: string): { success: boolean; message: string } {
    const user = this.users.find(existing => existing.email === email);
    if (!user) {
      return { success: false, message: 'No account found for this email' };
    }

    user.password = newPassword;
    this.saveUsers();

    const current = this.currentUserSubject.value;
    if (current?.email === email) {
      const updatedUser = { ...current, password: newPassword };
      this.currentUserSubject.next(updatedUser);
      localStorage.setItem('currentUser', JSON.stringify(updatedUser));
    }

    return { success: true, message: 'Password updated' };
  }

  logout(): void {
    this.currentUserSubject.next(null);
    localStorage.removeItem('currentUser');
  }

  isLoggedIn(): boolean {
    return this.currentUserSubject.value !== null;
  }

  getCurrentUser(): User | null {
    return this.currentUserSubject.value;
  }

  isAdmin(): boolean {
    const user = this.currentUserSubject.value;
    return user?.role === 'admin';
  }

  updateProfile(data: Partial<User>): void {

    const currentUser = this.currentUserSubject.value;

    if (!currentUser) return;

    const updatedUser = { ...currentUser, ...data };

    this.currentUserSubject.next(updatedUser);

    const index = this.users.findIndex(u => u.id === currentUser.id);

    if (index !== -1) {
      this.users[index] = updatedUser;
    }

    this.saveUsers();
    localStorage.setItem('currentUser', JSON.stringify(updatedUser));
  }

  private generateId(): string {
    return 'user_' + Math.random().toString(36).substring(2, 9);
  }

}
