import { Component, OnInit, inject } from '@angular/core';
import { DatePipe, NgFor, NgIf } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { AuthService, User } from '../services/auth.service';
import { EventComment, EventEngagementService } from '../services/event-engagement.service';
import { DEFAULT_EVENTS, EVENTS_STORAGE_KEY, HubEvent, mergeEvents, sortEventsForDisplay } from '../services/event-store';

@Component({
  selector: 'app-dashboard',
  standalone: true,
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.css'],
  imports: [NgFor, NgIf, FormsModule, DatePipe]
})
export class DashboardComponent implements OnInit {
  private readonly router = inject(Router);
  private readonly authService = inject(AuthService);
  private readonly engagement = inject(EventEngagementService);

  readonly logoImage = 'assets/liceo-logo.png';
  readonly heroImage = 'assets/background log-in.png';
  readonly fallbackEventImage = 'assets/liceo-logo.png';

  menuOpen = false;
  selectedEvent: HubEvent | null = null;
  currentUser: User | null = null;

  allEvents: HubEvent[] = [];
  events: HubEvent[] = [];
  featuredEvents: HubEvent[] = [];

  commentText = '';
  selectedEventComments: EventComment[] = [];

  ngOnInit(): void {
    if (!this.authService.isLoggedIn()) {
      this.router.navigate(['/login']);
      return;
    }

    this.currentUser = this.authService.getCurrentUser();
    this.loadEvents();
    this.featuredEvents = this.events.slice(0, 4);
  }

  private loadEvents(): void {
    const savedEvents = localStorage.getItem(EVENTS_STORAGE_KEY);
    if (savedEvents) {
      try {
        const parsed = JSON.parse(savedEvents) as unknown;
        if (Array.isArray(parsed)) {
          this.events = parsed as HubEvent[];
        }
      } catch {
      }
    }

    const merged = mergeEvents(this.events.length ? this.events : [], DEFAULT_EVENTS);
    this.allEvents = sortEventsForDisplay(merged.events);
    this.events = this.allEvents.filter(event => (event.status ?? 'active') === 'active');

    if (!savedEvents || merged.changed) {
      this.saveEvents();
    }
  }

  private saveEvents(): void {
    localStorage.setItem(EVENTS_STORAGE_KEY, JSON.stringify(this.allEvents));
  }

  toggleMenu(): void {
    this.menuOpen = !this.menuOpen;
  }

  logout(): void {
    this.authService.logout();
    this.router.navigate(['/login']);
  }

  openDetails(event: HubEvent): void {
    this.selectedEvent = event;
    this.commentText = '';
    this.selectedEventComments = this.engagement.getComments(event.id);
  }

  closeDetails(): void {
    this.selectedEvent = null;
    this.commentText = '';
    this.selectedEventComments = [];
  }

  likeEvent(event: HubEvent): void {
    this.engagement.like(event.id);
  }

  navigateTo(route: string): void {
    this.menuOpen = false;
    this.router.navigate([route]);
  }

  getLikes(eventId: string): number {
    return this.engagement.getLikes(eventId);
  }

  getComments(eventId: string): number {
    return this.engagement.getCommentCount(eventId);
  }

  formatCount(value: number): string {
    return this.engagement.formatCount(value);
  }

  shareEvent(event: HubEvent): void {
    if (navigator.share) {
      navigator.share({
        title: event.title,
        text: event.description,
        url: window.location.href
      });
    } else {
      const shareText = `${event.title}\n${event.description}\n${window.location.href}`;
      navigator.clipboard.writeText(shareText).then(() => {
        alert('Event details copied to clipboard!');
      });
    }
  }

  onImageError(event: Event): void {
    const target = event.target as HTMLImageElement | null;
    if (!target) return;

    if (target.dataset['fallbackApplied'] === 'true') return;
    target.dataset['fallbackApplied'] = 'true';
    target.src = this.fallbackEventImage;
  }

  addComment(): void {
    if (!this.selectedEvent) return;

    const author = this.currentUser?.fullName ?? 'Anonymous';
    const role = this.currentUser?.role ?? 'student';
    this.engagement.addComment(this.selectedEvent.id, {
      author,
      role,
      text: this.commentText
    });
    this.commentText = '';
    this.selectedEventComments = this.engagement.getComments(this.selectedEvent.id);
  }

  registerForEvent(event: HubEvent): void {
    if (event.registrations < event.capacity) {
      event.registrations++;
      this.saveEvents();
      alert(`Successfully registered for ${event.title}!`);
    } else {
      alert('Event is at full capacity!');
    }
  }
}
