import { bootstrapApplication } from '@angular/platform-browser';
import { provideRouter, withPreloading, NoPreloading } from '@angular/router';
import { provideHttpClient, withInterceptorsFromDi } from '@angular/common/http';
import { provideAnimations } from '@angular/platform-browser/animations';
import { provideIonicAngular } from '@ionic/angular/standalone';
import { Capacitor } from '@capacitor/core';

import { AppComponent } from './app/app.component';
import { routes } from './app/app-routing.module';

if (typeof window !== 'undefined') {
  if (Capacitor.isNativePlatform()) {
    document.body.classList.add('native-lite');
  }

  window.addEventListener('error', event => {
    console.error('[Window Error]:', event.error || event.message);
  });

  window.addEventListener('unhandledrejection', event => {
    console.error('[Unhandled Promise Rejection]:', event.reason);
  });
}

console.log('[Bootstrap] Starting Nedetel City Digital application...');
console.log('[Bootstrap] Router preloading strategy: NoPreloading');

bootstrapApplication(AppComponent, {
  providers: [
    provideRouter(routes, withPreloading(NoPreloading)),
    provideHttpClient(withInterceptorsFromDi()),
    provideAnimations(),
    provideIonicAngular(),
  ],
}).catch(err => {
  console.error('[Bootstrap Error]:', err);
});




