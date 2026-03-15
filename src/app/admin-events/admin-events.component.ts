import { Component, OnInit, inject } from '@angular/core';
import { DatePipe, NgFor, NgIf } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { AuthService, User } from '../services/auth.service';
import { EventComment, EventEngagementService } from '../services/event-engagement.service';
import { DEFAULT_EVENTS, EVENTS_STORAGE_KEY, EventStatus, HubEvent, mergeEvents } from '../services/event-store';

interface EventFormData {
  title: string;
  date: string;
  time: string;
  category: string;
  description: string;
  summary: string;
  location: string;
  organizer: string;
  capacity: number;
  image: string;
  status: EventStatus;
  registrations?: number;
}

@Component({
  selector: 'app-admin-events',
  standalone: true,
  templateUrl: './admin-events.component.html',
  styleUrls: ['./admin-events.component.css'],
  imports: [NgFor, NgIf, FormsModule, DatePipe]
})
export class AdminEventsComponent implements OnInit {
  private readonly router = inject(Router);
  private readonly authService = inject(AuthService);
  private readonly engagement = inject(EventEngagementService);

  readonly logoImage = 'assets/liceo-logo.png';
  readonly fallbackEventImage = 'assets/liceo-logo.png';

  currentUser: User | null = null;
  menuOpen = false;
  editorOpen = false;
  commentsOpen = false;

  pageIndex = 1;
  private readonly pageSize = 2;

  events: HubEvent[] = [];
  isEditing = false;
  editingEventId: string | null = null;
  commentsEvent: HubEvent | null = null;
  commentText = '';
  eventComments: EventComment[] = [];
  
  formData: EventFormData = {
    title: '',
    date: '',
    time: '',
    category: 'Technology',
    description: '',
    summary: '',
    location: '',
    organizer: '',
    capacity: 50,
    image: '',
    status: 'active'
  };

  categories = [
    'Technology', 'Engineering', 'Healthcare', 'Business', 
    'Arts', 'Sports', 'Academic', 'Social', 'Workshop', 'Seminar'
  ];

  ngOnInit(): void {
    this.currentUser = this.authService.getCurrentUser();
    this.loadEvents();
    this.ensurePageInRange();
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
    this.events = merged.events;

    if (!savedEvents || merged.changed) {
      this.saveEvents();
    }
  }

  private saveEvents(): void {
    localStorage.setItem(EVENTS_STORAGE_KEY, JSON.stringify(this.events));
  }

  toggleMenu(): void {
    this.menuOpen = !this.menuOpen;
  }

  goHome(): void {
    this.menuOpen = false;
    this.router.navigate(['/dashboard']);
  }

  openMessages(): void {
    this.menuOpen = false;
    this.router.navigate(['/messages']);
  }

  openNotifications(): void {
    this.menuOpen = false;
    this.router.navigate(['/notifications']);
  }

  openSettings(): void {
    this.menuOpen = false;
    this.router.navigate(['/settings']);
  }

  get totalPages(): number {
    return Math.max(1, Math.ceil(this.events.length / this.pageSize));
  }

  get pagedEvents(): HubEvent[] {
    const start = (this.pageIndex - 1) * this.pageSize;
    return this.events.slice(start, start + this.pageSize);
  }

  prevPage(): void {
    this.pageIndex = Math.max(1, this.pageIndex - 1);
  }

  nextPage(): void {
    this.pageIndex = Math.min(this.totalPages, this.pageIndex + 1);
  }

  private ensurePageInRange(): void {
    this.pageIndex = Math.min(Math.max(1, this.pageIndex), this.totalPages);
  }

  openCreate(): void {
    this.commentsOpen = false;
    this.commentsEvent = null;
    this.isEditing = false;
    this.editingEventId = null;
    this.resetForm();
    if (this.currentUser?.department) {
      this.formData.organizer = this.currentUser.department;
    }
    this.menuOpen = false;
    this.editorOpen = true;
  }

  startEdit(event: HubEvent): void {
    this.commentsOpen = false;
    this.commentsEvent = null;
    this.isEditing = true;
    this.editingEventId = event.id;
    this.formData = {
      title: event.title,
      date: event.date,
      time: event.time,
      category: event.category,
      description: event.description,
      summary: event.summary,
      location: event.location,
      organizer: event.organizer,
      capacity: event.capacity,
      image: event.image,
      status: this.getEventStatus(event)
    };
    this.menuOpen = false;
    this.editorOpen = true;
  }

  closeEditor(): void {
    this.editorOpen = false;
    this.resetForm();
  }

  submitEditor(): void {
    if (this.isEditing) {
      this.updateEvent();
    } else {
      this.addEvent();
    }

    this.closeEditor();
  }

  private addEvent(): void {
    const newEvent: HubEvent = {
      id: 'ev-' + Date.now(),
      title: this.formData.title,
      date: this.formData.date,
      time: this.formData.time,
      category: this.formData.category,
      description: this.formData.description,
      summary: this.formData.summary,
      location: this.formData.location,
      organizer: this.formData.organizer,
      capacity: this.formData.capacity,
      image: this.formData.image,
      status: this.formData.status,
      registrations: 0
    };

    this.events.unshift(newEvent);
    this.saveEvents();
    this.ensurePageInRange();
  }

  private updateEvent(): void {
    const index = this.events.findIndex(e => e.id === this.editingEventId);
    if (index !== -1) {
      const existing = this.events[index];
      const updatedEvent: HubEvent = {
        id: this.editingEventId!,
        title: this.formData.title,
        date: this.formData.date,
        time: this.formData.time,
        category: this.formData.category,
        description: this.formData.description,
        summary: this.formData.summary,
        location: this.formData.location,
        organizer: this.formData.organizer,
        capacity: this.formData.capacity,
        image: this.formData.image,
        status: this.formData.status,
        registrations: existing.registrations
      };
      this.events[index] = updatedEvent;
      this.saveEvents();
      this.ensurePageInRange();
    }
  }

  deleteEvent(eventId: string): void {
    if (confirm('Are you sure you want to delete this event?')) {
      this.events = this.events.filter(e => e.id !== eventId);
      this.saveEvents();
      this.ensurePageInRange();
    }
  }

  private resetForm(): void {
    this.isEditing = false;
    this.editingEventId = null;
    this.formData = {
      title: '',
      date: '',
      time: '',
      category: 'Technology',
      description: '',
      summary: '',
      location: '',
      organizer: '',
      capacity: 50,
      image: '',
      status: 'active'
    };
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

  likeEvent(event: HubEvent): void {
    this.engagement.like(event.id);
  }

  openComments(event: HubEvent): void {
    this.editorOpen = false;
    this.menuOpen = false;
    this.commentsEvent = event;
    this.commentText = '';
    this.eventComments = this.engagement.getComments(event.id);
    this.commentsOpen = true;
  }

  closeComments(): void {
    this.commentsOpen = false;
    this.commentsEvent = null;
    this.commentText = '';
    this.eventComments = [];
  }

  submitComment(): void {
    if (!this.commentsEvent) return;

    const author = this.currentUser?.fullName ?? 'Anonymous';
    const role = this.currentUser?.role ?? 'admin';
    this.engagement.addComment(this.commentsEvent.id, {
      author,
      role,
      text: this.commentText
    });
    this.commentText = '';
    this.eventComments = this.engagement.getComments(this.commentsEvent.id);
  }

  deleteComment(commentId: string): void {
    if (!this.commentsEvent) return;
    this.engagement.deleteComment(this.commentsEvent.id, commentId);
    this.eventComments = this.engagement.getComments(this.commentsEvent.id);
  }

  toggleAvailability(event: HubEvent): void {
    const status = this.getEventStatus(event);
    event.status = status === 'inactive' ? 'active' : 'inactive';
    this.saveEvents();
  }

  shareEvent(event: HubEvent): void {
    if (navigator.share) {
      navigator.share({
        title: event.title,
        text: event.summary || event.description,
        url: window.location.href
      });
    } else {
      const shareText = `${event.title}\\n${event.summary || event.description}\\n${window.location.href}`;
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

  trackByEventId(index: number, event: HubEvent): string {
    return event.id;
  }

  trackByCommentId(index: number, comment: EventComment): string {
    return comment.id;
  }

  getEventStatus(event: HubEvent): EventStatus {
    if (event.status === 'inactive') return 'inactive';
    if (event.status === 'draft') return 'draft';
    return 'active';
  }

  getStatusLabel(event: HubEvent): string {
    const status = this.getEventStatus(event);
    if (status === 'draft') return 'draft';
    if (status === 'inactive') return 'Inactive';
    return 'Active';
  }
}
