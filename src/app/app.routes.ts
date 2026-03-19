import { Routes } from '@angular/router';

export const routes: Routes = [
  {
    path: '',
    loadComponent: () =>
      import('./pages/home/home.component').then((m) => m.HomeComponent),
  },
  {
    path: 'devlog',
    loadComponent: () =>
      import('./pages/devlog/devlog.component').then((m) => m.DevlogComponent),
  },
  {
    path: '**',
    redirectTo: '',
  },
];
