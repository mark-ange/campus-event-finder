import { Routes } from '@angular/router';
import { LoginComponent } from './log-in/login.component';
import { SignUpComponent } from './sign-up/sign-up.component';
import { DashboardComponent } from './dashboard/dashboard.component';
import { AdminEventsComponent } from './admin-events/admin-events.component';
import { StudentProfileComponent } from './student-profile/student-profile.component';
import { ForgotPasswordComponent } from './forgot-password/forgot-password.component';
import { MessagesComponent } from './messages/messages.component';
import { NotificationsComponent } from './notifications/notifications.component';
import { SettingsComponent } from './settings/settings.component';

export const routes: Routes = [
  { path: '', redirectTo: '/login', pathMatch: 'full' },
  { path: 'login', component: LoginComponent },
  { path: 'sign-up', component: SignUpComponent },
  { path: 'forgot-password', component: ForgotPasswordComponent },
  { path: 'dashboard', component: DashboardComponent },
  { path: 'admin-events', component: AdminEventsComponent },
  { path: 'profile', component: StudentProfileComponent },
  { path: 'messages', component: MessagesComponent },
  { path: 'notifications', component: NotificationsComponent },
  { path: 'settings', component: SettingsComponent }
];
