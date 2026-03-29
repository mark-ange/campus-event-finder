import { Injectable } from '@angular/core';
import { UserRole } from './department-directory';

export interface EventComment {
  id: string;
  author: string;
  role: UserRole;
  text: string;
  createdAt: number;
}

@Injectable({
  providedIn: 'root'
})
export class EventEngagementService {
  private readonly likesKey = 'eventLikes';
  private readonly commentsKey = 'eventComments';

  private likesByEventId: Record<string, number> = {};
  private commentsByEventId: Record<string, EventComment[]> = {};

  constructor() {
    this.likesByEventId = this.loadRecord<number>(this.likesKey);
    this.commentsByEventId = this.loadRecord<EventComment[]>(this.commentsKey);
  }

  getLikes(eventId: string): number {
    this.ensureLikeSeed(eventId);
    return this.likesByEventId[eventId] ?? 0;
  }

  like(eventId: string): number {
    const next = this.getLikes(eventId) + 1;
    this.likesByEventId[eventId] = next;
    this.saveRecord(this.likesKey, this.likesByEventId);
    return next;
  }

  getComments(eventId: string): EventComment[] {
    const raw = this.commentsByEventId[eventId];
    if (!Array.isArray(raw)) return [];

    return raw
      .filter(comment => comment && typeof comment === 'object' && typeof comment.text === 'string')
      .slice()
      .sort((a, b) => a.createdAt - b.createdAt);
  }

  getCommentCount(eventId: string): number {
    return this.getComments(eventId).length;
  }

  addComment(
    eventId: string,
    input: { author: string; role: UserRole; text: string }
  ): EventComment | null {
    const text = input.text.trim();
    if (!text) return null;

    const comment: EventComment = {
      id: this.generateId('cmt'),
      author: input.author.trim() || 'Anonymous',
      role: input.role,
      text,
      createdAt: Date.now()
    };

    const existing = this.getComments(eventId);
    existing.push(comment);
    this.commentsByEventId[eventId] = existing;
    this.saveRecord(this.commentsKey, this.commentsByEventId);
    return comment;
  }

  deleteComment(eventId: string, commentId: string): void {
    const existing = this.getComments(eventId);
    const next = existing.filter(comment => comment.id !== commentId);
    this.commentsByEventId[eventId] = next;
    this.saveRecord(this.commentsKey, this.commentsByEventId);
  }

  formatCount(value: number): string {
    if (!Number.isFinite(value)) return '0';
    if (value < 1000) return String(Math.trunc(value));

    const rounded = Math.round((value / 1000) * 10) / 10;
    const text = rounded.toFixed(1).replace(/\.0$/, '');
    return `${text}K`;
  }

  private ensureLikeSeed(eventId: string): void {
    if (typeof this.likesByEventId[eventId] === 'number') return;
    this.likesByEventId[eventId] = this.seedLikes(eventId);
    this.saveRecord(this.likesKey, this.likesByEventId);
  }

  private seedLikes(eventId: string): number {
    if (eventId === 'ev-1') return 1000;
    if (eventId === 'ev-2') return 13000;
    if (eventId === 'ev-3') return 88;
    if (eventId === 'ev-4') return 65;

    return this.hashString(eventId) % 500;
  }

  private hashString(value: string): number {
    let hash = 5381;
    for (let index = 0; index < value.length; index++) {
      hash = (hash * 33) ^ value.charCodeAt(index);
    }
    return hash >>> 0;
  }

  private loadRecord<T>(key: string): Record<string, T> {
    const saved = localStorage.getItem(key);
    if (!saved) return {};

    try {
      const parsed = JSON.parse(saved) as unknown;
      if (parsed && typeof parsed === 'object') {
        return parsed as Record<string, T>;
      }
    } catch {
    }

    return {};
  }

  private saveRecord<T>(key: string, value: Record<string, T>): void {
    localStorage.setItem(key, JSON.stringify(value));
  }

  private generateId(prefix: string): string {
    return `${prefix}_${Math.random().toString(36).slice(2, 10)}_${Date.now()}`;
  }
}
