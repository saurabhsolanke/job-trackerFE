import { Component, OnInit, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RouterLink } from '@angular/router';
import { CompanyService } from '../../../core/services/company.service';
import { Company } from '../../../core/models/company.model';
import { PageResponse } from '../../../core/models/application.model';
import { ButtonComponent } from '../../../shared/components/ui/button.component';
import { CardComponent, CardContentComponent, CardHeaderComponent, CardTitleComponent } from '../../../shared/components/ui/card.component';
import { BadgeComponent } from '../../../shared/components/ui/badge.component';

@Component({
  selector: 'app-company-search',
  standalone: true,
  imports: [
    CommonModule, 
    FormsModule, 
    RouterLink, 
    ButtonComponent, 
    CardComponent, 
    CardHeaderComponent, 
    CardTitleComponent, 
    CardContentComponent,
    BadgeComponent
  ],
  template: `
    <div class="space-y-6">
      <!-- Header & Toggle Bar -->
      <div class="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 class="text-2xl font-bold text-zinc-50 tracking-tight">Tracked Companies</h1>
          <p class="text-xs text-zinc-400 mt-0.5">Search and view saved company profiles</p>
        </div>
        <div class="flex items-center gap-3">
          <!-- View Toggle Switch -->
          <div class="inline-flex rounded-md border border-zinc-800 bg-zinc-950 p-1">
            <button (click)="viewMode.set('table')" [ngClass]="viewMode() === 'table' ? 'bg-zinc-800 text-zinc-50' : 'text-zinc-400 hover:text-zinc-200'" class="px-2.5 py-1 text-xs font-medium rounded transition-colors flex items-center gap-1.5">
              <svg class="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 6h16M4 10h16M4 14h16M4 18h16"/></svg>
              Table
            </button>
            <button (click)="viewMode.set('grid')" [ngClass]="viewMode() === 'grid' ? 'bg-zinc-800 text-zinc-50' : 'text-zinc-400 hover:text-zinc-200'" class="px-2.5 py-1 text-xs font-medium rounded transition-colors flex items-center gap-1.5">
              <svg class="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2V6zM14 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2V6zM4 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2v-2zM14 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2v-2z"/></svg>
              Cards
            </button>
          </div>

          <a routerLink="/companies/new">
            <ui-button size="sm">
              <svg class="w-3.5 h-3.5 mr-1.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4v16m8-8H4"/>
              </svg>
              Add Company
            </ui-button>
          </a>
        </div>
      </div>

      <!-- Search Bar -->
      <div class="relative">
        <svg class="w-4 h-4 absolute left-3 top-2.5 text-zinc-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"/>
        </svg>
        <input type="text" [(ngModel)]="searchQuery" (input)="onSearch()" placeholder="Search company by name..."
          class="flex h-9 w-full rounded-md border border-zinc-800 bg-zinc-950 pl-9 pr-3 py-1 text-sm text-zinc-50 shadow-sm placeholder:text-zinc-500 focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-zinc-300">
      </div>

      <div *ngIf="isLoading()" class="p-8 text-center text-xs text-zinc-500">
        Loading companies...
      </div>

      <div *ngIf="!isLoading() && companies().length === 0" class="p-8 text-center text-xs text-zinc-500">
        No companies found matching your search.
      </div>

      <!-- Option 1: Table List View -->
      <ui-card *ngIf="!isLoading() && companies().length > 0 && viewMode() === 'table'">
        <ui-card-content customClass="p-0">
          <div class="relative w-full overflow-auto">
            <table class="w-full caption-bottom text-xs">
              <thead class="[&_tr]:border-b border-zinc-800">
                <tr class="border-b transition-colors hover:bg-zinc-800/50">
                  <th class="h-10 px-4 text-left align-middle font-medium text-zinc-400 w-16">ID</th>
                  <th class="h-10 px-4 text-left align-middle font-medium text-zinc-400">Company Name</th>
                  <th class="h-10 px-4 text-left align-middle font-medium text-zinc-400">Links</th>
                  <th class="h-10 px-4 text-left align-middle font-medium text-zinc-400">Notes</th>
                </tr>
              </thead>
              <tbody class="[&_tr:last-child]:border-0 divide-y divide-zinc-800">
                <tr *ngFor="let company of companies()" class="transition-colors hover:bg-zinc-800/50">
                  <td class="p-4 align-middle font-mono text-zinc-500">#{{ company.id }}</td>
                  <td class="p-4 align-middle font-semibold text-zinc-50 text-sm">
                    {{ company.name }}
                  </td>
                  <td class="p-4 align-middle">
                    <div class="flex items-center gap-2">
                      <a *ngIf="company.website_url || company.websiteUrl" [href]="company.website_url || company.websiteUrl" target="_blank">
                        <ui-button variant="outline" size="sm" customClass="h-7 text-xs px-2.5">
                          🌐 Website
                        </ui-button>
                      </a>
                      <a *ngIf="company.career_page_url || company.careerPageUrl" [href]="company.career_page_url || company.careerPageUrl" target="_blank">
                        <ui-button variant="secondary" size="sm" customClass="h-7 text-xs px-2.5">
                          💼 Careers
                        </ui-button>
                      </a>
                      <span *ngIf="!company.website_url && !company.websiteUrl && !company.career_page_url && !company.careerPageUrl" class="text-zinc-500">—</span>
                    </div>
                  </td>
                  <td class="p-4 align-middle text-zinc-400 max-w-md">
                    <p class="truncate text-xs" [title]="company.notes || ''">
                      {{ company.notes || '—' }}
                    </p>
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
        </ui-card-content>
      </ui-card>

      <!-- Option 2: Cards Grid View -->
      <div *ngIf="!isLoading() && companies().length > 0 && viewMode() === 'grid'" class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        <ui-card *ngFor="let company of companies()">
          <ui-card-header customClass="p-4 flex flex-row items-center justify-between space-y-0 border-b border-zinc-800">
            <ui-card-title customClass="text-sm font-semibold">{{ company.name }}</ui-card-title>
            <ui-badge variant="outline">ID: {{ company.id }}</ui-badge>
          </ui-card-header>
          <ui-card-content customClass="p-4 space-y-3 text-xs">
            <div class="flex items-center gap-2 flex-wrap">
              <a *ngIf="company.website_url || company.websiteUrl" [href]="company.website_url || company.websiteUrl" target="_blank">
                <ui-button variant="outline" size="sm" customClass="h-7 text-xs px-2.5">
                  🌐 Website
                </ui-button>
              </a>
              <a *ngIf="company.career_page_url || company.careerPageUrl" [href]="company.career_page_url || company.careerPageUrl" target="_blank">
                <ui-button variant="secondary" size="sm" customClass="h-7 text-xs px-2.5">
                  💼 Careers
                </ui-button>
              </a>
            </div>
            <p *ngIf="company.notes" class="text-zinc-400 text-xs line-clamp-3 pt-2 border-t border-zinc-800">
              {{ company.notes }}
            </p>
          </ui-card-content>
        </ui-card>
      </div>

    </div>
  `
})
export class CompanySearchComponent implements OnInit {
  companies = signal<Company[]>([]);
  searchQuery = '';
  isLoading = signal(true);
  viewMode = signal<'table' | 'grid'>('table');

  constructor(private companyService: CompanyService) {}

  ngOnInit(): void {
    this.onSearch();
  }

  onSearch(): void {
    this.isLoading.set(true);
    this.companyService.getCompanies(this.searchQuery).subscribe({
      next: (res: PageResponse<Company>) => {
        this.companies.set(res.content);
        this.isLoading.set(false);
      },
      error: () => {
        this.companies.set([]);
        this.isLoading.set(false);
      }
    });
  }
}
