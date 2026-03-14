import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

export interface User {
  id: string;
  fullName: string;
  email: string;
  department: string;
  role: 'student' | 'admin';
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
  private events: any[] = [];

  constructor() {
    this.loadFromLocalStorage();
  }

  private loadFromLocalStorage(): void {
    const storedUsers = localStorage.getItem('users');
    const storedEvents = localStorage.getItem('events');
    const storedCurrentUser = localStorage.getItem('currentUser');
    
    if (storedUsers) {
      this.users = JSON.parse(storedUsers);
    }
    
    if (storedEvents) {
      this.events = JSON.parse(storedEvents);
    }
    
    if (storedCurrentUser) {
      this.currentUserSubject.next(JSON.parse(storedCurrentUser));
    }
  }

  private saveToLocalStorage(): void {
    localStorage.setItem('users', JSON.stringify(this.users));
    localStorage.setItem('events', JSON.stringify(this.events));
    const currentUser = this.currentUserSubject.value;
    if (currentUser) {
      localStorage.setItem('currentUser', JSON.stringify(currentUser));
    }
  }

  register(data: RegisterData): { success: boolean; message: string } {
    // Validate email domain
    if (!data.email.endsWith('@liceo.edu.ph')) {
      return { success: false, message: 'Please use your official @liceo.edu.ph email' };
    }

    // If the user already exists, allow "completing" or updating their profile.
    // This keeps the demo usable even if someone logs in before signing up.
    const existingUser = this.users.find(u => u.email === data.email);

    // Check admin code for admin registration
    let role: 'student' | 'admin' = 'student';
    if (data.adminCode === 'ADMIN123') {
      role = 'admin';
    } else if (data.adminCode) {
      return { success: false, message: 'Invalid admin code' };
    }

    if (existingUser) {
      const updatedUser: User = {
        ...existingUser,
        fullName: data.fullName || existingUser.fullName,
        department: data.department || existingUser.department,
        role: role === 'admin' ? 'admin' : existingUser.role
      };

      const index = this.users.findIndex(u => u.id === existingUser.id);
      if (index !== -1) this.users[index] = updatedUser;

      // If this user is currently logged in, update the session too.
      if (this.currentUserSubject.value?.id === updatedUser.id) {
        this.currentUserSubject.next(updatedUser);
        localStorage.setItem('currentUser', JSON.stringify(updatedUser));
      }

      this.saveToLocalStorage();
      return { success: true, message: 'Account updated' };
    }

    const newUser: User = {
      id: this.generateId(),
      fullName: data.fullName,
      email: data.email,
      department: data.department || 'Unknown',
      role,
      createdAt: new Date()
    };

    this.users.push(newUser);
    this.saveToLocalStorage();
    
    return { success: true, message: 'Registration successful' };
  }

  login(credentials: LoginCredentials): { success: boolean; message: string; user?: User } {
    if (!credentials.email.endsWith('@liceo.edu.ph')) {
      return { success: false, message: 'Please use your official @liceo.edu.ph email' };
    }

    let user = this.users.find(u => u.email === credentials.email);
    
    if (!user) {
      // Demo behavior: allow login without a prior sign-up.
      user = {
        id: this.generateId(),
        fullName: credentials.email.split('@')[0] || 'Student',
        email: credentials.email,
        department: 'Unknown',
        role: 'student',
        createdAt: new Date()
      };

      this.users.push(user);
    }

    // For demo purposes, we'll skip password validation
    // In a real app, you'd hash and compare passwords
    this.currentUserSubject.next(user);
    this.saveToLocalStorage();
    
    return { success: true, message: 'Login successful', user };
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

  updateProfile(userData: Partial<User>): void {
    const currentUser = this.currentUserSubject.value;
    if (currentUser) {
      const updatedUser = { ...currentUser, ...userData };
      this.currentUserSubject.next(updatedUser);
      
      // Update in users array
      const index = this.users.findIndex(u => u.id === currentUser.id);
      if (index !== -1) {
        this.users[index] = updatedUser;
      }
      
      this.saveToLocalStorage();
    }
  }

  private generateId(): string {
    return 'user_' + Math.random().toString(36).substr(2, 9);
  }
}
