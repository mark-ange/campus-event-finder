import { Injectable } from '@angular/core';
import { UserRole } from './department-directory';
import { HubEvent } from './event-store';

const LIKES_STORAGE_KEY = 'eventLikes';
const COMMENTS_STORAGE_KEY = 'eventComments';
const SHARES_STORAGE_KEY = 'eventShares';
const ATTENDANCE_RATE_STORAGE_KEY = 'eventAttendanceRates';
const FEEDBACK_BASELINE_STORAGE_KEY = 'eventFeedbackBaselines';

export interface EventComment {
  id: string;
  author: string;
  role: UserRole;
  text: string;
  createdAt: string;
}

interface EventCommentInput {
  author: string;
  role: UserRole;
  text: string;
}

@Injectable({
  providedIn: 'root'
})
export class EventEngagementService {
  getLikes(eventId: string): number {
    return this.getNumberMetric(LIKES_STORAGE_KEY, eventId, () => 18 + (this.hashValue(eventId) % 145));
  }

  like(eventId: string): number {
    const nextLikes = this.getLikes(eventId) + 1;
    this.saveNumberMetric(LIKES_STORAGE_KEY, eventId, nextLikes);
    return nextLikes;
  }

  getShares(eventId: string): number {
    return this.getNumberMetric(SHARES_STORAGE_KEY, eventId, () => 5 + (this.hashValue(`share-${eventId}`) % 42));
  }

  trackShare(eventId: string): number {
    const nextShares = this.getShares(eventId) + 1;
    this.saveNumberMetric(SHARES_STORAGE_KEY, eventId, nextShares);
    return nextShares;
  }

  getComments(eventId: string): EventComment[] {
    const store = this.loadCommentStore();
    const existing = store[eventId];
    if (existing && existing.length > 0) {
      return this.sortComments(existing);
    }

    const seeded = this.createSeedComments(eventId);
    if (seeded.length > 0) {
      store[eventId] = seeded;
      this.saveCommentStore(store);
    }

    return this.sortComments(seeded);
  }

  getCommentCount(eventId: string): number {
    return this.getComments(eventId).length;
  }

  addComment(eventId: string, input: EventCommentInput): EventComment {
    const store = this.loadCommentStore();
    const comments = this.getComments(eventId).slice();
    const comment: EventComment = {
      id: `comment-${Date.now()}-${Math.abs(this.hashValue(input.text)).toString(36)}`,
      author: input.author.trim() || 'Anonymous',
      role: input.role,
      text: input.text.trim(),
      createdAt: new Date().toISOString()
    };

    comments.unshift(comment);
    store[eventId] = comments;
    this.saveCommentStore(store);
    return comment;
  }

  deleteComment(eventId: string, commentId: string): void {
    const store = this.loadCommentStore();
    const comments = this.getComments(eventId).filter(comment => comment.id !== commentId);
    store[eventId] = comments;
    this.saveCommentStore(store);
  }

  getAttendance(event: Pick<HubEvent, 'id' | 'registrations' | 'capacity'>): number {
    const attendanceRate = this.getAttendanceRate(event.id);
    const registered = Math.max(0, event.registrations || 0);

    if (registered === 0) {
      return 0;
    }

    const estimatedAttendance = Math.round(registered * attendanceRate);
    return Math.min(registered, Math.max(0, estimatedAttendance));
  }

  getFeedbackScore(event: Pick<HubEvent, 'id' | 'registrations' | 'capacity'>): number {
    const baseline = this.getFeedbackBaseline(event.id);
    const attendanceRate = event.registrations > 0 ? this.getAttendance(event) / event.registrations : 0;
    const likeBoost = Math.min(0.45, this.getLikes(event.id) / 260);
    const commentBoost = Math.min(0.3, this.getCommentCount(event.id) / 24);
    const shareBoost = Math.min(0.2, this.getShares(event.id) / 90);
    const attendanceBoost = Math.min(0.4, attendanceRate * 0.45);
    const score = baseline + likeBoost + commentBoost + shareBoost + attendanceBoost;

    return Math.min(5, Math.round(score * 10) / 10);
  }

  formatCount(value: number): string {
    if (value >= 1_000_000) {
      return `${(value / 1_000_000).toFixed(value >= 10_000_000 ? 0 : 1)}M`;
    }

    if (value >= 1_000) {
      return `${(value / 1_000).toFixed(value >= 10_000 ? 0 : 1)}K`;
    }

    return `${value}`;
  }

  private getAttendanceRate(eventId: string): number {
    return this.getNumberMetric(
      ATTENDANCE_RATE_STORAGE_KEY,
      eventId,
      () => 0.62 + ((this.hashValue(`attendance-${eventId}`) % 28) / 100)
    );
  }

  private getFeedbackBaseline(eventId: string): number {
    return this.getNumberMetric(
      FEEDBACK_BASELINE_STORAGE_KEY,
      eventId,
      () => 3.2 + ((this.hashValue(`feedback-${eventId}`) % 8) / 10)
    );
  }

  private createSeedComments(eventId: string): EventComment[] {
    const commentCount = (this.hashValue(`comment-count-${eventId}`) % 3) + 1;
    const authors = ['Alex Rivera', 'Morgan Lee', 'Jamie Cruz', 'Taylor Ramos', 'Casey Santos'];
    const feedback = [
      'Looking forward to this event.',
      'Please share the final venue details soon.',
      'This looks helpful for our department.',
      'Will certificates be available for attendees?',
      'The lineup for this one looks really strong.'
    ];

    return Array.from({ length: commentCount }, (_, index) => {
      const hash = this.hashValue(`${eventId}-${index}`);
      const createdAt = new Date(Date.now() - (index + 1) * 86_400_000);
      return {
        id: `seed-${eventId}-${index}`,
        author: authors[hash % authors.length],
        role: hash % 5 === 0 ? 'student' : 'admin',
        text: feedback[hash % feedback.length],
        createdAt: createdAt.toISOString()
      } satisfies EventComment;
    });
  }

  private getNumberMetric(storageKey: string, eventId: string, seedFactory: () => number): number {
    const store = this.loadNumberStore(storageKey);
    const savedValue = store[eventId];
    if (typeof savedValue === 'number' && Number.isFinite(savedValue)) {
      return savedValue;
    }

    const seededValue = seedFactory();
    store[eventId] = seededValue;
    this.saveNumberStore(storageKey, store);
    return seededValue;
  }

  private saveNumberMetric(storageKey: string, eventId: string, value: number): void {
    const store = this.loadNumberStore(storageKey);
    store[eventId] = value;
    this.saveNumberStore(storageKey, store);
  }

  private loadNumberStore(storageKey: string): Record<string, number> {
    const raw = localStorage.getItem(storageKey);
    if (!raw) {
      return {};
    }

    try {
      const parsed = JSON.parse(raw) as unknown;
      return this.isNumberRecord(parsed) ? parsed : {};
    } catch {
      return {};
    }
  }

  private saveNumberStore(storageKey: string, value: Record<string, number>): void {
    localStorage.setItem(storageKey, JSON.stringify(value));
  }

  private loadCommentStore(): Record<string, EventComment[]> {
    const raw = localStorage.getItem(COMMENTS_STORAGE_KEY);
    if (!raw) {
      return {};
    }

    try {
      const parsed = JSON.parse(raw) as unknown;
      return this.isCommentRecord(parsed) ? parsed : {};
    } catch {
      return {};
    }
  }

  private saveCommentStore(store: Record<string, EventComment[]>): void {
    localStorage.setItem(COMMENTS_STORAGE_KEY, JSON.stringify(store));
  }

  private sortComments(comments: EventComment[]): EventComment[] {
    return comments.slice().sort((left, right) => right.createdAt.localeCompare(left.createdAt));
  }

  private isNumberRecord(value: unknown): value is Record<string, number> {
    if (!value || typeof value !== 'object') {
      return false;
    }

    return Object.values(value).every(item => typeof item === 'number' && Number.isFinite(item));
  }

  private isCommentRecord(value: unknown): value is Record<string, EventComment[]> {
    if (!value || typeof value !== 'object') {
      return false;
    }

    return Object.values(value).every(item => Array.isArray(item));
  }

  private hashValue(value: string): number {
    let hash = 0;
    for (const character of value) {
      hash = ((hash << 5) - hash + character.charCodeAt(0)) | 0;
    }
    return Math.abs(hash);
  }
}
