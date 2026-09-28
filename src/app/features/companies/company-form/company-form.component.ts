import { Component, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { CompanyService } from '../../../core/services/company.service';
import { ButtonComponent } from '../../../shared/components/ui/button.component';
import { CardComponent, CardContentComponent } from '../../../shared/components/ui/card.component';

@Component({
  selector: 'app-company-form',
  standalone: true,
  imports: [
    CommonModule, 
    ReactiveFormsModule, 
    RouterLink, 
    ButtonComponent, 
    CardComponent, 
    CardContentComponent
  ],
  template: `
    <div class="max-w-2xl mx-auto space-y-6">
      <div class="flex items-center justify-between">
        <div>
          <h1 class="text-2xl font-bold text-zinc-900 dark:text-zinc-50 tracking-tight">Add New Company</h1>
          <p class="text-xs text-zinc-500 dark:text-zinc-400 mt-0.5">Register a company profile for job application tracking</p>
        </div>
        <a routerLink="/companies">
          <ui-button variant="ghost" size="sm">&larr; Back to Companies</ui-button>
        </a>
      </div>

      <ui-card>
        <ui-card-content customClass="p-6 sm:p-8">
          <form [formGroup]="companyForm" (ngSubmit)="onSubmit()" class="space-y-4">
            <div *ngIf="errorMessage()" class="p-3 rounded-md bg-red-50 dark:bg-red-950/50 border border-red-200 dark:border-red-800/50 text-xs text-red-600 dark:text-red-400">
              {{ errorMessage() }}
            </div>

            <div class="space-y-1.5">
              <label for="name" class="text-xs font-medium text-zinc-900 dark:text-zinc-50">Company Name *</label>
              <input id="name" type="text" formControlName="name" placeholder="e.g. Google, Microsoft, Stripe"
                class="flex h-9 w-full rounded-md border border-zinc-200 bg-transparent px-3 py-1 text-sm shadow-sm transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-zinc-950 dark:border-zinc-800">
            </div>

            <div class="space-y-1.5">
              <label for="websiteUrl" class="text-xs font-medium text-zinc-900 dark:text-zinc-50">Website URL</label>
              <input id="websiteUrl" type="url" formControlName="websiteUrl" placeholder="https://company.com"
                class="flex h-9 w-full rounded-md border border-zinc-200 bg-transparent px-3 py-1 text-sm shadow-sm transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-zinc-950 dark:border-zinc-800">
            </div>

            <div class="space-y-1.5">
              <label for="careerPageUrl" class="text-xs font-medium text-zinc-900 dark:text-zinc-50">Career Page URL</label>
              <input id="careerPageUrl" type="url" formControlName="careerPageUrl" placeholder="https://careers.company.com"
                class="flex h-9 w-full rounded-md border border-zinc-200 bg-transparent px-3 py-1 text-sm shadow-sm transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-zinc-950 dark:border-zinc-800">
            </div>

            <div class="space-y-1.5">
              <label for="notes" class="text-xs font-medium text-zinc-900 dark:text-zinc-50">Company Notes</label>
              <textarea id="notes" formControlName="notes" rows="4" placeholder="General info, culture notes, target roles..."
                class="flex w-full rounded-md border border-zinc-200 bg-transparent px-3 py-2 text-sm shadow-sm transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-zinc-950 dark:border-zinc-800"></textarea>
            </div>

            <div class="flex items-center justify-end gap-2 pt-4 border-t border-zinc-200 dark:border-zinc-800">
              <a routerLink="/companies">
                <ui-button variant="outline">Cancel</ui-button>
              </a>
              <ui-button type="submit" [disabled]="companyForm.invalid || isLoading()">
                <span *ngIf="!isLoading()">Save Company</span>
                <span *ngIf="isLoading()">Saving...</span>
              </ui-button>
            </div>
          </form>
        </ui-card-content>
      </ui-card>
    </div>
  `
})
export class CompanyFormComponent {
  companyForm: FormGroup;
  isLoading = signal(false);
  errorMessage = signal<string | null>(null);

  constructor(
    private fb: FormBuilder,
    private companyService: CompanyService,
    private router: Router
  ) {
    this.companyForm = this.fb.group({
      name: ['', [Validators.required]],
      websiteUrl: [''],
      careerPageUrl: [''],
      notes: ['']
    });
  }

  onSubmit(): void {
    if (this.companyForm.invalid) return;

    this.isLoading.set(true);
    this.errorMessage.set(null);

    const val = this.companyForm.value;
    const payload: any = {
      ...val,
      website_url: val.websiteUrl,
      career_page_url: val.careerPageUrl
    };

    this.companyService.createCompany(payload).subscribe({
      next: () => {
        this.isLoading.set(false);
        this.router.navigate(['/companies']);
      },
      error: (err) => {
        this.isLoading.set(false);
        this.errorMessage.set(err.error?.message || 'Failed to create company.');
      }
    });
  }
}
