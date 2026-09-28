import { Routes } from '@angular/router';
import { authGuard } from './core/guards/auth.guard';
import { noAuthGuard } from './core/guards/no-auth.guard';

export const routes: Routes = [
  { path: '', redirectTo: 'dashboard', pathMatch: 'full' },
  {
    path: 'login',
    canActivate: [noAuthGuard],
    loadComponent: () => import('./features/auth/login/login.component').then(m => m.LoginComponent)
  },
  {
    path: 'register',
    canActivate: [noAuthGuard],
    loadComponent: () => import('./features/auth/register/register.component').then(m => m.RegisterComponent)
  },
  {
    path: 'dashboard',
    canActivate: [authGuard],
    loadComponent: () => import('./features/dashboard/dashboard.component').then(m => m.DashboardComponent)
  },
  {
    path: 'applications',
    canActivate: [authGuard],
    loadComponent: () => import('./features/applications/list/application-list.component').then(m => m.ApplicationListComponent)
  },
  {
    path: 'applications/new',
    canActivate: [authGuard],
    loadComponent: () => import('./features/applications/form/application-form.component').then(m => m.ApplicationFormComponent)
  },
  {
    path: 'applications/:id/edit',
    canActivate: [authGuard],
    loadComponent: () => import('./features/applications/form/application-form.component').then(m => m.ApplicationFormComponent)
  },
  {
    path: 'applications/:id',
    canActivate: [authGuard],
    loadComponent: () => import('./features/applications/detail/application-detail.component').then(m => m.ApplicationDetailComponent)
  },
  {
    path: 'companies',
    canActivate: [authGuard],
    loadComponent: () => import('./features/companies/company-search/company-search.component').then(m => m.CompanySearchComponent)
  },
  {
    path: 'companies/new',
    canActivate: [authGuard],
    loadComponent: () => import('./features/companies/company-form/company-form.component').then(m => m.CompanyFormComponent)
  },
  // {
  //   path: 'playground',
  //   loadComponent: () => import('./playground/playground').then(m => m.Playground)
  // },
  { path: '**', redirectTo: 'dashboard' }
];
