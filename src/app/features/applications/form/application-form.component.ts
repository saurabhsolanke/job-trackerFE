import { Component, OnInit, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { ApplicationService } from '../../../core/services/application.service';
import { CompanyService } from '../../../core/services/company.service';
import { Company } from '../../../core/models/company.model';
import { PageResponse } from '../../../core/models/application.model';
import { ButtonComponent } from '../../../shared/components/ui/button.component';
import { CardComponent, CardContentComponent } from '../../../shared/components/ui/card.component';

@Component({
  selector: 'app-application-form',
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
    <div class="max-w-3xl mx-auto space-y-6">
      <div class="flex items-center justify-between">
        <div>
          <h1 class="text-2xl font-bold text-zinc-900 dark:text-zinc-50 tracking-tight">
            {{ isEditMode() ? 'Edit Application' : 'Create Job Application' }}
          </h1>
          <p class="text-xs text-zinc-500 dark:text-zinc-400 mt-0.5">Fill in the details for your job tracker record</p>
        </div>
        <a routerLink="/applications">
          <ui-button variant="ghost" size="sm">&larr; Back to Applications</ui-button>
        </a>
      </div>

      <ui-card>
        <ui-card-content customClass="p-6 sm:p-8">
          <form [formGroup]="appForm" (ngSubmit)="onSubmit()" class="space-y-6">

            <!-- Primary Section -->
            <div class="space-y-4">
              <h3 class="text-sm font-semibold text-zinc-900 dark:text-zinc-50 border-b border-zinc-200 dark:border-zinc-800 pb-2">Primary Info</h3>
              
              <div class="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div class="space-y-1.5">
                  <div class="flex items-center justify-between">
                    <label class="text-xs font-medium text-zinc-900 dark:text-zinc-50">Company *</label>
                    <a routerLink="/companies/new" class="text-xs underline text-zinc-500 hover:text-zinc-900 dark:hover:text-zinc-50">
                      + Add New
                    </a>
                  </div>
                  <select formControlName="companyId"
                    class="flex h-9 w-full rounded-md border border-zinc-200 bg-white px-3 text-xs shadow-sm focus:outline-none focus:ring-1 focus:ring-zinc-950 dark:border-zinc-800 dark:bg-zinc-950 dark:text-zinc-50">
                    <option [value]="null" disabled>Select a company</option>
                    <option *ngFor="let comp of companies()" [value]="comp.id">{{ comp.name }}</option>
                  </select>
                </div>

                <div class="space-y-1.5">
                  <label class="text-xs font-medium text-zinc-900 dark:text-zinc-50">Job Title *</label>
                  <input type="text" formControlName="jobTitle" placeholder="e.g. Senior Java Backend Engineer"
                    class="flex h-9 w-full rounded-md border border-zinc-200 bg-transparent px-3 py-1 text-sm shadow-sm transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-zinc-950 dark:border-zinc-800">
                </div>
              </div>

              <div class="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div class="space-y-1.5">
                  <label class="text-xs font-medium text-zinc-900 dark:text-zinc-50">Status *</label>
                  <select formControlName="status"
                    class="flex h-9 w-full rounded-md border border-zinc-200 bg-white px-3 text-xs shadow-sm focus:outline-none focus:ring-1 focus:ring-zinc-950 dark:border-zinc-800 dark:bg-zinc-950 dark:text-zinc-50">
                    <option value="WISHLIST">Wishlist</option>
                    <option value="APPLIED">Applied</option>
                    <option value="INTERVIEWING">Interviewing</option>
                    <option value="OFFER">Offer</option>
                    <option value="REJECTED">Rejected</option>
                    <option value="WITHDRAWN">Withdrawn</option>
                  </select>
                </div>

                <div class="space-y-1.5">
                  <label class="text-xs font-medium text-zinc-900 dark:text-zinc-50">Job Location</label>
                  <input type="text" formControlName="jobLocation" placeholder="e.g. San Francisco, CA / Remote"
                    class="flex h-9 w-full rounded-md border border-zinc-200 bg-transparent px-3 py-1 text-sm shadow-sm transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-zinc-950 dark:border-zinc-800">
                </div>
              </div>

              <div class="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div class="space-y-1.5">
                  <label class="text-xs font-medium text-zinc-900 dark:text-zinc-50">Job Posting URL</label>
                  <input type="url" formControlName="jobUrl" placeholder="https://careers.company.com/job/123"
                    class="flex h-9 w-full rounded-md border border-zinc-200 bg-transparent px-3 py-1 text-sm shadow-sm transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-zinc-950 dark:border-zinc-800">
                </div>

                <div class="space-y-1.5">
                  <label class="text-xs font-medium text-zinc-900 dark:text-zinc-50">Date Applied</label>
                  <input type="date" formControlName="dateApplied"
                    class="flex h-9 w-full rounded-md border border-zinc-200 bg-transparent px-3 py-1 text-sm shadow-sm transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-zinc-950 dark:border-zinc-800">
                </div>
              </div>
            </div>

            <!-- Sourcing & Referral Section -->
            <div class="space-y-4 pt-4 border-t border-zinc-200 dark:border-zinc-800">
              <h3 class="text-sm font-semibold text-zinc-900 dark:text-zinc-50">Referral & Sourcing</h3>
              
              <div class="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div class="space-y-1.5">
                  <label class="text-xs font-medium text-zinc-900 dark:text-zinc-50">Referral Name</label>
                  <input type="text" formControlName="referralName" placeholder="e.g. John Smith"
                    class="flex h-9 w-full rounded-md border border-zinc-200 bg-transparent px-3 py-1 text-sm shadow-sm transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-zinc-950 dark:border-zinc-800">
                </div>

                <div class="space-y-1.5">
                  <label class="text-xs font-medium text-zinc-900 dark:text-zinc-50">Referral Contact</label>
                  <input type="text" formControlName="referralContact" placeholder="e.g. john@company.com"
                    class="flex h-9 w-full rounded-md border border-zinc-200 bg-transparent px-3 py-1 text-sm shadow-sm transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-zinc-950 dark:border-zinc-800">
                </div>
              </div>

              <div class="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div class="space-y-1.5">
                  <label class="text-xs font-medium text-zinc-900 dark:text-zinc-50">Source Channel</label>
                  <input type="text" formControlName="sourceChannel" placeholder="e.g. LinkedIn, Recruiter Outreach"
                    class="flex h-9 w-full rounded-md border border-zinc-200 bg-transparent px-3 py-1 text-sm shadow-sm transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-zinc-950 dark:border-zinc-800">
                </div>

                <div class="space-y-1.5">
                  <label class="text-xs font-medium text-zinc-900 dark:text-zinc-50">Source URL</label>
                  <input type="url" formControlName="sourceUrl" placeholder="https://linkedin.com/jobs/view/..."
                    class="flex h-9 w-full rounded-md border border-zinc-200 bg-transparent px-3 py-1 text-sm shadow-sm transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-zinc-950 dark:border-zinc-800">
                </div>
              </div>
            </div>

            <!-- Description Section -->
            <div class="space-y-4 pt-4 border-t border-zinc-200 dark:border-zinc-800">
              <h3 class="text-sm font-semibold text-zinc-900 dark:text-zinc-50">Full Job Description</h3>
              
              <div class="space-y-1.5">
                <textarea formControlName="jobDescription" rows="6" placeholder="Paste full job description here..."
                  class="flex w-full rounded-md border border-zinc-200 bg-transparent px-3 py-2 text-sm shadow-sm transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-zinc-950 dark:border-zinc-800"></textarea>
              </div>
            </div>

            <div class="flex items-center justify-end gap-2 pt-4 border-t border-zinc-200 dark:border-zinc-800">
              <a routerLink="/applications">
                <ui-button variant="outline">Cancel</ui-button>
              </a>
              <ui-button type="submit" [disabled]="appForm.invalid || isLoading()">
                {{ isEditMode() ? 'Update Application' : 'Save Application' }}
              </ui-button>
            </div>

          </form>
        </ui-card-content>
      </ui-card>
    </div>
  `
})
export class ApplicationFormComponent implements OnInit {
  appForm: FormGroup;
  companies = signal<Company[]>([]);
  isEditMode = signal(false);
  appId = signal<number | null>(null);
  isLoading = signal(false);

  constructor(
    private fb: FormBuilder,
    private appService: ApplicationService,
    private companyService: CompanyService,
    private route: ActivatedRoute,
    private router: Router
  ) {
    this.appForm = this.fb.group({
      companyId: [null, [Validators.required]],
      jobTitle: ['', [Validators.required]],
      status: ['APPLIED', [Validators.required]],
      jobLocation: [''],
      jobUrl: [''],
      dateApplied: [new Date().toISOString().substring(0, 10)],
      referralName: [''],
      referralContact: [''],
      sourceChannel: [''],
      sourceUrl: [''],
      jobDescription: ['']
    });
  }

  ngOnInit(): void {
    this.loadCompanies();

    const id = this.route.snapshot.paramMap.get('id');
    if (id) {
      this.isEditMode.set(true);
      this.appId.set(+id);
      this.loadApplication(+id);
    }
  }

  loadCompanies(): void {
    this.companyService.getCompanies('', 0, 100).subscribe({
      next: (res: PageResponse<Company>) => {
        this.companies.set(res.content);
        if (res.content.length > 0 && !this.appForm.get('companyId')?.value) {
          this.appForm.patchValue({ companyId: res.content[0].id });
        }
      },
      error: () => this.companies.set([])
    });
  }

  loadApplication(id: number): void {
    this.isLoading.set(true);
    this.appService.getApplicationById(id).subscribe({
      next: (app: any) => {
        this.appForm.patchValue({
          companyId: app.company_id ?? app.companyId,
          jobTitle: app.job_title ?? app.jobTitle,
          status: app.status,
          jobLocation: app.job_location ?? app.jobLocation,
          jobUrl: app.job_url ?? app.jobUrl,
          dateApplied: app.date_applied ?? app.dateApplied,
          referralName: app.referral_name ?? app.referralName,
          referralContact: app.referral_contact ?? app.referralContact,
          sourceChannel: app.source_channel ?? app.sourceChannel,
          sourceUrl: app.source_url ?? app.sourceUrl,
          jobDescription: app.job_description ?? app.jobDescription
        });
        this.isLoading.set(false);
      },
      error: () => this.isLoading.set(false)
    });
  }

  onSubmit(): void {
    if (this.appForm.invalid) return;

    this.isLoading.set(true);
    const formVal = this.appForm.value;
    const payload: any = {
      ...formVal,
      company_id: formVal.companyId,
      job_title: formVal.jobTitle,
      job_location: formVal.jobLocation,
      job_url: formVal.jobUrl,
      date_applied: formVal.dateApplied,
      referral_name: formVal.referralName,
      referral_contact: formVal.referralContact,
      source_channel: formVal.sourceChannel,
      source_url: formVal.sourceUrl,
      job_description: formVal.jobDescription
    };

    if (this.isEditMode() && this.appId()) {
      this.appService.updateApplication(this.appId()!, payload).subscribe({
        next: () => this.router.navigate(['/applications', this.appId()]),
        error: () => this.isLoading.set(false)
      });
    } else {
      this.appService.createApplication(payload).subscribe({
        next: (created) => this.router.navigate(['/applications', created.id || '']),
        error: () => this.isLoading.set(false)
      });
    }
  }
}
