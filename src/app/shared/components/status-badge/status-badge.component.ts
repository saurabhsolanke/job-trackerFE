import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ApplicationStatus } from '../../../core/models/application.model';
import { BadgeComponent, BadgeVariant } from '../ui/badge.component';

@Component({
  selector: 'app-status-badge',
  standalone: true,
  imports: [CommonModule, BadgeComponent],
  template: `
    <ui-badge [variant]="getVariant()" [customClass]="getCustomClass()">
      <span class="w-1.5 h-1.5 rounded-full mr-1.5" [ngClass]="getDotClasses()"></span>
      {{ status }}
    </ui-badge>
  `
})
export class StatusBadgeComponent {
  @Input({ required: true }) status!: ApplicationStatus;

  getVariant(): BadgeVariant {
    switch (this.status) {
      case 'WISHLIST': return 'secondary';
      case 'APPLIED': return 'outline';
      case 'INTERVIEWING': return 'default';
      case 'OFFER': return 'success';
      case 'REJECTED': return 'destructive';
      case 'WITHDRAWN': return 'warning';
      default: return 'secondary';
    }
  }

  getCustomClass(): string {
    switch (this.status) {
      case 'APPLIED': return 'bg-blue-500/10 text-blue-700 border-blue-200 dark:bg-blue-500/20 dark:text-blue-400 dark:border-blue-800';
      case 'INTERVIEWING': return 'bg-purple-500/10 text-purple-700 border-purple-200 dark:bg-purple-500/20 dark:text-purple-400 dark:border-purple-800';
      default: return '';
    }
  }

  getDotClasses(): string {
    switch (this.status) {
      case 'WISHLIST': return 'bg-zinc-400';
      case 'APPLIED': return 'bg-blue-500';
      case 'INTERVIEWING': return 'bg-purple-500';
      case 'OFFER': return 'bg-emerald-500';
      case 'REJECTED': return 'bg-red-500';
      case 'WITHDRAWN': return 'bg-amber-500';
      default: return 'bg-zinc-400';
    }
  }
}
