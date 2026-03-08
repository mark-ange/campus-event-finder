import { Component, OnInit, inject } from '@angular/core';
import { NgFor, NgIf } from '@angular/common';
import { Router } from '@angular/router';

interface HubEvent {
  id: string;
  title: string;
  date: string;
  location: string;
  description: string;
  image: string;
  likes: number;
  comments: number;
  liked: boolean;
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

  readonly logoImage = 'assets/liceo-logo.png';
  readonly heroImage = 'assets/background log-in.png';

  menuOpen = false;
  selectedEvent: HubEvent | null = null;

  events: HubEvent[] = [];
  featuredEvents: HubEvent[] = [];

  ngOnInit(): void {
    this.loadEvents();
  }

  private loadEvents(): void {
    this.events = [
      {
        id: 'ev-1',
        title: 'ByteCode 2026: 24-Hour Hackathon',
        date: 'March 18-19, 2026',
        location: 'IT Innovation Lab, 3rd Floor',
        description: 'Team up and build solutions for real-world problems. Open to all programming levels!',
        image: 'https://images.unsplash.com/photo-1518773553398-650c184e0bb3?auto=format&fit=crop&w=1200&q=80',
        likes: 156,
        comments: 1600,
        liked: false
      },
      {
        id: 'ev-2',
        title: 'The Bridge-Building Challenge',
        date: 'April 05, 2026',
        location: 'Engineering Multi-Purpose Hall',
        description: 'A test of physics and creativity. Watch student teams compete to build the strongest model bridge.',
        image: 'https://images.unsplash.com/photo-1489515217757-5fd1be406fef?auto=format&fit=crop&w=1200&q=80',
        likes: 134,
        comments: 567,
        liked: false
      },
      {
        id: 'ev-3',
        title: 'Liceo White Coat: First Aid & CPR Workshop',
        date: 'April 10, 2026',
        location: 'Nursing Skills Laboratory',
        description: 'Hands-on emergency response training led by healthcare mentors and instructors.',
        image: 'https://images.unsplash.com/photo-1576091160550-2173dba999ef?auto=format&fit=crop&w=1200&q=80',
        likes: 121,
        comments: 483,
        liked: false
      }
    ];
    
    this.featuredEvents = this.events.slice(0, 3);
  }

  toggleMenu(): void {
    this.menuOpen = !this.menuOpen;
  }

  goToFeatured(): void {
    this.router.navigate(['/dashboard']);
  }

  goToEvents(): void {
    this.router.navigate(['/events']);
  }

  logout(): void {
    // Clear any authentication state
    localStorage.removeItem('currentUser');
    this.router.navigate(['/login']);
  }

  openDetails(event: HubEvent): void {
    this.selectedEvent = event;
  }

  closeDetails(): void {
    this.selectedEvent = null;
  }

  toggleLike(event: HubEvent): void {
    event.liked = !event.liked;
    event.likes += event.liked ? 1 : -1;
  }

  shareEvent(event: HubEvent): void {
    const shareText = `Check out this event: ${event.title} on ${event.date} at ${event.location}`;
    if (navigator.share) {
      navigator.share({
        title: event.title,
        text: shareText,
        url: window.location.href
      });
    } else {
      // Fallback for browsers that don't support Web Share API
      navigator.clipboard.writeText(shareText).then(() => {
        alert('Event details copied to clipboard!');
      });
    }
  }

  addComment(event: HubEvent): void {
    // Simple comment increment for demo purposes
    event.comments += 1;
  }

  formatCount(count: number): string {
    if (count >= 1000) {
      return (count / 1000).toFixed(1) + 'k';
    }
    return count.toString();
  }
}