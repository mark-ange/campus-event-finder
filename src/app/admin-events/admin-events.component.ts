import { Component, OnInit, inject } from '@angular/core';
import { NgFor } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { AuthService } from '../services/auth.service';

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
  registrations?: number;
}

@Component({
  selector: 'app-admin-events',
  standalone: true,
  templateUrl: './admin-events.component.html',
  styleUrls: ['./admin-events.component.css'],
  imports: [NgFor, FormsModule]
})
export class AdminEventsComponent implements OnInit {
  private router = inject(Router);
  private authService = inject(AuthService);

  events: HubEvent[] = [];
  isEditing = false;
  editingEventId: string | null = null;
  
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
    image: ''
  };

  categories = [
    'Technology', 'Engineering', 'Healthcare', 'Business', 
    'Arts', 'Sports', 'Academic', 'Social', 'Workshop', 'Seminar'
  ];

  ngOnInit(): void {
    // Check if user is logged in and is admin
    if (!this.authService.isLoggedIn() || !this.authService.isAdmin()) {
      this.router.navigate(['/login']);
      return;
    }
    
    this.loadEvents();
  }

  private loadEvents(): void {
    // Load events from localStorage or API
    const savedEvents = localStorage.getItem('campusEvents');
    if (savedEvents) {
      this.events = JSON.parse(savedEvents);
    } else {
      // Default events for demo
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
        }
      ];
    }
  }

  saveEvents(): void {
    localStorage.setItem('campusEvents', JSON.stringify(this.events));
  }

  addEvent(): void {
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
      registrations: 0
    };

    this.events.unshift(newEvent);
    this.saveEvents();
    this.resetForm();
    alert('Event created successfully!');
  }

  editEvent(event: HubEvent): void {
    this.isEditing = true;
    this.editingEventId = event.id;
    this.formData = { ...event };
  }

  updateEvent(): void {
    const index = this.events.findIndex(e => e.id === this.editingEventId);
    if (index !== -1) {
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
        registrations: this.events[index].registrations // Preserve existing registrations
      };
      this.events[index] = updatedEvent;
      this.saveEvents();
      this.resetForm();
      alert('Event updated successfully!');
    }
  }

  deleteEvent(eventId: string): void {
    if (confirm('Are you sure you want to delete this event?')) {
      this.events = this.events.filter(e => e.id !== eventId);
      this.saveEvents();
      alert('Event deleted successfully!');
    }
  }

  resetForm(): void {
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
      image: ''
    };
  }

  onSubmit(): void {
    if (this.isEditing) {
      this.updateEvent();
    } else {
      this.addEvent();
    }
  }

  cancelEdit(): void {
    this.resetForm();
  }

  goBack(): void {
    this.router.navigate(['/dashboard']);
  }
}
