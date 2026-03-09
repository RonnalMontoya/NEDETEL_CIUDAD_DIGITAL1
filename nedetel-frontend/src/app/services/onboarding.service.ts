import { Injectable } from '@angular/core';

const KEY = 'nedetel_onboarding_seen';

@Injectable({ providedIn: 'root' })
export class OnboardingService {
  hasSeen(): boolean {
    return localStorage.getItem(KEY) === '1';
  }

  markSeen(): void {
    localStorage.setItem(KEY, '1');
  }

  reset(): void {
    localStorage.removeItem(KEY);
  }
}