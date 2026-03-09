import { ErrorHandler, NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { RouteReuseStrategy } from '@angular/router';

import { IonicModule, IonicRouteStrategy } from '@ionic/angular';

import { AppRoutingModule } from './app-routing.module';

class GlobalErrorHandler implements ErrorHandler {
  handleError(error: unknown): void {
    const err = error as { message?: string; stack?: string; ngErrorCode?: string };

    console.error('GlobalErrorHandler message:', err?.message ?? '(no message)');
    console.error('GlobalErrorHandler stack:', err?.stack ?? '(no stack)');
    console.error('GlobalErrorHandler code:', err?.ngErrorCode ?? '(no code)');
    console.error('GlobalErrorHandler raw:', error);
  }
}

@NgModule({
  imports: [BrowserModule, BrowserAnimationsModule, IonicModule.forRoot(), AppRoutingModule],
  providers: [
    { provide: RouteReuseStrategy, useClass: IonicRouteStrategy },
    { provide: ErrorHandler, useClass: GlobalErrorHandler },
  ],
})
export class AppModule {}
