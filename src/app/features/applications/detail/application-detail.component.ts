import { Component, OnInit, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, RouterLink } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { ApplicationService } from '../../../core/services/application.service';
import { NoteService } from '../../../core/services/note.service';
import { JobApplication, PageResponse } from '../../../core/models/application.model';
import { ApplicationNote } from '../../../core/models/note.model';
import { StatusBadgeComponent } from '../../../shared/components/status-badge/status-badge.component';
import { ButtonComponent } from '../../../shared/components/ui/button.component';
import { CardComponent, CardContentComponent, CardHeaderComponent, CardTitleComponent } from '../../../shared/components/ui/card.component';

@Component({
  selector: 'app-application-detail',
  standalone: true,
  imports: [
    CommonModule, 
    RouterLink, 
    FormsModule, 
    StatusBadgeComponent, 
    ButtonComponent, 
    CardComponent, 
    CardHeaderComponent, 
    CardTitleComponent, 
    CardContentComponent
  ],
  template: `
    <div *ngIf="app()" class="space-y-6">
      <!-- Top Action Bar -->
      <div class="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div class="flex items-center gap-3">
            <h1 class="text-2xl font-bold text-zinc-900 dark:text-zinc-50 tracking-tight">{{ app()?.jobTitle }}</h1>
            <app-status-badge [status]="app()!.status"></app-status-badge>
          </div>
          <p class="text-xs text-zinc-500 dark:text-zinc-400 mt-1">
            Company: <span class="font-medium text-zinc-700 dark:text-zinc-300">{{ app()?.company?.name || app()?.companyName || (app()?.companyId ? 'ID: ' + app()?.companyId : 'N/A') }}</span>
            <span *ngIf="app()?.jobLocation"> &bull; {{ app()?.jobLocation }}</span>
          </p>
        </div>

        <div class="flex items-center gap-2">
          <a [routerLink]="['/applications', app()?.id, 'edit']">
            <ui-button variant="outline" size="sm">Edit Details</ui-button>
          </a>
          <a routerLink="/applications">
            <ui-button variant="ghost" size="sm">&larr; Back to List</ui-button>
          </a>
        </div>
      </div>

      <!-- Detail Grid -->
      <div class="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <!-- Main Column: Job Description & Referral Info -->
        <div class="lg:col-span-2 space-y-6">
          <!-- Job Description Card -->
          <ui-card>
            <ui-card-header customClass="p-4 sm:p-6 border-b border-zinc-200 dark:border-zinc-800">
              <ui-card-title>Job Description</ui-card-title>
            </ui-card-header>
            <ui-card-content customClass="p-4 sm:p-6">
              <div class="text-xs text-zinc-700 dark:text-zinc-300 whitespace-pre-wrap leading-relaxed overflow-y-auto font-sans">
                {{ app()?.jobDescription || 'No description added.' }}
              </div>
            </ui-card-content>
          </ui-card>
        </div>

        <!-- Sidebar Meta Info -->
        <div class="space-y-6">
          <ui-card>
            <ui-card-header customClass="p-4 border-b border-zinc-200 dark:border-zinc-800">
              <ui-card-title customClass="text-sm">Metadata & Sourcing</ui-card-title>
            </ui-card-header>
            <ui-card-content customClass="p-4 space-y-3 text-xs">
              <div>
                <span class="font-medium text-zinc-500 block">Date Applied</span>
                <span class="text-zinc-900 dark:text-zinc-50 font-medium">{{ app()?.dateApplied || 'Not specified' }}</span>
              </div>

              <div *ngIf="app()?.jobUrl">
                <span class="font-medium text-zinc-500 block">Job Link</span>
                <a [href]="app()?.jobUrl" target="_blank" class="text-zinc-900 dark:text-zinc-50 underline truncate block">
                  {{ app()?.jobUrl }}
                </a>
              </div>

              <div>
                <span class="font-medium text-zinc-500 block">Referral Contact</span>
                <span class="text-zinc-900 dark:text-zinc-50">{{ app()?.referralName || 'None' }} {{ app()?.referralContact ? '(' + app()?.referralContact + ')' : '' }}</span>
              </div>

              <div>
                <span class="font-medium text-zinc-500 block">Source Channel</span>
                <span class="text-zinc-900 dark:text-zinc-50">{{ app()?.sourceChannel || 'Direct Application' }}</span>
              </div>
            </ui-card-content>
          </ui-card>
           <!-- Application Notes Card -->
          <ui-card>
            <ui-card-header customClass="p-4 sm:p-6 border-b border-zinc-200 dark:border-zinc-800">
              <ui-card-title>Interview Notes & History</ui-card-title>
            </ui-card-header>
            <ui-card-content customClass="p-4 sm:p-6 space-y-4">
              
              <!-- Add Note Form -->
              <div class="space-y-3 bg-zinc-50 dark:bg-zinc-900 p-4 rounded-lg border border-zinc-200 dark:border-zinc-800">
                <input type="text" [(ngModel)]="newNoteContent" placeholder="Add a note or interview outcome..."
                  class="flex h-9 w-full rounded-md border border-zinc-200 bg-white px-3 text-xs shadow-sm focus:outline-none focus:ring-1 focus:ring-zinc-950 dark:border-zinc-800 dark:bg-zinc-950 dark:text-zinc-50">
                <div class="flex items-center justify-between gap-2">
                  <input type="text" [(ngModel)]="newContactPerson" placeholder="Contact person (optional)"
                    class="flex h-8 rounded-md border border-zinc-200 bg-white px-2.5 text-xs shadow-sm focus:outline-none dark:border-zinc-800 dark:bg-zinc-950">
                  <ui-button size="sm" (click)="addNote()" [disabled]="!newNoteContent.trim()">
                    Add Note
                  </ui-button>
                </div>
              </div>

              <!-- Notes List -->
              <div class="space-y-2 mt-4">
                <div *ngFor="let note of notes()" class="p-3 rounded-lg border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-950 text-xs space-y-1">
                  <div class="flex items-center justify-between text-zinc-500">
                    <span class="font-semibold text-zinc-900 dark:text-zinc-50">{{ note.contactPerson || 'General Note' }}</span>
                    <div class="flex items-center gap-2">
                      <span>{{ note.createdAt || 'Just now' }}</span>
                      <button *ngIf="note.id" (click)="deleteNote(note.id)" class="text-red-500 hover:text-red-700 font-bold">&times;</button>
                    </div>
                  </div>
                  <p class="text-zinc-700 dark:text-zinc-300">{{ note.content }}</p>
                </div>

                <div *ngIf="notes().length === 0" class="text-xs text-zinc-400 text-center py-3">
                  No notes logged yet.
                </div>
              </div>
            </ui-card-content>
          </ui-card>
        </div>

      </div>
    </div>
  `
})
export class ApplicationDetailComponent implements OnInit {
  app = signal<JobApplication | null>(null);
  notes = signal<ApplicationNote[]>([]);
  newNoteContent = '';
  newContactPerson = '';

  constructor(
    private route: ActivatedRoute,
    private appService: ApplicationService,
    private noteService: NoteService
  ) {}

  ngOnInit(): void {
    const id = this.route.snapshot.paramMap.get('id');
    if (id) {
      this.loadApp(+id);
      this.loadNotes(+id);
    }
  }

  loadApp(id: number): void {
    this.appService.getApplicationById(id).subscribe({
      next: (data) => this.app.set(data)
    });
  }

  loadNotes(id: number): void {
    this.noteService.getNotes(id).subscribe({
      next: (res: PageResponse<ApplicationNote>) => this.notes.set(res.content),
      error: () => this.notes.set([])
    });
  }

  addNote(): void {
    if (!this.newNoteContent.trim() || !this.app()?.id) return;

    const notePayload: ApplicationNote = {
      applicationId: this.app()!.id!,
      noteType: 'GENERAL',
      content: this.newNoteContent,
      contactPerson: this.newContactPerson || undefined
    };

    this.noteService.addNote(this.app()!.id!, notePayload).subscribe({
      next: (created) => {
        this.notes.update(n => [created, ...n]);
        this.newNoteContent = '';
        this.newContactPerson = '';
      },
      error: () => {
        this.notes.update(n => [notePayload, ...n]);
        this.newNoteContent = '';
        this.newContactPerson = '';
      }
    });
  }

  deleteNote(noteId: number): void {
    if (!this.app()?.id) return;
    this.noteService.deleteNote(this.app()!.id!, noteId).subscribe({
      next: () => this.notes.update(n => n.filter(item => item.id !== noteId))
    });
  }
}
