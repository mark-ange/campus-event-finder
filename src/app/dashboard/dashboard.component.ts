import { Component, OnInit, inject } from '@angular/core';
import { NgFor, NgIf } from '@angular/common';
import { Router } from '@angular/router';
import { AuthService, User } from '../services/auth.service';

interface HubEvent {
  id: string;
  title: string;
  date: string;
  time: string;
  image: string;
  category: string;
  description: string;
  summary: string;
  location: string;
  organizer: string;
  capacity: number;
  registrations: number;
}

interface EventMetrics {
  likes: number;
  comments: number;
}

@Component({
  selector: 'app-dashboard',
  standalone: true,
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.css'],
  imports: [NgFor, NgIf]
})
export class DashboardComponent implements OnInit {
  private router = inject(Router);
  private authService = inject(AuthService);

  readonly logoImage = 'assets/liceo-logo.png';
  readonly heroImage = 'assets/background log-in.png';

  private readonly eventsStorageKey = 'campusEvents';
  private readonly metricsStorageKey = 'eventMetrics';

  menuOpen = false;
  selectedEvent: HubEvent | null = null;
  currentUser: User | null = null;

  events: HubEvent[] = [];
  featuredEvents: HubEvent[] = [];

  private metricsByEventId: Record<string, EventMetrics> = {};

  ngOnInit(): void {
    // Check if user is logged in
    if (!this.authService.isLoggedIn()) {
      this.router.navigate(['/login']);
      return;
    }

    this.currentUser = this.authService.getCurrentUser();
    this.loadEvents();
    this.loadMetrics();
    this.ensureMetrics();
    this.featuredEvents = this.events.slice(0, 4);
  }

  private loadEvents(): void {
    const savedEvents = localStorage.getItem(this.eventsStorageKey);
    if (savedEvents) {
      try {
        const parsed = JSON.parse(savedEvents) as unknown;
        if (Array.isArray(parsed)) {
          this.events = parsed as HubEvent[];
          return;
        }
      } catch {
        // Fall through to seeding defaults.
      }
    }

    this.events = [
      {
        id: 'ev-1',
        title: 'ByteCode 2026: 24-Hour Hackathon',
        date: 'March 18-19, 2026',
        time: '9:00 AM - 9:00 PM',
        image: 'https://images.unsplash.com/photo-1518773553398-650c184e0bb3?auto=format&fit=crop&w=1200&q=80',
        category: 'Technology',
        description: 'A 24-hour coding marathon where students work in teams to build innovative software solutions.',
        summary: 'Join us for an intense 24-hour coding challenge!',
        location: 'Computer Science Building',
        organizer: 'Computer Science Department',
        capacity: 100,
        registrations: 45
      },
      {
        id: 'ev-2',
        title: 'The Bridge-Building Challenge',
        date: 'April 05, 2026',
        time: '10:00 AM - 4:00 PM',
        image: 'https://images.unsplash.com/photo-1475776408506-9a5371e7a068?auto=format&fit=crop&w=1200&q=80',
        category: 'Engineering',
        description: 'Students compete to design and build the strongest bridge using limited materials.',
        summary: 'Test your engineering skills in this hands-on competition!',
        location: 'Engineering Lab',
        organizer: 'Engineering Society',
        capacity: 50,
        registrations: 30
      },
      {
        id: 'ev-3',
        title: 'Liceo White Coat: First Aid & CPR Workshop',
        date: 'April 10, 2026',
        time: '2:00 PM - 5:00 PM',
        image: 'https://images.unsplash.com/photo-1576091160550-2173dba999ef?auto=format&fit=crop&w=1200&q=80',
        category: 'Healthcare',
        description: 'Learn essential first aid techniques and CPR certification from medical professionals.',
        summary: 'Gain life-saving skills in this comprehensive workshop!',
        location: 'Medical Training Center',
        organizer: 'Pre-Med Society',
        capacity: 30,
        registrations: 25
      },
      {
        id: 'ev-4',
        title: 'Business Pitch Arena 2026',
        date: 'May 22, 2026',
        time: '1:00 PM - 6:00 PM',
        image: 'https://images.unsplash.com/photo-1552664730-d307ca884978?auto=format&fit=crop&w=1200&q=80',
        category: 'Business',
        description: 'Student entrepreneurs present their business ideas to a panel of judges and investors.',
        summary: 'Showcase your entrepreneurial spirit and win startup funding!',
        location: 'Business School Auditorium',
        organizer: 'Entrepreneurship Club',
        capacity: 200,
        registrations: 15
      }
    ];

    this.saveEvents();
  }

  private saveEvents(): void {
    localStorage.setItem(this.eventsStorageKey, JSON.stringify(this.events));
  }

  private loadMetrics(): void {
    const saved = localStorage.getItem(this.metricsStorageKey);
    if (!saved) return;

    try {
      const parsed = JSON.parse(saved) as unknown;
      if (parsed && typeof parsed === 'object') {
        this.metricsByEventId = parsed as Record<string, EventMetrics>;
      }
    } catch {
      // Ignore invalid storage.
    }
  }

  private saveMetrics(): void {
    localStorage.setItem(this.metricsStorageKey, JSON.stringify(this.metricsByEventId));
  }

  private ensureMetrics(): void {
    let changed = false;

    for (const event of this.events) {
      if (!this.metricsByEventId[event.id]) {
        this.metricsByEventId[event.id] = this.seedMetrics(event.id);
        changed = true;
      }
    }

    if (changed) this.saveMetrics();
  }

  private seedMetrics(eventId: string): EventMetrics {
    if (eventId === 'ev-1') return { likes: 156, comments: 1600 };
    if (eventId === 'ev-2') return { likes: 134, comments: 567 };
    if (eventId === 'ev-3') return { likes: 88, comments: 312 };
    if (eventId === 'ev-4') return { likes: 65, comments: 120 };

    const hash = this.hashString(eventId);
    return {
      likes: 20 + (hash % 181),
      comments: 20 + (hash % 1981)
    };
  }

  private hashString(value: string): number {
    let hash = 5381;
    for (let i = 0; i < value.length; i++) {
      hash = (hash * 33) ^ value.charCodeAt(i);
    }
    return hash >>> 0;
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
  }

  closeDetails(): void {
    this.selectedEvent = null;
  }

  likeEvent(event: HubEvent): void {
    const metrics = this.metricsByEventId[event.id] ?? this.seedMetrics(event.id);
    metrics.likes += 1;
    this.metricsByEventId[event.id] = metrics;
    this.saveMetrics();
  }

  navigateTo(route: string): void {
    this.menuOpen = false;
    this.router.navigate([route]);
  }

  getLikes(eventId: string): number {
    return this.metricsByEventId[eventId]?.likes ?? 0;
  }

  getComments(eventId: string): number {
    return this.metricsByEventId[eventId]?.comments ?? 0;
  }

  formatCount(value: number): string {
    if (!Number.isFinite(value)) return '0';
    if (value < 1000) return String(Math.trunc(value));

    const rounded = Math.round((value / 1000) * 10) / 10;
    const text = rounded.toFixed(1).replace(/\.0$/, '');
    return `${text}k`;
  }

  shareEvent(event: HubEvent): void {
    if (navigator.share) {
      navigator.share({
        title: event.title,
        text: event.description,
        url: window.location.href
      });
    } else {
      // Fallback for browsers that don't support Web Share API
      const shareText = `${event.title}\n${event.description}\n${window.location.href}`;
      navigator.clipboard.writeText(shareText).then(() => {
        alert('Event details copied to clipboard!');
      });
    }
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
