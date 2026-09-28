import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink, RouterLinkActive } from '@angular/router';
import { AuthService } from '../../../core/services/auth.service';
import { ButtonComponent } from '../ui/button.component';

@Component({
  selector: 'app-navbar',
  standalone: true,
  imports: [CommonModule, RouterLink, RouterLinkActive, ButtonComponent],
  template: `
    <header class="h-14 border-b border-zinc-200 dark:border-zinc-800 bg-white/95 dark:bg-zinc-950/95 backdrop-blur sticky top-0 z-40 px-4 sm:px-8 flex items-center justify-between">
      <div class="flex items-center gap-6">
        <a routerLink="/dashboard" class="flex items-center gap-2 font-semibold text-sm tracking-tight text-zinc-900 dark:text-zinc-50">
          <div class="w-6 h-6 rounded bg-zinc-900 dark:bg-zinc-50 flex items-center justify-center text-zinc-50 dark:text-zinc-900 text-xs font-bold">
            J
          </div>
          <span>JobHunt</span>
        </a>

        <nav class="hidden md:flex items-center gap-1">
          <a routerLink="/dashboard" routerLinkActive="text-zinc-900 dark:text-zinc-50 font-semibold" class="px-3 py-1.5 rounded-md text-xs font-medium text-zinc-500 hover:text-zinc-900 dark:text-zinc-400 dark:hover:text-zinc-50 transition-colors">
            Dashboard
          </a>
          <a routerLink="/applications" routerLinkActive="text-zinc-900 dark:text-zinc-50 font-semibold" class="px-3 py-1.5 rounded-md text-xs font-medium text-zinc-500 hover:text-zinc-900 dark:text-zinc-400 dark:hover:text-zinc-50 transition-colors">
            Applications
          </a>
          <a routerLink="/companies" routerLinkActive="text-zinc-900 dark:text-zinc-50 font-semibold" class="px-3 py-1.5 rounded-md text-xs font-medium text-zinc-500 hover:text-zinc-900 dark:text-zinc-400 dark:hover:text-zinc-50 transition-colors">
            Companies
          </a>
        </nav>
      </div>

      <div class="flex items-center gap-2">
        <a routerLink="/applications/new">
          <ui-button size="sm">
            <svg class="w-3.5 h-3.5 mr-1.5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4v16m8-8H4"/></svg>
            New Application
          </ui-button>
        </a>
        <ui-button variant="ghost" size="sm" (click)="logout()">
          Logout
        </ui-button>
      </div>
    </header>
  `
})
export class NavbarComponent {
  constructor(public authService: AuthService) {}

  logout(): void {
    this.authService.logout();
  }
}
