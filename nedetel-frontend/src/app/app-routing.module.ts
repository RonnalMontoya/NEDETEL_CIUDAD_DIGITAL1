import { NgModule } from '@angular/core';
import { PreloadAllModules, RouterModule, Routes } from '@angular/router';
import { AuthGuard } from './core/guards/auth.guard';
import { RoleGuard } from './core/guards/role.guard';

export const routes: Routes = [
  // ✅ Entrada única de la app
  { path: '', redirectTo: 'start', pathMatch: 'full' },

  // ✅ Start / Boot: aquí decides onboarding vs login vs dashboard
  {
    path: 'start',
    loadComponent: () =>
      import('./pages/boot/boot.page').then(m => m.BootPage),
  },

  // Onboarding (4 pasos)
  {
    path: 'onboarding/1',
    loadComponent: () =>
      import('./pages/onboarding/step1/onboarding-step1.page').then(
        m => m.OnboardingStep1Page
      ),
  },
  {
    path: 'onboarding/2',
    loadComponent: () =>
      import('./pages/onboarding/step2/onboarding-step2.page').then(
        m => m.OnboardingStep2Page
      ),
  },
  {
    path: 'onboarding/3',
    loadComponent: () =>
      import('./pages/onboarding/step3/onboarding-step3.page').then(
        m => m.OnboardingStep3Page
      ),
  },
  {
    path: 'onboarding/4',
    loadComponent: () =>
      import('./pages/onboarding/step4/onboarding-step4.page').then(
        m => m.OnboardingStep4Page
      ),
  },

  // Auth
  {
    path: 'login',
    loadComponent: () =>
      import('./pages/login/login.page').then(m => m.LoginPage),
  },
  {
    path: 'register',
    loadComponent: () =>
      import('./pages/register/register.page').then(m => m.RegisterPage),
  },

  // App protegida
  {
    path: 'dashboard',
    canActivate: [AuthGuard],
    loadComponent: () =>
      import('./pages/dashboard/dashboard.page').then(m => m.DashboardPage),
  },
  {
    path: 'telecomunicaciones',
    loadChildren: () =>
      import('./home/home.module').then(m => m.HomePageModule),
  },
  {
    path: 'home',
    redirectTo: 'telecomunicaciones',
    pathMatch: 'full',
  },
  {
    path: 'visitas',
    canActivate: [AuthGuard, RoleGuard],
    data: { roles: ['admin', 'operaciones', 'seguridad'] },
    loadComponent: () =>
      import('./pages/visitas/visitas.page').then(m => m.VisitasPage),
  },
  {
    path: 'trabajos',
    canActivate: [AuthGuard, RoleGuard],
    data: { roles: ['admin', 'operaciones', 'tecnico'] },
    loadComponent: () =>
      import('./pages/trabajos/trabajos.page').then(m => m.TrabajosPage),
  },
  {
    path: 'mantenimiento',
    canActivate: [AuthGuard],
    loadComponent: () =>
      import('./pages/mantenimiento/mantenimiento.page').then(
        m => m.MantenimientoPage
      ),
  },
  {
    path: 'equipos',
    canActivate: [AuthGuard],
    loadComponent: () =>
      import('./pages/equipos/equipos.page').then(m => m.EquiposPage),
  },
  {
    path: 'limpieza',
    canActivate: [AuthGuard, RoleGuard],
    data: { roles: ['admin', 'seguridad', 'operaciones'] },
    loadComponent: () =>
      import('./pages/limpieza/limpieza.page').then(m => m.LimpiezaPage),
  },
  {
    path: 'reportes',
    canActivate: [AuthGuard],
    loadComponent: () =>
      import('./pages/reportes/reportes.page').then(m => m.ReportesPage),
  },

  // ✅ Catch-all SIEMPRE al final
  { path: '**', redirectTo: 'start' },
];

@NgModule({
  imports: [
    RouterModule.forRoot(routes, {
      preloadingStrategy: PreloadAllModules,
    }),
  ],
  exports: [RouterModule],
})
export class AppRoutingModule {}