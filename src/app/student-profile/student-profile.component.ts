import { Component, inject } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService, User } from '../services/auth.service';

@Component({
  selector: 'app-student-profile',
  standalone: true,
  template: `
    <div class="profile-page" [style.background-image]="'url(' + backgroundImage + ')'">
      <header class="profile-header">
        <div class="brand">
          <img [src]="logoImage" alt="Liceo logo" class="brand-logo" />
          <div class="brand-text">
            <span>LICEO</span>
            <span>EVENT HUB</span>
          </div>
        </div>

        <div class="header-icons">
          <button type="button" (click)="goHome()">⌂</button>
          <button type="button">💬</button>
          <button type="button">🔔</button>
          <button type="button">⚙</button>
        </div>
      </header>

      <section class="profile-card">
        <img [src]="profileImage" alt="Student profile image" class="avatar" />
        <h1>Student profile</h1>
        <p>I.T Deapartment</p>
        <p>student mail</p>
        <p>student number</p>
      </section>
    </div>
  `,
  styles: [
    `
      .profile-page {
        min-height: 100vh;
        background-size: cover;
        background-position: center;
        background-repeat: no-repeat;
        font-family: 'Arial Narrow', Arial, sans-serif;
      }

      .profile-header {
        height: 52px;
        background: #600000;
        display: flex;
        align-items: center;
        justify-content: space-between;
        padding-right: 10px;
      }

      .brand {
        display: flex;
        align-items: center;
        gap: 8px;
      }

      .brand-logo {
        width: 40px;
        height: 40px;
        object-fit: contain;
        border: 1px solid #12436f;
      }

      .brand-text {
        display: flex;
        flex-direction: column;
        color: #ffd400;
        font-size: 22px;
        line-height: 0.9;
        font-family: 'Franklin Gothic Heavy', 'Arial Black', sans-serif;
      }

      .header-icons {
        display: flex;
        align-items: center;
        gap: 14px;
      }

      .header-icons button {
        border: 0;
        background: transparent;
        font-size: 31px;
        line-height: 1;
        cursor: pointer;
      }

      .profile-card {
        width: min(700px, 88vw);
        margin: 0 auto;
        min-height: calc(100vh - 52px);
        background: #890000;
        border-radius: 24px 24px 0 0;
        display: flex;
        flex-direction: column;
        align-items: center;
        padding-top: 94px;
        box-sizing: border-box;
        color: #fff;
      }

      .avatar {
        width: 138px;
        height: 138px;
        border-radius: 50%;
        object-fit: cover;
      }

      .profile-card h1 {
        margin: 18px 0 14px;
        font-size: 60px;
        line-height: 1;
        font-family: Rockwell, 'Roboto Slab', serif;
      }

      .profile-card p {
        margin: 5px 0;
        font-size: 41px;
        line-height: 1.05;
        font-family: Rockwell, 'Roboto Slab', serif;
      }
    `
  ]
})
export class StudentProfileComponent {
  private router = inject(Router);
  private authService = inject(AuthService);

  currentUser: User | null = null;

  readonly logoImage = 'assets/liceo-logo.png';
  readonly profileImage =
    'https://images.unsplash.com/photo-1677442136019-21780ecad995?auto=format&fit=crop&w=500&q=80';
  readonly backgroundImage =
    'https://images.unsplash.com/photo-1576495199011-eb94736d05d6?auto=format&fit=crop&w=1800&q=80';

  ngOnInit(): void {
    // Check if user is logged in
    if (!this.authService.isLoggedIn()) {
      this.router.navigate(['/login']);
      return;
    }

    this.currentUser = this.authService.getCurrentUser();
  }

  goHome(): void {
    this.router.navigate(['/dashboard']);
  }

  logout(): void {
    this.authService.logout();
    this.router.navigate(['/login']);
  }
}
