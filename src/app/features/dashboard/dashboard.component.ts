import { Component, OnInit, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { ApplicationService } from '../../core/services/application.service';
import { JobApplication, PageResponse } from '../../core/models/application.model';
import { StatusBadgeComponent } from '../../shared/components/status-badge/status-badge.component';
import { ButtonComponent } from '../../shared/components/ui/button.component';
import { CardComponent, CardContentComponent, CardDescriptionComponent, CardHeaderComponent, CardTitleComponent } from '../../shared/components/ui/card.component';

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [
    CommonModule, 
    RouterLink, 
    StatusBadgeComponent, 
    ButtonComponent, 
    CardComponent, 
    CardHeaderComponent, 
    CardTitleComponent, 
    CardDescriptionComponent,
    CardContentComponent
  ],
  template: `
    <div class="space-y-6">
      <div class="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 class="text-2xl font-bold text-zinc-900 dark:text-zinc-50 tracking-tight">Dashboard</h1>
          <p class="text-xs text-zinc-500 dark:text-zinc-400 mt-0.5">Overview and summary of your active job search</p>
        </div>
        <a routerLink="/applications/new">
          <ui-button size="sm">
            <svg class="w-3.5 h-3.5 mr-1.5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4v16m8-8H4"/></svg>
            Add Application
          </ui-button>
        </a>
      </div>

      <!-- Stats Grid -->
      <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <ui-card>
          <ui-card-header customClass="p-4 flex flex-row items-center justify-between space-y-0 pb-2">
            <span class="text-xs font-medium text-zinc-500 dark:text-zinc-400">Total Applications</span>
            <svg class="w-4 h-4 text-zinc-500" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"/></svg>
          </ui-card-header>
          <ui-card-content customClass="px-4 pb-4">
            <div class="text-2xl font-bold text-zinc-900 dark:text-zinc-50">{{ totalCount() }}</div>
          </ui-card-content>
        </ui-card>

        <ui-card>
          <ui-card-header customClass="p-4 flex flex-row items-center justify-between space-y-0 pb-2">
            <span class="text-xs font-medium text-zinc-500 dark:text-zinc-400">Interviewing</span>
            <svg class="w-4 h-4 text-purple-500" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z"/></svg>
          </ui-card-header>
          <ui-card-content customClass="px-4 pb-4">
            <div class="text-2xl font-bold text-zinc-900 dark:text-zinc-50">{{ interviewingCount() }}</div>
          </ui-card-content>
        </ui-card>

        <ui-card>
          <ui-card-header customClass="p-4 flex flex-row items-center justify-between space-y-0 pb-2">
            <span class="text-xs font-medium text-zinc-500 dark:text-zinc-400">Offers</span>
            <svg class="w-4 h-4 text-emerald-500" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7"/></svg>
          </ui-card-header>
          <ui-card-content customClass="px-4 pb-4">
            <div class="text-2xl font-bold text-zinc-900 dark:text-zinc-50">{{ offerCount() }}</div>
          </ui-card-content>
        </ui-card>

        <ui-card>
          <ui-card-header customClass="p-4 flex flex-row items-center justify-between space-y-0 pb-2">
            <span class="text-xs font-medium text-zinc-500 dark:text-zinc-400">Wishlist</span>
            <svg class="w-4 h-4 text-zinc-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 5a2 2 0 012-2h10a2 2 0 012 2v16l-7-3.5L5 21V5z"/></svg>
          </ui-card-header>
          <ui-card-content customClass="px-4 pb-4">
            <div class="text-2xl font-bold text-zinc-900 dark:text-zinc-50">{{ wishlistCount() }}</div>
          </ui-card-content>
        </ui-card>
      </div>

      <!-- Recent Applications Table Card -->
      <ui-card>
        <ui-card-header customClass="p-4 sm:p-6 flex flex-row items-center justify-between space-y-0 border-b border-zinc-200 dark:border-zinc-800">
          <div>
            <ui-card-title>Recent Applications</ui-card-title>
            <ui-card-description customClass="mt-1">Recent job applications added to your tracker</ui-card-description>
          </div>
          <a routerLink="/applications" class="text-xs font-medium text-zinc-900 dark:text-zinc-50 underline underline-offset-4 hover:opacity-80">
            View all &rarr;
          </a>
        </ui-card-header>

        <ui-card-content customClass="p-0">
          <div *ngIf="isLoading()" class="p-8 text-center text-xs text-zinc-500">
            Loading applications...
          </div>

          <div *ngIf="!isLoading() && recentApps().length === 0" class="p-8 text-center text-xs text-zinc-500">
            No job applications tracked yet.
          </div>

          <div *ngIf="!isLoading() && recentApps().length > 0" class="relative w-full overflow-auto">
            <table class="w-full caption-bottom text-xs">
              <thead class="[&_tr]:border-b border-zinc-200 dark:border-zinc-800">
                <tr class="border-b transition-colors hover:bg-zinc-100/50 dark:hover:bg-zinc-800/50">
                  <th class="h-10 px-4 text-left align-middle font-medium text-zinc-500 dark:text-zinc-400">Job Title</th>
                  <th class="h-10 px-4 text-left align-middle font-medium text-zinc-500 dark:text-zinc-400">Company</th>
                  <th class="h-10 px-4 text-left align-middle font-medium text-zinc-500 dark:text-zinc-400">Status</th>
                  <th class="h-10 px-4 text-left align-middle font-medium text-zinc-400">Applied Date</th>
                  <th class="h-10 px-4 text-right align-middle font-medium text-zinc-500 dark:text-zinc-400">Action</th>
                </tr>
              </thead>
              <tbody class="[&_tr:last-child]:border-0 divide-y divide-zinc-200 dark:divide-zinc-800">
                <tr *ngFor="let app of recentApps()" class="transition-colors hover:bg-zinc-100/50 dark:hover:bg-zinc-800/50">
                  <td class="p-4 align-middle font-medium text-zinc-900 dark:text-zinc-50">
                    <a [routerLink]="['/applications', app.id]" class="hover:underline">{{ app.job_title || app.jobTitle }}</a>
                  </td>
                  <td class="p-4 align-middle text-zinc-600 dark:text-zinc-400">
                    {{ app.company?.name || app.company_name || app.companyName || 'N/A' }}
                  </td>
                  <td class="p-4 align-middle">
                    <app-status-badge [status]="app.status"></app-status-badge>
                  </td>
                  <td class="p-4 align-middle text-zinc-500">
                    {{ app.date_applied || app.dateApplied || '—' }}
                  </td>
                  <td class="p-4 align-middle text-right">
                    <a [routerLink]="['/applications', app.id]">
                      <ui-button variant="ghost" size="sm">Details</ui-button>
                    </a>
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
        </ui-card-content>
      </ui-card>
    </div>
  `
})
export class DashboardComponent implements OnInit {
  recentApps = signal<JobApplication[]>([]);
  totalCount = signal(0);
  interviewingCount = signal(0);
  offerCount = signal(0);
  wishlistCount = signal(0);
  isLoading = signal(true);

  constructor(private appService: ApplicationService) {}

  ngOnInit(): void {
    this.appService.getApplications(0, 10).subscribe({
      next: (res: PageResponse<JobApplication>) => {
        this.recentApps.set(res.content);
        this.totalCount.set(res.totalElements);
        
        this.interviewingCount.set(res.content.filter((a: JobApplication) => a.status === 'INTERVIEWING').length);
        this.offerCount.set(res.content.filter((a: JobApplication) => a.status === 'OFFER').length);
        this.wishlistCount.set(res.content.filter((a: JobApplication) => a.status === 'WISHLIST').length);
        
        this.isLoading.set(false);
      },
      error: () => this.isLoading.set(false)
    });
  }
}
