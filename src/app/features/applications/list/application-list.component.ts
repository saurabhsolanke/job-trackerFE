import { Component, OnInit, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { ApplicationService } from '../../../core/services/application.service';
import { JobApplication, ApplicationStatus, PageResponse } from '../../../core/models/application.model';
import { StatusBadgeComponent } from '../../../shared/components/status-badge/status-badge.component';
import { ButtonComponent } from '../../../shared/components/ui/button.component';
import { CardComponent, CardContentComponent } from '../../../shared/components/ui/card.component';

@Component({
  selector: 'app-application-list',
  standalone: true,
  imports: [
    CommonModule, 
    RouterLink, 
    FormsModule, 
    StatusBadgeComponent, 
    ButtonComponent, 
    CardComponent, 
    CardContentComponent
  ],
  template: `
    <div class="space-y-6">
      <div class="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 class="text-2xl font-bold text-zinc-900 dark:text-zinc-50 tracking-tight">Applications</h1>
          <p class="text-xs text-zinc-500 dark:text-zinc-400 mt-0.5">Filter and manage all your tracked job applications</p>
        </div>
        <a routerLink="/applications/new">
          <ui-button size="sm">
            <svg class="w-3.5 h-3.5 mr-1.5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4v16m8-8H4"/></svg>
            New Application
          </ui-button>
        </a>
      </div>

      <ui-card>
        <!-- Toolbar & Filter -->
        <div class="p-4 border-b border-zinc-200 dark:border-zinc-800 flex flex-col sm:flex-row items-center gap-4 justify-between">
          <div class="flex items-center gap-2 w-full sm:w-auto">
            <label class="text-xs font-medium text-zinc-500 whitespace-nowrap">Filter Status:</label>
            <select [(ngModel)]="selectedStatus" (change)="onFilterChange()"
              class="h-9 rounded-md border border-zinc-200 bg-white px-3 text-xs shadow-sm focus:outline-none focus:ring-1 focus:ring-zinc-950 dark:border-zinc-800 dark:bg-zinc-950 dark:text-zinc-50">
              <option value="">All Statuses</option>
              <option value="WISHLIST">Wishlist</option>
              <option value="APPLIED">Applied</option>
              <option value="INTERVIEWING">Interviewing</option>
              <option value="OFFER">Offer</option>
              <option value="REJECTED">Rejected</option>
              <option value="WITHDRAWN">Withdrawn</option>
            </select>
          </div>

          <div class="text-xs text-zinc-500">
            Showing {{ applications().length }} of {{ totalElements() }} applications
          </div>
        </div>

        <ui-card-content customClass="p-0">
          <div *ngIf="isLoading()" class="p-8 text-center text-xs text-zinc-500">
            Loading applications...
          </div>

          <div *ngIf="!isLoading() && applications().length === 0" class="p-8 text-center text-xs text-zinc-500">
            No applications found matching your criteria.
          </div>

          <div *ngIf="!isLoading() && applications().length > 0" class="relative w-full overflow-auto">
            <table class="w-full caption-bottom text-xs">
              <thead class="[&_tr]:border-b border-zinc-200 dark:border-zinc-800">
                <tr class="border-b transition-colors hover:bg-zinc-100/50 dark:hover:bg-zinc-800/50">
                  <th class="h-10 px-4 text-left align-middle font-medium text-zinc-500">Job Title</th>
                  <th class="h-10 px-4 text-left align-middle font-medium text-zinc-500">Company</th>
                  <th class="h-10 px-4 text-left align-middle font-medium text-zinc-500">Status</th>
                  <th class="h-10 px-4 text-left align-middle font-medium text-zinc-500">Location</th>
                  <th class="h-10 px-4 text-left align-middle font-medium text-zinc-500">Date Applied</th>
                  <th class="h-10 px-4 text-right align-middle font-medium text-zinc-500">Actions</th>
                </tr>
              </thead>
              <tbody class="[&_tr:last-child]:border-0 divide-y divide-zinc-200 dark:divide-zinc-800">
                <tr *ngFor="let app of applications()" class="transition-colors hover:bg-zinc-100/50 dark:hover:bg-zinc-800/50">
                  <td class="p-4 align-middle font-medium text-zinc-900 dark:text-zinc-50">
                    <a [routerLink]="['/applications', app.id]" class="hover:underline">{{ app.jobTitle }}</a>
                  </td>
                  <td class="p-4 align-middle text-zinc-600 dark:text-zinc-400">
                    {{ app.company?.name || app.companyName || 'N/A' }}
                  </td>
                  <td class="p-4 align-middle">
                    <app-status-badge [status]="app.status"></app-status-badge>
                  </td>
                  <td class="p-4 align-middle text-zinc-500">
                    {{ app.jobLocation || 'Remote / N/A' }}
                  </td>
                  <td class="p-4 align-middle text-zinc-500">
                    {{ app.dateApplied || '—' }}
                  </td>
                  <td class="p-4 align-middle text-right space-x-1">
                    <a [routerLink]="['/applications', app.id]">
                      <ui-button variant="ghost" size="sm">View</ui-button>
                    </a>
                    <a [routerLink]="['/applications', app.id, 'edit']">
                      <ui-button variant="outline" size="sm">Edit</ui-button>
                    </a>
                    <ui-button variant="destructive" size="sm" (click)="deleteApp(app.id!)">
                      Delete
                    </ui-button>
                  </td>
                </tr>
              </tbody>
            </table>
          </div>

          <!-- Pagination Bar -->
          <div *ngIf="totalPages() > 1" class="p-4 border-t border-zinc-200 dark:border-zinc-800 flex items-center justify-between">
            <ui-button variant="outline" size="sm" [disabled]="currentPage() === 0" (click)="changePage(currentPage() - 1)">
              Previous
            </ui-button>
            <span class="text-xs text-zinc-500">
              Page {{ currentPage() + 1 }} of {{ totalPages() }}
            </span>
            <ui-button variant="outline" size="sm" [disabled]="currentPage() >= totalPages() - 1" (click)="changePage(currentPage() + 1)">
              Next
            </ui-button>
          </div>
        </ui-card-content>
      </ui-card>
    </div>
  `
})
export class ApplicationListComponent implements OnInit {
  applications = signal<JobApplication[]>([]);
  totalElements = signal(0);
  totalPages = signal(0);
  currentPage = signal(0);
  pageSize = signal(10);
  selectedStatus: string = '';
  isLoading = signal(true);

  constructor(private appService: ApplicationService) {}

  ngOnInit(): void {
    this.loadApplications();
  }

  loadApplications(): void {
    this.isLoading.set(true);
    const statusParam = this.selectedStatus ? (this.selectedStatus as ApplicationStatus) : undefined;
    
    this.appService.getApplications(this.currentPage(), this.pageSize(), statusParam).subscribe({
      next: (res: PageResponse<JobApplication>) => {
        this.applications.set(res.content);
        this.totalElements.set(res.totalElements);
        this.totalPages.set(res.totalPages);
        this.isLoading.set(false);
      },
      error: () => this.isLoading.set(false)
    });
  }

  onFilterChange(): void {
    this.currentPage.set(0);
    this.loadApplications();
  }

  changePage(page: number): void {
    this.currentPage.set(page);
    this.loadApplications();
  }

  deleteApp(id: number): void {
    if (confirm('Are you sure you want to delete this job application?')) {
      this.appService.deleteApplication(id).subscribe({
        next: () => this.loadApplications()
      });
    }
  }
}
