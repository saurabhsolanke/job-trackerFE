import { Component, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { AuthService } from '../../../core/services/auth.service';
import { ButtonComponent } from '../../../shared/components/ui/button.component';
import { CardComponent, CardContentComponent } from '../../../shared/components/ui/card.component';

@Component({
  selector: 'app-register',
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
    <div class="min-h-screen bg-zinc-50 dark:bg-zinc-950 flex flex-col justify-center items-center py-12 px-4 sm:px-6 lg:px-8">
      <div class="w-full max-w-sm space-y-6">
        <div class="flex flex-col items-center text-center">
          <div class="w-10 h-10 rounded-lg bg-zinc-900 dark:bg-zinc-50 flex items-center justify-center text-zinc-50 dark:text-zinc-900 font-bold text-lg mb-2 shadow-sm">
            J
          </div>
          <h1 class="text-xl font-semibold tracking-tight text-zinc-900 dark:text-zinc-50">Create an account</h1>
          <p class="text-xs text-zinc-500 dark:text-zinc-400 mt-1">Enter your details below to create your JobHunt account</p>
        </div>

        <ui-card>
          <ui-card-content customClass="p-6">
            <form [formGroup]="registerForm" (ngSubmit)="onSubmit()" class="space-y-4">
              <div *ngIf="errorMessage()" class="p-3 rounded-md bg-red-50 dark:bg-red-950/50 border border-red-200 dark:border-red-800/50 text-xs text-red-600 dark:text-red-400">
                {{ errorMessage() }}
              </div>

              <div class="space-y-1.5">
                <label for="fullName" class="text-xs font-medium leading-none text-zinc-900 dark:text-zinc-50">Full Name</label>
                <input id="fullName" type="text" formControlName="fullName"
                  class="flex h-9 w-full rounded-md border border-zinc-200 bg-transparent px-3 py-1 text-sm shadow-sm transition-colors placeholder:text-zinc-500 focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-zinc-950 dark:border-zinc-800 dark:placeholder:text-zinc-400 dark:focus-visible:ring-zinc-300"
                  placeholder="Saurabh Solanke">
              </div>

              <div class="space-y-1.5">
                <label for="email" class="text-xs font-medium leading-none text-zinc-900 dark:text-zinc-50">Email</label>
                <input id="email" type="email" formControlName="email"
                  class="flex h-9 w-full rounded-md border border-zinc-200 bg-transparent px-3 py-1 text-sm shadow-sm transition-colors placeholder:text-zinc-500 focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-zinc-950 dark:border-zinc-800 dark:placeholder:text-zinc-400 dark:focus-visible:ring-zinc-300"
                  placeholder="m@example.com">
              </div>

              <div class="space-y-1.5">
                <label for="password" class="text-xs font-medium leading-none text-zinc-900 dark:text-zinc-50">Password</label>
                <input id="password" type="password" formControlName="password"
                  class="flex h-9 w-full rounded-md border border-zinc-200 bg-transparent px-3 py-1 text-sm shadow-sm transition-colors placeholder:text-zinc-500 focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-zinc-950 dark:border-zinc-800 dark:placeholder:text-zinc-400 dark:focus-visible:ring-zinc-300"
                  placeholder="••••••••">
              </div>

              <ui-button type="submit" [disabled]="registerForm.invalid || isLoading()" customClass="w-full mt-2">
                <span *ngIf="!isLoading()">Create Account</span>
                <span *ngIf="isLoading()">Creating account...</span>
              </ui-button>
            </form>

            <div class="mt-4 text-center text-xs text-zinc-500 dark:text-zinc-400">
              Already have an account?
              <a routerLink="/login" class="underline underline-offset-4 text-zinc-900 dark:text-zinc-50 font-medium">Sign in</a>
            </div>
          </ui-card-content>
        </ui-card>
      </div>
    </div>
  `
})
export class RegisterComponent {
  registerForm: FormGroup;
  isLoading = signal(false);
  errorMessage = signal<string | null>(null);

  constructor(
    private fb: FormBuilder,
    private authService: AuthService,
    private router: Router
  ) {
    this.registerForm = this.fb.group({
      fullName: ['', [Validators.required]],
      email: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required, Validators.minLength(6)]]
    });
  }

  onSubmit(): void {
    if (this.registerForm.invalid) return;

    this.isLoading.set(true);
    this.errorMessage.set(null);

    this.authService.register(this.registerForm.value).subscribe({
      next: () => {
        this.isLoading.set(false);
        this.router.navigate(['/dashboard']);
      },
      error: (err) => {
        this.isLoading.set(false);
        this.errorMessage.set(err.error?.message || 'Registration failed.');
      }
    });
  }
}
