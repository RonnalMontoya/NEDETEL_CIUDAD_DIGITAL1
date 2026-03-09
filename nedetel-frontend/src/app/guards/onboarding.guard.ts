import { Injectable } from '@angular/core';
import { CanActivate, Router, UrlTree } from '@angular/router';
import { OnboardingService } from 'src/app/services/onboarding.service';

@Injectable({ providedIn: 'root' })
export class OnboardingGuard implements CanActivate {
  constructor(
    private onboarding: OnboardingService,
    private router: Router
  ) {}

  canActivate(): boolean | UrlTree {
    // Si NO ha visto el onboarding, lo obligo a ir a /onboarding
    if (!this.onboarding.hasSeen()) {
      return this.router.parseUrl('/onboarding');
    }
    return true;
  }
}